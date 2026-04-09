# file-search-cli

A CLI tool that indexes and searches files by name using an inverted index

# File Search CLI

A command-line tool that indexes files in a directory and lets you search them by name — fast.

## How It Works

- Recursively scans all files in a folder
- Builds an **inverted index** from filenames (e.g. `report-final.pdf` → `["report", "final"]`)
- Saves the index to disk as JSON so searches are instant
- Supports `--reindex` flag to rebuild when files change

## Usage

Install dependencies:
\```
npm install
\```

Run the search CLI:
\```
node script.js
\```

Force a fresh index rebuild:
\```
node script.js --reindex
\```

Then type any search query:
\```
Enter search query: report final
\```

## Concepts Used

- Recursive async file traversal
- Inverted index data structure
- JSON persistence
- CLI argument parsing with `process.argv`
- Node.js `readline` for interactive input
