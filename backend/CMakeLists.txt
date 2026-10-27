cmake_minimum_required(VERSION 3.20)

project(FolioBackend LANGUAGES CXX)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

include(FetchContent)

FetchContent_Declare(
    json
    URL https://github.com/nlohmann/json/releases/download/v3.12.0/json.tar.xz
)

FetchContent_MakeAvailable(json)

add_executable(file_explorer_backend
    src/main.cpp
    src/FileManager.cpp
    src/SearchEngine.cpp
    src/FileOperations.cpp
)

target_include_directories(file_explorer_backend PRIVATE include)

target_link_libraries(file_explorer_backend PRIVATE nlohmann_json::nlohmann_json)