import os from 'os';
import process from 'process';
import readline from 'readline/promises';
import { Close } from './close.js';
import { COLORS, Constants } from '../shared/constants.js';
import { Utils } from '../shared/utils.js';
import { Navigation } from './navigation.js';
import { FilesOperations } from './files-operations.js';
import { SystemInfo } from './system-info.js';
import { Hash } from './hash.js';
import { CompressOperations } from './compress.js';

export class CommandsController {
  static rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  static mainController = async () => {
    this.rl.on('line', (input) => {
      process.chdir(input.trim());
      Utils.printCurrentDirectory();
    });

    this.rl.on('SIGINT', () => {
      Close.setExit(Constants.EXIT_CODE);
      this.rl.close();
    });

    process.chdir(os.homedir());
    console.log('Starting directory set to home:');
    Utils.printCurrentDirectory();

    while (true) {
      try {
        const input = await this.rl.question('\n> ');

        if (input.toLowerCase() === '.exit') {
          Close.setExit(Constants.EXIT_NAME);
          break;
        }

        const [command, ...args] = input.trim().split(/\s+/);

        switch (command) {
          case 'ls':
            await Navigation.listDirectory();
            break;

          case 'up':
            Navigation.setUpDirectory();
            break;
          case 'cd':
            if (!Utils.isCorrectCommand(args)) {
              continue;
            }
            await Navigation.changeDirectory(args[0]);
            break;

          case 'cat':
            if (!Utils.isCorrectCommand(args)) {
              continue;
            }
            await FilesOperations.readFile(args[0]);
            break;

          case 'add':
            if (!Utils.isCorrectCommand(args)) {
              continue;
            }
            await FilesOperations.createEmptyFile(args[0]);
            break;

          case 'mkdir':
            if (!Utils.isCorrectCommand(args)) {
              continue;
            }
            await FilesOperations.createDirectory(args[0]);
            break;

          case 'rn':
            if (!Utils.isCorrectCommandForMultArgs(args)) {
              continue;
            }
            await FilesOperations.renameFile(...args);
            break;

          case 'cp':
            if (!Utils.isCorrectCommandForMultArgs(args)) {
              continue;
            }
            await FilesOperations.copyFile(...args);
            break;

          case 'mv':
            if (!Utils.isCorrectCommandForMultArgs(args)) {
              continue;
            }
            await FilesOperations.moveFile(...args);
            break;

          case 'rm':
            if (!Utils.isCorrectCommand(args)) {
              continue;
            }
            await FilesOperations.removeFile(args[0]);
            break;

          case 'os':
            if (!Utils.isCorrectCommand(args)) {
              continue;
            }
            await SystemInfo.getInfo(args[0]);
            break;

          case 'hash':
            if (!Utils.isCorrectCommand(args)) {
              continue;
            }
            await Hash.getHash(args[0]);
            break;

          case 'compress':
            if (!Utils.isCorrectCommandForMultArgs(args)) {
              continue;
            }
            await CompressOperations.compress(...args);
            break;

          case 'decompress':
            if (!Utils.isCorrectCommandForMultArgs(args)) {
              continue;
            }
            await CompressOperations.decompress(...args);
            break;

          default:
            console.log(`Invalid input: ${COLORS.RED}Unknown command${COLORS.RESET_RED}`);
        }
      } catch (err) {
        if (err.code === 'ABORT_ERR') {
          console.error('\nOperation aborted by user.');
          continue;
        }
        console.error(err.message);
      }
    }

    this.rl.close();
  };
}
