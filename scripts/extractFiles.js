#!/usr/bin/env node

// Note that CASC work as chunk of indices, if a certain file in located in another in another indices,
// the whole chunk will need to be downloaded first. So you may see it pause for a while when extracting files,
// that's because the script is downloading the chunk that contains the file you want to extract.

const { Storage } = require("@jamiephan/casclib");
const os = require("os");
const fs = require("fs");
const path = require("path");
const glob = require("glob");

// Configuration
const PRODUCT = "hero";
const REGION = "eu";
const TEMP_DIR = `${os.tmpdir()}/${PRODUCT}_${REGION}_temp`;

const EXTRACT_FILE_PATTERN =
  /^mods.*\.(xml|txt|galaxy|stormlayout|stormhotkeys|stormstyle|stormcutscene|stormcomponents|stormlocale)$/i;

const TARGET_DIR = path.join(__dirname, "..");
const MODS_DIR = path.join(TARGET_DIR, "mods");

// Initialize Storage
const storage = new Storage();

// Open the storage for hero and us region
storage.openOnline(`${TEMP_DIR}*${PRODUCT}*${REGION}`);

// Delete existing mods directory if exists
if (fs.existsSync(MODS_DIR)) {
  fs.rmSync(MODS_DIR, { recursive: true, force: true });
  console.log(`Deleted existing mods directory.`);
}

// Get full list of game file first for better performance
const totalGameFiles = [];
const find = storage.findFirstFile("");
if (find) {
  totalGameFiles.push(find);
  let next = storage.findNextFile(find);
  while (next) {
    totalGameFiles.push(next);
    next = storage.findNextFile(find);
  }
}

const filteredFiles = totalGameFiles.filter((f) =>
  f.fileName.match(EXTRACT_FILE_PATTERN),
);

console.log(
  `Found ${filteredFiles.length}/${totalGameFiles.length} files matching pattern: ${EXTRACT_FILE_PATTERN}`,
);

// Extract each file
filteredFiles.forEach((file, i) => {
  // Replace the "\" with "/" in the file name to ensure the correct path structure
  file.fileName = file.fileName.replace(/\\/g, "/");
  console.log(
    `[${i + 1}/${filteredFiles.length}] Extracting file: fileSize=${file.contentFlags}\tfileName=${file.fileName}`,
  );
  const openedFile = storage.openFile(file.fileName);
  if (openedFile) {
    const openedFileContent = openedFile.readAll();
    const targetFilePath = path.join(TARGET_DIR, file.fileName);
    // ensure the target directory exists
    fs.mkdirSync(path.dirname(targetFilePath), { recursive: true });
    // write the file content to the target file path
    fs.writeFileSync(targetFilePath, openedFileContent, { encoding: "utf8" });
  } else {
    console.error(`Failed to open file: ${file.fileName}`);
  }
  // close the file handle
  openedFile.close();
});

// Close the storage
storage.close();