#include "FileManager.h"

#include <filesystem>
#include <system_error>
#include <chrono>

namespace fs = std::filesystem;

FileMetadata FileManager::getMetadata(
    const std::string& path,
    std::string& error
) {
    FileMetadata item;
    fs::path filePath(path);
    std::error_code ec;

    if (!fs::exists(filePath, ec) || ec) {
        error = "Path does not exist or cannot be accessed.";
        return item;
    }

    item.name = filePath.filename().string();

    if (item.name.empty()) {
        item.name = filePath.string();
    }

    item.path = fs::absolute(filePath, ec).string();

    if (ec) {
        item.path = filePath.string();
    }

    bool isDirectory = fs::is_directory(filePath, ec);

    if (ec) {
        error = "Cannot read item type.";
        return item;
    }

    item.type = isDirectory ? "directory" : "file";
    item.extension = isDirectory ? "" : filePath.extension().string();

    if (!isDirectory) {
        auto size = fs::file_size(filePath, ec);

        if (!ec) {
            item.size = static_cast<long long>(size);
        }
    }

    auto modified = fs::last_write_time(filePath, ec);

    if (!ec) {
        auto systemTime =
            std::chrono::time_point_cast<
                std::chrono::system_clock::duration
            >(
                modified - fs::file_time_type::clock::now()
                + std::chrono::system_clock::now()
            );

        item.modified = static_cast<long long>(
            std::chrono::system_clock::to_time_t(systemTime)
        );
    }

    return item;
}

std::vector<FileMetadata> FileManager::listDirectory(
    const std::string& path,
    std::string& error
) {
    std::vector<FileMetadata> items;
    fs::path directory(path);
    std::error_code ec;

    if (!fs::exists(directory, ec) || ec) {
        error = "Directory does not exist or cannot be accessed.";
        return items;
    }

    if (!fs::is_directory(directory, ec) || ec) {
        error = "The path is not a directory.";
        return items;
    }

    fs::directory_iterator it(
        directory,
        fs::directory_options::skip_permission_denied,
        ec
    );

    fs::directory_iterator end;

    if (ec) {
        error = "Cannot open directory.";
        return items;
    }

    while (it != end) {
        std::string itemError;

        FileMetadata item = getMetadata(
            it->path().string(),
            itemError
        );

        if (itemError.empty()) {
            items.push_back(item);
        }

        it.increment(ec);

        if (ec) {
            error = "Some directory entries could not be read.";
            break;
        }
    }

    return items;
}

std::string FileManager::getParentDirectory(
    const std::string& path
) {
    fs::path current(path);
    fs::path parent = current.parent_path();

    if (parent.empty()) {
        return current.root_path().string();
    }

    return parent.string();
}