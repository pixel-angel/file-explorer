#include "SearchEngine.h"
#include "FileManager.h"

#include <filesystem>
#include <algorithm>
#include <cctype>
#include <system_error>

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

std::vector<FileMetadata> SearchEngine::search(
    const std::string& rootPath,
    const std::string& query,
    bool recursive,
    std::string& error
) {
    std::vector<FileMetadata> results;
    fs::path root(rootPath);
    std::error_code ec;

    if (!fs::exists(root, ec) || ec ||
        !fs::is_directory(root, ec) || ec) {
        error = "Search path is not an accessible directory.";
        return results;
    }

    FileManager manager;
    std::string needle = lowerText(query);

    auto checkEntry = [&](const fs::directory_entry& entry) {
        std::string name = entry.path().filename().string();

        if (lowerText(name).find(needle) != std::string::npos) {
            std::string itemError;

            FileMetadata item = manager.getMetadata(
                entry.path().string(),
                itemError
            );

            if (itemError.empty()) {
                results.push_back(item);
            }
        }
    };

    if (recursive) {
        fs::recursive_directory_iterator it(
            root,
            fs::directory_options::skip_permission_denied,
            ec
        );

        fs::recursive_directory_iterator end;

        while (!ec && it != end) {
            checkEntry(*it);
            it.increment(ec);
        }
    } else {
        fs::directory_iterator it(
            root,
            fs::directory_options::skip_permission_denied,
            ec
        );

        fs::directory_iterator end;

        while (!ec && it != end) {
            checkEntry(*it);
            it.increment(ec);
        }
    }

    if (ec) {
        error = "Some locations could not be searched.";
    }

    return results;
}