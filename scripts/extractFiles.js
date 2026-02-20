#!/usr/bin/env node

// Note that CASC work as chunk of indices, if a certain file in located in another in another indices, 
// the whole chunk will need to be downloaded first. So you may see it pause for a while when extracting files,
// that's because the script is downloading the chunk that contains the file you want to extract.

const { Storage } = require('@jamiephan/casclib');
const os = require('os');
const fs = require('fs');
const path = require('path');

// Configuration
const PRODUCT = "hero"
const REGION = "us"
const TEMP_DIR = `${os.tmpdir()}/${PRODUCT}_${REGION}_temp`;
const FILES_TO_EXTRACT = [
  "mods/**/*.xml",
  "mods/**/*.txt",
  "mods/**/*.galaxy",
  "mods/**/*.StormLayout",
  "mods/**/*.StormHotkeys",
  "mods/**/*.StormStyle",
  "mods/**/*.StormCutscene",
  "mods/**/*.StormComponents",
  "mods/**/*.StormLocale",
]
const TARGET_DIR = path.join(__dirname, "..");

// Initialize Storage
const storage = new Storage();

// Open the storage for hero and us region
storage.openOnline(`${TEMP_DIR}*${PRODUCT}*${REGION}`)

// Extract specified files
FILES_TO_EXTRACT.forEach(pattern => {
  console.log(`Extracting files matching pattern: ${pattern}`);
  // Store all found files in an array first
  let files = [];
  const find = storage.findFirstFile(pattern);
  if (find) {
    files.push(find);
    let next = storage.findNextFile(find);
    while (next) {
      files.push(next);
      next = storage.findNextFile(find);
    }
  }

  console.log(`Found ${files.length} files matching pattern: ${pattern}`);

  
  // Extract each file
  files.forEach((file, i) => {
    // Replace the "\" with "/" in the file name to ensure the correct path structure
    file.fileName = file.fileName.replace(/\\/g, "/");
    console.log(`[${i + 1}/${files.length}] Extracting file: fileSize=${file.fileSize}\tfileName=${file.fileName}`);
    const openedFile = storage.openFile(file.fileName);
    if (openedFile) {
      const openedFileContent = openedFile.readAll();
      const targetFilePath = path.join(TARGET_DIR, file.fileName);
      // ensure the target directory exists
      fs.mkdirSync(path.dirname(targetFilePath), { recursive: true });
      // write the file content to the target file path
      fs.writeFileSync(targetFilePath, openedFileContent, {encoding: "utf8"});
    } else {
      console.error(`Failed to open file: ${file.fileName}`);
    }
    // close the file handle
    openedFile.close();
  });

});

// Close the storage
storage.close();