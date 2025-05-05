import { CommandsController } from './commands-controller.js';
import { Velcom } from './velcom.js';

export class Api {
  static start = () => {
    Velcom.start();
    CommandsController.mainController();
  };
}
