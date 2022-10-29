import chalk from 'chalk';
import TSVFileReader from '../common/file-reader/tsv-file-reader.js';
import { createMovie, getErrorMessage } from '../utils/common.js';
import { CliCommandInterface } from './cli-command.inteface.js';
import { UserServiceInterface } from '../modules/user/user-service.interface.js';
import { DatabaseInterface } from '../common/db-client/db.interface.js';
import { LoggerInterface } from '../common/logger/logger.interface.js';
import { MovieServiceInterface } from '../modules/movie/movie-service.interface.js';
import { UserModel } from '../modules/user/user.entity.js';
import UserService from '../modules/user/user.service.js';
import ConsoleLoggerService from '../common/logger/console-logger.service.js';
import MovieService from '../modules/movie/movie.service.js';
import { MovieModel } from '../modules/movie/movie.entity.js';
import MongoDBService from '../common/db-client/mongodb.service.js';
import { TMovie } from '../types/movie.type.js';
import { getDBConnectionURI } from '../utils/db.js';

const USER_PASSWORD = '123456';

export default class ImportCommand implements CliCommandInterface {
  public readonly name = '--import';
  private userService!: UserServiceInterface;
  private movieService!: MovieServiceInterface;
  private databaseService!: DatabaseInterface;
  private logger: LoggerInterface;
  private salt!: string;

  constructor() {
    this.onLine = this.onLine.bind(this);
    this.onComplete = this.onComplete.bind(this);

    this.logger = new ConsoleLoggerService();
    this.movieService = new MovieService(this.logger, MovieModel);
    this.userService = new UserService(this.logger, UserModel);
    this.databaseService = new MongoDBService(this.logger);
  }

  private async saveMovie(movie: TMovie) {
    const user = await this.userService.findOrCreate({
      ...movie.user,
      password: USER_PASSWORD
    }, this.salt);

    await this.movieService.create({
      ...movie,
      userId: user.id,
    });
  }

  private async onLine(line: string, resolve: () => void) {
    const movie = createMovie(line);
    this.logger.info(JSON.stringify(movie));
    await this.saveMovie(movie);
    resolve();
  }

  private onComplete(count: number) {
    this.logger.info(chalk.green(`${count} rows imported.`));
    this.databaseService.disconnect();
  }

  async execute(filename: string, user: string, password: string, host: string, port: string, name: string, salt: string): Promise<void> {
    const uri = getDBConnectionURI(user, password, host, Number(port), name);
    this.salt = salt;
    await this.databaseService.connect(uri);

    const fileReader = new TSVFileReader(filename.trim());
    fileReader.on('line', this.onLine);
    fileReader.on('end', this.onComplete);

    try {
      await fileReader.read();
    } catch (err) {
      this.logger.info(chalk.red(`Can't read the file: ${getErrorMessage(err)}`));
    }
  }
}
