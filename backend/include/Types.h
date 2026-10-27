//Structures representing file metadata and operation results
#ifndef TYPES_H
#define TYPES_H

#include <string>
#include <nlohmann/json.hpp>

struct FileMetadata {
    std::string name;
    std::string path;
    std::string type;
    std::string extension;

    long long size = -1;
    long long modified = -1;
};

struct OperationResult {
    bool success = false;
    std::string message;
};

NLOHMANN_DEFINE_TYPE_NON_INTRUSIVE(
    FileMetadata,
    name,
    path,
    type,
    extension,
    size,
    modified
)

NLOHMANN_DEFINE_TYPE_NON_INTRUSIVE(
    OperationResult,
    success,
    message
)

#endif