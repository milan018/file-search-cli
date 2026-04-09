import fs from "fs/promises";
import path from "path";
async function getAllFiles(folderpath) {
  let results = [];
  try {
    const files = await fs.readdir(folderpath);

    for (const file of files) {
      if (file.startsWith(".")) continue;
      const filepath = path.join(folderpath, file);
      const stats = await fs.stat(filepath);

      if (stats.isDirectory()) {
        results = results.concat(await getAllFiles(filepath));
      } else {
        results.push(filepath);
      }
    }
  } catch (err) {
    console.error(`Error reading directory ${folderpath}:`, err);
  }
  return results;
}

//Extract filename eg report-final.pdf → ["report", "final"]
async function buildindex() {
  const allfiles = await getAllFiles("./");
  const index = {};

  allfiles.forEach((filepath) => {
    const filename = path.basename(filepath);
    const nameWithoutExtension = path.parse(filename).name;
    const parts = nameWithoutExtension.split("-");

    parts.forEach((part) => {
      part = part.toLowerCase(); // normalize

      if (!index[part]) {
        index[part] = new Set(); // use Set to avoid duplicates
      }

      index[part].add(filepath); // ✅ store full path
    });
  });
  const plain_index = Object.fromEntries(
    Object.entries(index).map(([Key, value]) => [Key, Array.from(value)]),
  );
  // Save index to file
  await fs.writeFile(
    ".file-index.json",
    JSON.stringify(plain_index, null, 2),
    "utf8",
  );
  console.log("Index saved to .file-index.json");
}
// Load index from file
async function loadindex() {
  try {
    const data = await fs.readFile(".file-index.json", "utf8");
    const loadedIndex = JSON.parse(data);

    console.log("Loaded index:", loadedIndex);
    return loadedIndex;
  } catch (error) {
    console.log("No index found ....");
    return await buildindex();
  }
}

//build search function
function search(query, lodedindex) {
  const queryParts = query.toLowerCase().split(" ");
  let results = new Set();
  queryParts.forEach((part) => {
    if (lodedindex[part]) {
      lodedindex[part].forEach((filepath) => results.add(filepath));
    }
  });
  return Array.from(results); // convert Set to Array
}

//ADD cli input
import readline from "readline";
async function main() {
  const shouldindex = process.argv.includes("--reindex");
  const loadedindex = shouldindex ? await buildindex() : await loadindex();
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  function startCLI() {
    rl.question("Enter search query: ", (answer) => {
      if (answer.toLowerCase() === "exit") {
        rl.close();
        return;
      }
      const results = search(answer, loadedindex);
      console.log("Search results:", results);
      startCLI();
    });
  }
  startCLI();
}
main();
