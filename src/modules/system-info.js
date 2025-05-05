import os from 'os';
import process from 'node:process';
import { COLORS, Constants } from '../shared/constants.js';

export class SystemInfo {
  static getEOL = () => {
    const eol = os.EOL;

    console.log('System EOL:');
    if (eol === '\n') {
      console.log(`${COLORS.YELLOW}\\n LF, Unix${COLORS.RESET_YELLOW}`);
    } else if (eol === '\r\n') {
      console.log(`${COLORS.YELLOW}\\r\\n CRLF, Windows${COLORS.RESET_YELLOW}`);
    } else {
      console.log(`Unknown EOL sequence: ${JSON.stringify(eol)}`);
    }
  };

  static getCPU = () => {
    const cpus = os.cpus();

    const lineLength = cpus[0].model.length + Constants.LINE_LENGTH;

    console.log(`Total CPUs: ${cpus.length}`);
    console.log('-'.repeat(lineLength));

    cpus.forEach((cpu, index) => {
      const speedGHz = (cpu.speed / 1000).toFixed(2);
      console.log(`CPU ${index + 1}:`);
      console.log(`  Model: ${cpu.model}`);
      console.log(`  Speed: ${speedGHz} GHz`);
      console.log('-'.repeat(lineLength));
    });
  };

  static getHomeDirectory = () => {
    const homeDir = os.homedir();
    console.log(`Home Directory: ${COLORS.YELLOW}${homeDir}${COLORS.RESET_YELLOW}`);
  };

  static getUsername = () => {
    try {
      const username = os.userInfo().username;
      console.log(`System username: ${COLORS.YELLOW}${username}${COLORS.RESET_YELLOW}`);
    } catch (err) {
      console.error(`FS operation failed: ${err.message}`);
    }
  };

  static getArchitecture = () => {
    console.log(`Architecture: ${COLORS.YELLOW}${process.arch}${COLORS.RESET_YELLOW}`);
  };

  static getInfo = async (command) => {
    try {
      switch (command) {
        case '--EOL':
          this.getEOL();
          break;

        case '--cpus':
          this.getCPU();
          break;

        case '--homedir':
          this.getHomeDirectory();
          break;

        case '--username':
          this.getUsername();
          break;

        case '--architecture':
          this.getArchitecture();
          break;

        default:
          console.log(`Invalid input: ${COLORS.RED}Unknown command${COLORS.RESET_RED}`);
      }
    } catch (err) {
      console.error(err.message);
    }
  };
}
