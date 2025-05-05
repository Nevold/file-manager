import path from 'path';
import { createReadStream } from 'fs';
import { createHash } from 'crypto';
import { COLORS } from '../shared/constants.js';
import { pipeline } from 'stream/promises';
import { Utils } from '../shared/utils.js';

export class Hash {
  static getHash = async (file) => {
    try {
      const normalizedPath = path.normalize(file);
      const filePath = path.resolve(process.cwd(), normalizedPath);
      const hash = createHash('sha256');
      const readableStream = createReadStream(filePath);

      await pipeline(readableStream, async function (source) {
        for await (const chunk of source) {
          hash.update(chunk);
        }
      });

      Utils.printCurrentDirectory();
      console.log(`Hash: ${COLORS.YELLOW}${hash.digest('hex')}${COLORS.RESET_YELLOW}`);
    } catch (err) {
      if (err.code === 'ENOENT') {
        const message = err.message.replace(/^ENOENT:\s*/i, '');
        console.error(`FS operation failed: ${message}`);
      } else {
        console.error(`FS operation failed: ${err.message}`);
      }
    }
  };
}
