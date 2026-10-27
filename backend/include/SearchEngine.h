//Name-based search and recursive traversal

#ifndef SEARCH_ENGINE_H
#define SEARCH_ENGINE_H

#include "Types.h"
#include <string>
#include <vector>

class SearchEngine {
public:
    std::vector<FileMetadata> search(
        const std::string& rootPath,
        const std::string& query,
        bool recursive,
        std::string& error
    );
};

#endif