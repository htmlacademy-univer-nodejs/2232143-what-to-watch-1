import { TMockData } from '../types/mock-data.type.js';
import { CliCommandInterface } from './cli-command.inteface.js';
import got from 'got';
import MovieGenerator from '../common/movie-generator/movie-generator.js';
import chalk from 'chalk';
import TSVFileWriter from '../common/file-writer/tsv-file-writer.js';
import ConsoleLoggerService from '../common/logger/console-logger.service.js';
import { LoggerInterface } from '../common/logger/logger.interface.js';

export default class GenerateCommand implements CliCommandInterface {
  public readonly name = '--generate';
  private initialData!: TMockData;
  private logger: LoggerInterface;

  constructor() {
    this.logger = new ConsoleLoggerService();
  }

  public async execute(...parameters: string[]): Promise<void> {
    const [count, filepath, url] = parameters;
    const offerCount = Number.parseInt(count, 10);

    try {
      this.initialData = await got.get(url).json();
    } catch {
      return this.logger.info(chalk.red(`Can't fetch data from ${url}.`));
    }

    const movieGeneratorString = new MovieGenerator(this.initialData);
    const tsvFileWriter = new TSVFileWriter(filepath);

    for (let i = 0; i < offerCount; i++) {
      await tsvFileWriter.write(movieGeneratorString.generate());
    }

    this.logger.info(chalk.green(`File ${filepath} was created!`));
  }
}
