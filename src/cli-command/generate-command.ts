import { TMockData } from '../types/mock-data.type.js';
import { CliCommandInterface } from './cli-command.inteface.js';
import got from 'got';
import MovieGenerator from '../common/movie-generator/movie-generator.js';
import chalk from 'chalk';
import TSVFileWriter from '../common/file-writer/tsv-file-writer.js';

export default class GenerateCommand implements CliCommandInterface {
  public readonly name = "--generate";
  private initialData!: TMockData;

  public async execute(...parameters:string[]): Promise<void> {
    const [count, filepath, url] = parameters;
    const offerCount = Number.parseInt(count, 10);

    try {
      this.initialData = await got.get(url).json();
    } catch {
      return console.log(chalk.red(`Can't fetch data from ${url}.`));
    }

    const movieGeneratorString = new MovieGenerator(this.initialData);
    const tsvFileWriter = new TSVFileWriter(filepath);

    for (let i = 0; i < offerCount; i++) {
      await tsvFileWriter.write(movieGeneratorString.generate());
    }

    console.log(chalk.green(`File ${filepath} was created!`));
  }
}
