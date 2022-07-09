# Legend List

## Description

LegendList is a single file todo list aimed at people who work in places where it may not be possible to use online apps such as todoist or ticktick.

LegendList is ultra portable as all styles and assets are packed into a single html file so no web server is required.

LegendList is meant to be used as a file, i.e. double click on the file to go to `file://[location-of-file]` in a browser

## Features

- Data is stored locally via indexdb
- Data can be exported for back up
- Data can be imported
- Fuzzy search in notes

## Demo

Could be used, although you will probably want to open your own copy of LegendList as a file instead.

https://stonefruit.github.io/legendlist/

## Location of storage

If you use the demo site above, the db will be namespaced to the url. However for `file://`, it does not matter what the file path is, they will all use the same indexdb namespace. This means opening LegendList from anywhere in your computer should use the same db storage.
