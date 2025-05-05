import { createReadStream, createWriteStream } from 'fs';
import path from 'path';
import { createBrotliCompress, createBrotliDecompress } from 'zlib';
import { pipeline } from 'stream/promises';
import { unlink, access, constants } from 'fs/promises';
import { COLORS } from '../shared/constants.js';
import { Utils } from '../shared/utils.js';

export class CompressOperations {
  static compress = async (pathToFile, pathToDestination) => {
    const normalizedOldPath = path.normalize(pathToFile);
    const normalizedNewPath = path.normalize(pathToDestination);
    const inputPath = path.resolve(process.cwd(), normalizedOldPath);
    const outputPath = path.resolve(process.cwd(), normalizedNewPath);

    const readableStream = createReadStream(inputPath, 'utf8');
    const writeStream = createWriteStream(outputPath, { flags: 'a' });
    const brotli = createBrotliCompress();

    try {
      await pipeline(readableStream, brotli, writeStream);
      Utils.printCurrentDirectory();
      console.log(`Successfully compressed file to: ${COLORS.YELLOW}${outputPath}${COLORS.RESET_YELLOW}`);
    } catch (err) {
      if (err.code === 'ENOENT') {
        const message = err.message.replace(/^ENOENT:\s*/i, '');
        console.error(`FS operation failed: ${message}`);
      } else {
        console.error(`FS operation failed: ${err.message}`);
      }
    }
  };

  static decompress = async (pathToFile, pathToDestination) => {
    const normalizedOldPath = path.normalize(pathToFile);
    const normalizedNewPath = path.normalize(pathToDestination);
    const inputPath = path.resolve(process.cwd(), normalizedOldPath);
    const outputPath = path.resolve(process.cwd(), normalizedNewPath);

    const readableStream = createReadStream(inputPath);
    const writeStream = createWriteStream(outputPath);
    const brotli = createBrotliDecompress();

    try {
      await pipeline(readableStream, brotli, writeStream);
      Utils.printCurrentDirectory();
      console.log(`Successfully decompressed file to: ${COLORS.YELLOW}${outputPath}${COLORS.RESET_YELLOW}`);
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
