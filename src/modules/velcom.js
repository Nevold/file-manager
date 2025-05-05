import process from 'process';
export class Velcom {
  static username = '';

  static getUsername = () => {
    const args = process.argv.slice(2);
    const usernameArg = args.find((arg) => arg.startsWith('--username='));

    if (!usernameArg) {
      console.error('Please provide a username with --username=your_username');
      process.exit(1);
    }

    return usernameArg.split('=').pop() || 'Anonymous';
  };

  static start = () => {
    this.username = this.getUsername();
    console.log(`Welcome to the File Manager,\x1b[33m ${this.username}\x1b[0m!`);
  };
}
