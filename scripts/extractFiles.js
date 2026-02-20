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
const MODS_DIR_BACKUP = path.join(TARGET_DIR, "mods_backup");

// Save a list of current files in the mods directory for backwards compatibility on linux
const PREVIOUS_MODS_FILE_LIST = glob.sync(MODS_DIR + "/**/*", { nodir: true });

/**
 * Get the new file name for the extracted file. If the file already exists in the mods directory (case-insensitive), keep the same name and case for backwards compatibility.
 * @param {string} fileName - The original file name from the storage.
 * @returns {string} - The new file name to be used for extraction.
 */
const getNewFileName = (fileName) => {
  const matchedPreviousFile = PREVIOUS_MODS_FILE_LIST.find(
    (p) =>
      p.toLowerCase().replace(/\\/g, "/") ===
      fileName.toLowerCase().replace(/\\/g, "/"),
  );
  return (matchedPreviousFile || fileName).replace(/\\/g, "/");
};

// Initialize Storage
const storage = new Storage();

// Open the storage for hero and us region
storage.openOnline(`${TEMP_DIR}*${PRODUCT}*${REGION}`);

// Rename current mods directory to mods_old for backup
if (fs.existsSync(MODS_DIR)) {
  fs.renameSync(MODS_DIR, MODS_DIR_BACKUP);
  if (fs.existsSync(MODS_DIR_BACKUP)) fs.rmSync(MODS_DIR_BACKUP, { recursive: true, force: true });
  console.log(`Renamed existing mods directory to ${MODS_DIR_BACKUP} for backup.`);
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
  const newFileName = getNewFileName(file.fileName);
  console.log(
    `[${i + 1}/${filteredFiles.length}] Extracting file: fileSize=${file.contentFlags}\ts=${file.fileName === newFileName}\tfileName=${newFileName}`,
  );
  const openedFile = storage.openFile(newFileName);
  if (openedFile) {
    const openedFileContent = openedFile.readAll();
    const targetFilePath = path.join(TARGET_DIR, newFileName);
    // ensure the target directory exists
    fs.mkdirSync(path.dirname(targetFilePath), { recursive: true });
    // write the file content to the target file path
    fs.writeFileSync(targetFilePath, openedFileContent, { encoding: "utf8" });
  } else {
    console.error(`Failed to open file: ${newFileName}`);
  }
  // close the file handle
  openedFile.close();
});

// Close the storage
storage.close();

fs.rmSync(MODS_DIR_BACKUP, { recursive: true, force: true });
