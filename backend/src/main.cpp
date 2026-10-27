#include "FileManager.h"
#include "SearchEngine.h"
#include "FileOperations.h"

#include <iostream>
#include <string>
#include <algorithm>
#include <cctype>
#include <filesystem>
#include <fstream>
#include <iterator>
#include <system_error>
#include <nlohmann/json.hpp>

using json = nlohmann::json;
namespace fs = std::filesystem;

static std::string lowerText(std::string text) {
    std::transform(
        text.begin(),
        text.end(),
        text.begin(),
        [](unsigned char c) {
            return static_cast<char>(std::tolower(c));
        }
    );

    return text;
}

static json fail(const std::string& message) {
    return {
        {"success", false},
        {"error", message}
    };
}

static bool getString(
    const json& request,
    const std::string& key,
    std::string& value
) {
    if (!request.contains(key) || !request[key].is_string()) {
        return false;
    }

    value = request[key].get<std::string>();
    return true;
}

static json processRequest(const json& request) {
    std::string operation;

    if (!getString(request, "operation", operation)) {
        return fail("Missing or invalid operation.");
    }

    FileManager manager;
    SearchEngine searchEngine;
    FileOperations operations;
    std::string error;

    if (operation == "listDirectory") {
        std::string path;

        if (!getString(request, "path", path)) {
            return fail("Missing path.");
        }

        auto items = manager.listDirectory(path, error);

        json result = {
            {"success", error.empty()},
            {"path", path},
            {"items", items}
        };

        if (!error.empty()) {
            result["error"] = error;
        }

        return result;
    }

    if (operation == "getMetadata") {
        std::string path;

        if (!getString(request, "path", path)) {
            return fail("Missing path.");
        }

        auto item = manager.getMetadata(path, error);

        if (!error.empty()) {
            return fail(error);
        }

        return {
            {"success", true},
            {"item", item}
        };
    }

    if (operation == "getParentDirectory") {
        std::string path;

        if (!getString(request, "path", path)) {
            return fail("Missing path.");
        }

        return {
            {"success", true},
            {"path", manager.getParentDirectory(path)}
        };
    }

    if (operation == "search") {
        std::string path;
        std::string query;

        if (!getString(request, "path", path) ||
            !getString(request, "query", query)) {
            return fail("Missing path or query.");
        }

        bool recursive = request.value("recursive", false);

        auto items = searchEngine.search(
            path,
            query,
            recursive,
            error
        );

        json result = {
            {"success", error.empty()},
            {"items", items}
        };

        if (!error.empty()) {
            result["warning"] = error;
        }

        return result;
    }

    if (operation == "sort") {
        if (!request.contains("items") ||
            !request["items"].is_array()) {
            return fail("Missing items array.");
        }

        std::string field = request.value("field", "name");
        bool descending = request.value("descending", false);
        json items = request["items"];

        if (field != "name" && field != "size" &&
            field != "extension" && field != "modified") {
            return fail("Unsupported sort field.");
        }

        std::sort(
            items.begin(),
            items.end(),
            [&](const json& a, const json& b) {
                if (field == "size" || field == "modified") {
                    long long av = a.value(field, -1LL);
                    long long bv = b.value(field, -1LL);

                    if (av == -1) return false;
                    if (bv == -1) return true;

                    return descending ? av > bv : av < bv;
                }

                std::string av = lowerText(
                    a.value(field, std::string())
                );

                std::string bv = lowerText(
                    b.value(field, std::string())
                );

                return descending ? av > bv : av < bv;
            }
        );

        return {
            {"success", true},
            {"items", items}
        };
    }

    if (operation == "createFolder") {
        std::string path;

        if (!getString(request, "path", path)) {
            return fail("Missing path.");
        }

        auto result = operations.createFolder(path);

        return {
            {"success", result.success},
            {"message", result.message}
        };
    }

    if (operation == "renameItem" ||
        operation == "copyItem" ||
        operation == "moveItem") {
        std::string source;
        std::string destination;

        if (!getString(request, "source", source) ||
            !getString(request, "destination", destination)) {
            return fail("Missing source or destination.");
        }

        OperationResult result;

        if (operation == "renameItem") {
            result = operations.renameItem(source, destination);
        } else if (operation == "copyItem") {
            result = operations.copyItem(source, destination);
        } else {
            result = operations.moveItem(source, destination);
        }

        return {
            {"success", result.success},
            {"message", result.message}
        };
    }

    if (operation == "readPreview") {
        std::string path;

        if (!getString(request, "path", path)) {
            return fail("Missing path.");
        }

        std::error_code ec;

        if (!fs::is_regular_file(path, ec) || ec) {
            return fail("Preview is only available for regular files.");
        }

        auto size = fs::file_size(path, ec);

        if (ec) {
            return fail("Cannot read file size.");
        }

        const long long maxBytes = 64 * 1024;

        if (size > maxBytes) {
            return fail("File is too large for the text preview.");
        }

        std::string extension = lowerText(
            fs::path(path).extension().string()
        );

        if (extension != ".txt" && extension != ".cpp" &&
            extension != ".h" && extension != ".hpp" &&
            extension != ".js" && extension != ".ts" &&
            extension != ".tsx" && extension != ".css" &&
            extension != ".html" && extension != ".json" &&
            extension != ".md" && extension != ".py" &&
            extension != ".xml" && extension != ".csv") {
            return fail("Preview is not supported for this file type.");
        }

        std::ifstream input(path, std::ios::binary);

        if (!input) {
            return fail("Could not open file.");
        }

        std::string content(
            (std::istreambuf_iterator<char>(input)),
            std::istreambuf_iterator<char>()
        );

        return {
            {"success", true},
            {"content", content}
        };
    }

    return fail("Unknown operation.");
}

int main() {
    std::string line;

    while (std::getline(std::cin, line)) {
        try {
            json request = json::parse(line);
            json response = processRequest(request);

            if (request.contains("id")) {
                response["id"] = request["id"];
            }

            std::cout << response.dump() << '\n' << std::flush;
        } catch (const std::exception&) {
            std::cout
                << R"({"success":false,"error":"Invalid request"})"
                << '\n' << std::flush;
        }
    }

    return 0;
}