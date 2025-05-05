import process from 'process';
import { COLORS } from './constants.js';
import { access, constants, stat } from 'fs/promises';

export class Utils {
  static printCurrentDirectory = () => {
    console.log(`You are currently in ${COLORS.YELLOW}${process.cwd()}${COLORS.RESET_YELLOW}`);
  };

  static isCorrectCommand = (args) => {
    if (args.length === 0) {
      console.log(`Invalid input: ${COLORS.RED}Missing directory path or arguments ${COLORS.RESET_RED}`);
      return false;
    }
    return true;
  };

  static isCorrectCommandForMultArgs = (args) => {
    if (args.length < 2) {
      console.log(`Invalid input: ${COLORS.RED}Missing arguments ${COLORS.RESET_RED}`);
      return false;
    }
    return true;
  };

  static isDirectory = async (filePath) => {
    await access(filePath, constants.F_OK);
    const stats = await stat(filePath);

    if (stats.isDirectory()) {
      console.log(`FS operation failed: ${COLORS.RED}Cannot read a directory as a file${COLORS.RESET_RED}`);
      return true;
    }
    return false;
  };
}
