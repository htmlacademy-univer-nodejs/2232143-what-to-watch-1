import 'reflect-metadata';
import { LoggerInterface } from '../common/logger/logger.interface.js';
import { ConfigInterface } from '../common/config/config.interface.js';
import { inject, injectable } from 'inversify';
import { Component } from '../types/component.type.js';
import { getDBConnectionURI } from '../utils/db.js';
import { DatabaseInterface } from '../common/db-client/db.interface.js';
import express, { Express } from 'express';
import { ControllerInterface } from '../common/controller/controller.interface';
import { ExceptionFilterInterface } from '../common/errors/exception-filter.interface';

@injectable()
export default class Application {
  private expressApp: Express;

  constructor(@inject(Component.LoggerInterface) private logger: LoggerInterface,
    @inject(Component.ConfigInterface) private config: ConfigInterface,
    @inject(Component.DatabaseInterface) private dbClient: DatabaseInterface,
    @inject(Component.MovieController) private movieController: ControllerInterface,
    @inject(Component.ExceptionFilterInterface) private exceptionFilter: ExceptionFilterInterface,
    @inject(Component.UserController) private userController: ControllerInterface,
    @inject(Component.CommentController) private commentController: ControllerInterface) {
    this.expressApp = express();
  }

  initRoutes() {
    this.expressApp.use('/movies', this.movieController.router);
    this.expressApp.use('/users', this.userController.router);
    this.expressApp.use('/comments', this.commentController.router);
  }

  initMiddleware() {
    this.expressApp.use(express.json());
    this.expressApp.use('/upload', express.static(this.config.get('UPLOAD_DIRECTORY')));
  }

  initExceptionFilters() {
    this.expressApp.use(this.exceptionFilter.catch.bind(this.exceptionFilter));
  }

  async init() {
    this.logger.info('Application initialization…');
    this.logger.info(`Get value from env $PORT: ${this.config.get('PORT')}`);

    const uri = getDBConnectionURI(this.config.get('DB_USER'),
      this.config.get('DB_PASSWORD'),
      this.config.get('DB_HOST'),
      this.config.get('DB_PORT'),
      this.config.get('DB_NAME')
    );

    await this.dbClient.connect(uri);

    this.initMiddleware();
    this.initRoutes();
    this.initExceptionFilters();
    const port = this.config.get('PORT');
    this.expressApp.listen(port, () => this.logger.info(`Server started on http://localhost:${port}`));
  }
}
