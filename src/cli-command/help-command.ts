import { CliCommandInterface } from './cli-command.inteface';
import chalk from 'chalk';
import ConsoleLoggerService from '../common/logger/console-logger.service.js';
import { LoggerInterface } from '../common/logger/logger.interface.js';

export default class HelpCommand implements CliCommandInterface {
  public readonly name = '--help';
  private logger: LoggerInterface;

  constructor() {
    this.logger = new ConsoleLoggerService();
  }

  public async execute(): Promise<void> {
    this.logger.info(chalk.yellowBright(`
    Программа для подготовки данных для REST API сервера.
    Пример:
        main.js --<command> [--arguments]
    Команды:
        --version:                     # выводит номер версии
        --help:                        # печатает этот текст
        --import <path>:               # импортирует данные из TSV
        --generate <n> <path> <url>:   # генерирует произвольное количество тестовых данных
    `));
  }
}
