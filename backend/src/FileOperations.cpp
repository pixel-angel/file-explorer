#include "FileOperations.h"

#include <filesystem>
#include <system_error>

namespace fs = std::filesystem;

OperationResult FileOperations::createFolder(
    const std::string& path
) {
    std::error_code ec;

    bool created = fs::create_directory(fs::path(path), ec);

    if (ec) {
        return {false, "Could not create folder: " + ec.message()};
    }

    if (!created) {
        return {false, "Folder already exists or was not created."};
    }

    return {true, "Folder created."};
}

OperationResult FileOperations::renameItem(
    const std::string& source,
    const std::string& destination
) {
    std::error_code ec;

    if (!fs::exists(source, ec) || ec) {
        return {false, "Source does not exist or cannot be accessed."};
    }

    if (fs::exists(destination, ec) && !ec) {
        return {false, "Destination already exists."};
    }

    fs::rename(source, destination, ec);

    if (ec) {
        return {false, "Could not rename item: " + ec.message()};
    }

    return {true, "Item renamed."};
}

OperationResult FileOperations::copyItem(
    const std::string& source,
    const std::string& destination
) {
    std::error_code ec;

    if (!fs::exists(source, ec) || ec) {
        return {false, "Source does not exist or cannot be accessed."};
    }

    if (fs::exists(destination, ec) && !ec) {
        return {false, "Destination already exists."};
    }

    fs::copy(
        source,
        destination,
        fs::copy_options::recursive,
        ec
    );

    if (ec) {
        return {false, "Copy failed: " + ec.message()};
    }

    return {true, "Item copied."};
}

OperationResult FileOperations::moveItem(
    const std::string& source,
    const std::string& destination
) {
    std::error_code ec;

    if (!fs::exists(source, ec) || ec) {
        return {false, "Source does not exist or cannot be accessed."};
    }

    if (fs::exists(destination, ec) && !ec) {
        return {false, "Destination already exists."};
    }

    fs::rename(source, destination, ec);

    if (ec) {
        return {
            false,
            "Move failed. Cross-drive moves may require a "
            "copy-and-delete strategy: " + ec.message()
        };
    }

    return {true, "Item moved."};
}