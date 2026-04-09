import fs from "fs/promises";
import path from "path";

async function contentsearch(files, term) {
  return files.filter(async (file) => {
    const content = await fs.readFile(file, "utf8");
    return content.toLowerCase().includes(term.toLowerCase());
  });
}
contentsearch(["./launch.json"], "configurations").then((results) => {
  console.log("Files containing 'configurations':", results);
});
