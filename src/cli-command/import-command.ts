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

const DB_USER = 'admin';
const DB_PASSWORD = 'test';
const DB_HOST = '127.0.0.1';
const DB_PORT = 27017;
const DB_NAME = 'want-to-watch';
const USER_PASSWORD = '123456';
const SALT = 'Salt123';

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
    console.log(movie);
    await this.saveMovie(movie);
    resolve();
  }

  private onComplete(count: number) {
    console.log(chalk.green(`${count} rows imported.`));
    this.databaseService.disconnect();
  }

  async execute(filename: string): Promise<void> {
    const uri = getDBConnectionURI(DB_USER, DB_PASSWORD, DB_HOST, DB_PORT, DB_NAME);
    this.salt = SALT;
    await this.databaseService.connect(uri);

    const fileReader = new TSVFileReader(filename.trim());
    fileReader.on('line', this.onLine);
    fileReader.on('end', this.onComplete);

    try {
      await fileReader.read();
    } catch (err) {
      console.log(chalk.red(`Can't read the file: ${getErrorMessage(err)}`));
    }
  }
}
