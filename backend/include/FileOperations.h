//Create, rename, copy and move

#ifndef FILE_OPERATIONS_H
#define FILE_OPERATIONS_H

#include "Types.h"
#include <string>

class FileOperations {
public:
    OperationResult createFolder(const std::string& path);

    OperationResult renameItem(
        const std::string& source,
        const std::string& destination
    );

    OperationResult copyItem(
        const std::string& source,
        const std::string& destination
    );

    OperationResult moveItem(
        const std::string& source,
        const std::string& destination
    );
};

#endif