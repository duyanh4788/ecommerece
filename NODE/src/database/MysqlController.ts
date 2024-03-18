import { Sequelize } from 'sequelize';
import { sequelize } from './sequelize';

class MySqlController {
  private sequelize: Sequelize = sequelize;
  private MYSQL_TIMEOUT: number = 10000;
  private connectTimeOut: NodeJS.Timeout;

  public async connectDb() {
    try {
      await this.sequelize.sync({ force: false, alter: false });
      console.log('MySQL server is running');
      if (this.connectTimeOut) {
        clearTimeout(this.connectTimeOut);
      }
    } catch (error) {
      console.log(`MySQL server is ${error}`);
      this.retryConnectDb();
    }
  }

  private async retryConnectDb() {
    this.connectTimeOut = setTimeout(async () => {
      console.log('Retrying connection to MySQL server...');
      await this.connectDb();
    }, this.MYSQL_TIMEOUT);
  }
}

export const mySqlController = new MySqlController();
