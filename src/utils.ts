const { appendFile, readFile, writeFile } = require("fs").promises;

export async function addToQueue(queuePath: string, data: Uint8Array) {
  try {
    await appendFile(queuePath, data);
  } catch (error) {
    console.log("Got error when appending to file", error);
    console.log("Going to create a new one", queuePath);
    // create empty file, because it wasn't found
    await writeFile(queuePath, "");
  }
}

export async function moveQueue(queuePath: string) {
  try {
    const data = await readFile(queuePath, "utf8");
    // data is the file contents as a single unified string
    // .split('\n') splits it at each new-line character and all splits are aggregated into an array (i.e. turns it into an array of lines)
    // .slice(1) returns a view into that array starting at the second entry from the front (i.e. the first element, but slice is zero-indexed so the "first" is really the "second")
    // .join() takes that array and re-concatenates it into a string
    var linesExceptFirst = data.split("\n").slice(1).join("\n");
    await writeFile(queuePath, linesExceptFirst);
  } catch (err) {
    console.log("Error reading queue file", queuePath);
  }
}
