import os from 'os';
import process from 'process';
import { sequelize } from '../database/sequelize';
import { logger } from '../services/loggerservice/Logger';
import { nodeMailerServices } from '../services/nodemailer/MailServices';

export class MonitorSystem {
  private readonly TIMER: number = 5000;

  constructor() {}

  public readMonitorSystem() {
    setInterval(() => {
      const numberConnectDb = sequelize.connectionManager.getConnection.length;
      const cpuCore = os.cpus().length;
      const memory = process.memoryUsage().rss;
      const maxConnect = cpuCore * 5;

      if (numberConnectDb > maxConnect) {
        logger.error('Server over load!!!', { error: `Number Connect DB: ${numberConnectDb} | CPU: ${maxConnect} | MEM: ${memory / 1024 / 1024} MB` });
        nodeMailerServices.sendOverLoadSystem(memory / 1024 / 1024, numberConnectDb);
      }
    }, this.TIMER);
  }
}
