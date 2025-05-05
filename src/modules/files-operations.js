import path, { join } from 'path';
import { writeFile, readFile, access, constants, stat, mkdir, rename as renameFs } from 'fs/promises';
import process from 'process';
import { Utils } from '../shared/utils.js';
import { COLORS } from '../shared/constants.js';
import fs from 'fs';
import { pipeline } from 'stream/promises';

export class FilesOperations {
  static readFile = async (file) => {
    const normalizedPath = path.normalize(file);
    const filePath = path.resolve(process.cwd(), normalizedPath);

    try {
      await access(filePath, constants.F_OK);
      const stats = await stat(filePath);

      if (stats.isDirectory()) {
        console.log('FS operation failed: Cannot read a directory as a file');
        return;
      }

      await access(filePath, constants.F_OK);
      const content = await readFile(filePath, { encoding: 'utf8' });
      Utils.printCurrentDirectory();
      console.log(content);
    } catch (err) {
      if (err.code === 'ENOENT') {
        const message = err.message.replace(/^ENOENT:\s*/i, '');
        console.log(`FS operation failed: ${message}`);
      } else {
        console.log(`FS operation failed: ${err.message}`);
      }
    }
  };

  static createEmptyFile = async (file) => {
    const dirname = process.cwd();
    const filePath = join(dirname, file);
    const err = new Error(`FS operation failed: ${COLORS.RED}File ${file} already exists${COLORS.RESET_RED}`);

    try {
      if (await Utils.isDirectory(filePath)) {
        return;
      }

      await access(filePath);
      console.error(err.message);
    } catch (error) {
      if (error.code === 'ENOENT') {
        await writeFile(filePath, '');
        Utils.printCurrentDirectory();
        console.log(`File ${COLORS.YELLOW}${file}${COLORS.RESET_YELLOW} created successfully!`);
      } else {
        console.error(`FS operation failed: ${error.message}`);
      }
    }
  };

  static createDirectory = async (newDirName) => {
    const dirname = process.cwd();
    const dirPath = join(dirname, newDirName);

    try {
      await mkdir(dirPath);
      Utils.printCurrentDirectory();
      console.log(`Directory ${COLORS.YELLOW}${newDirName}${COLORS.RESET_YELLOW} created successfully!`);
      return true;
    } catch (err) {
      if (err.code === 'EEXIST') {
        console.error(`FS operation failed: ${COLORS.RED}Directory ${newDirName} already exists${COLORS.RESET_RED}`);
      } else {
        console.error(`FS operation failed: ${err.message}`);
      }
      return false;
    }
  };

  static renameFile = async (pathToFile, newFilename) => {
    const normalizedOldPath = path.normalize(pathToFile);
    const normalizedNewPath = path.normalize(newFilename);
    const oldPath = path.resolve(process.cwd(), normalizedOldPath);
    const newPath = path.resolve(process.cwd(), normalizedNewPath);

    const err = new Error('FS operation failed');

    try {
      if (await Utils.isDirectory(oldPath)) {
        return;
      }

      await access(oldPath, constants.F_OK);
      try {
        await access(newPath, constants.F_OK);
        throw err;
      } catch (error) {
        if (error.code === 'ENOENT') {
          await renameFs(oldPath, newPath);
          Utils.printCurrentDirectory();
          console.log(`File ${COLORS.YELLOW}${pathToFile}${COLORS.RESET_YELLOW} rename successfully!`);
        } else {
          console.error(err.message);
        }
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  static copyFile = async (pathToFile, destinationDir) => {
    const normalizedOldPath = path.normalize(pathToFile);
    const normalizedNewPath = path.normalize(destinationDir);
    const sourcePath = path.resolve(process.cwd(), normalizedOldPath);
    const destinationPath = path.resolve(process.cwd(), normalizedNewPath);

    try {
      await fs.promises.access(sourcePath, fs.constants.F_OK);

      const readableStream = fs.createReadStream(sourcePath);
      const writableStream = fs.createWriteStream(destinationPath);

      await pipeline(readableStream, writableStream);

      Utils.printCurrentDirectory();
      console.log(`File copied successfully to ${COLORS.YELLOW}${destinationPath}${COLORS.RESET_YELLOW}`);
    } catch (err) {
      if (err.code === 'ENOENT') {
        const message = err.message.replace(/^ENOENT:\s*/i, '');
        console.error(`FS operation failed: ${message}`);
      } else {
        console.error(`FS operation failed: ${err.message}`);
      }
    }
  };

  static moveFile = async (pathToFile, destinationDir) => {
    const normalizedOldPath = path.normalize(pathToFile);
    const normalizedNewPath = path.normalize(destinationDir);
    const sourcePath = path.resolve(process.cwd(), normalizedOldPath);
    const destinationPath = path.resolve(process.cwd(), normalizedNewPath);

    try {
      await fs.promises.access(sourcePath, fs.constants.F_OK);

      const readableStream = fs.createReadStream(sourcePath);
      const writableStream = fs.createWriteStream(destinationPath);

      await pipeline(readableStream, writableStream);

      await fs.promises.unlink(sourcePath);

      Utils.printCurrentDirectory();
      console.log(`File moved successfully to ${COLORS.YELLOW}${destinationPath}${COLORS.RESET_YELLOW}`);
    } catch (err) {
      if (err.code === 'ENOENT') {
        const message = err.message.replace(/^ENOENT:\s*/i, '');
        console.error(`FS operation failed: ${message}`);
      } else {
        console.error(`FS operation failed: ${err.message}`);
      }
    }
  };

  static removeFile = async (file) => {
    const normalizedPath = path.normalize(file);
    const filePath = path.resolve(process.cwd(), normalizedPath);

    try {
      await access(filePath, constants.F_OK);
      await fs.promises.unlink(filePath);

      Utils.printCurrentDirectory();
      console.log(`File ${COLORS.YELLOW}${file}${COLORS.RESET_YELLOW} deleted successfully`);
    } catch (err) {
      console.error(`FS operation failed: ${err.message}`);
    }
  };
}
