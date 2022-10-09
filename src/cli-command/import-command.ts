import chalk from 'chalk';
import TSVFileReader from '../common/file-reader/tsv-file-reader.js';
import { createMovie, getErrorMessage } from '../utils/common.js';
import { CliCommandInterface } from './cli-command.inteface.js';

export default class ImportCommand implements CliCommandInterface {
  public readonly name = '--import';
  private onLine(line: string) {
    const offer = createMovie(line);
    console.log(offer);
  }

  private onComplete(count: number) {
    console.log(chalk.green(`${count} rows imported.`));
  }

  public async execute(filename: string): Promise<void> {
    const fileReader = new TSVFileReader(filename.trim());
    fileReader.on("line", this.onLine);
    fileReader.on("end", this.onComplete);

    try {
      await fileReader.read();
    } catch (err) {
      console.log(chalk.red(`Can't read the file: ${getErrorMessage(err)}`));
    }
  }
}
