//Directory listing, metadata and directory-related functionality

#ifndef FILE_MANAGER_H
#define FILE_MANAGER_H

#include "Types.h"
#include <string>
#include <vector>

class FileManager {
public:
    std::vector<FileMetadata> listDirectory(
        const std::string& path,
        std::string& error
    );

    FileMetadata getMetadata(
        const std::string& path,
        std::string& error
    );

    std::string getParentDirectory(const std::string& path);
};

#endif