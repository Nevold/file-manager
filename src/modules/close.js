import { Velcom } from './velcom.js';
export class Close {
  static setExit = (massage) => {
    console.log(`You entered the exit command:\x1b[33m ${massage}\x1b[0m`);
    console.log(`Thank you for using File Manager, \x1b[33m${Velcom.username}\x1b[0m, goodbye!`);
    process.exit();
  };
}
