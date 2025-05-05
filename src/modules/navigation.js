import os from 'os';
import path from 'path';
import process from 'process';
import fs from 'fs/promises';
import { Utils } from '../shared/utils.js';

export class Navigation {
  static rootDir = path.parse(os.homedir()).root;

  static changeDirectory = async (newDir) => {
    const isWithinRoot = (targetDir) => {
      return path.resolve(targetDir).startsWith(this.rootDir);
    };

    try {
      const targetDir = path.resolve(newDir);

      if (!isWithinRoot(targetDir)) {
        console.log('Cannot go above the root directory.');
        return false;
      }

      process.chdir(targetDir);

      Utils.printCurrentDirectory();
      return true;
    } catch (err) {
      console.log('Operation failed: Directory does not exist or is inaccessible.');
      return false;
    }
  };

  static setUpDirectory = () => {
    const currentDir = process.cwd();
    if (currentDir === this.rootDir) {
      console.log('Already at root directory. Cannot go higher.');
      return false;
    }

    const parentDir = path.dirname(currentDir);

    try {
      process.chdir(parentDir);
      Utils.printCurrentDirectory();
      return true;
    } catch (err) {
      console.log('Operation failed: Cannot access parent directory.');
      return false;
    }
  };

  static listDirectory = async () => {
    try {
      const items = await fs.readdir(process.cwd(), { withFileTypes: true });

      const dirs = items
        .filter((item) => item.isDirectory())
        .map((dir) => ({ Name: dir.name, Type: 'directory' }))
        .sort((a, b) => a.Name.localeCompare(b.Name));

      const files = items
        .filter((item) => item.isFile())
        .map((file) => ({ Name: file.name, Type: 'file' }))
        .sort((a, b) => a.Name.localeCompare(b.Name));

      const allItems = [...dirs, ...files];

      Utils.printCurrentDirectory();

      if (allItems.length === 0) {
        console.log('Directory is empty.');
        return;
      }

      console.table(allItems);
    } catch (err) {
      console.log('Operation failed: Cannot read directory contents.');
    }
  };
}
