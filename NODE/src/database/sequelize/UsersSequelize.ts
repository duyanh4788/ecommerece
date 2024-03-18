import { Transaction } from 'sequelize';
import { UserAttributes, UserRole } from '../../interface/UserInterface';
import { IUserRepository } from '../../repository/IUserRepository';
import { UsersModel } from '../model/UsersModel';
import { deCryptFakeId, enCryptFakeId } from '../../utils/fakeid';
import { MainkeysRedis } from '../../interface/KeyRedisInterface';
import { removeFile } from '../../utils/removeFile';
import { redisController } from '../../redis/RedisController';

export class UserSequelize implements IUserRepository {
  async findAllLists(): Promise<UserAttributes[]> {
    return [];
  }

  async findById(userId: string): Promise<UserAttributes> {
    const key = `${MainkeysRedis.USER_ID}${userId}`;
    let userRedis = await redisController.getRedis(key);
    if (!userRedis) {
      const userModel = await UsersModel.findByPk(deCryptFakeId(userId));
      if (!userModel) return;
      userRedis = await redisController.setRedis({ keyValue: key, value: this.transformModelToEntity(userModel) });
    }
    return userRedis;
  }

  async findByEmail(email: string): Promise<UserAttributes> {
    let userRedis = await redisController.getRedis(email);
    if (!userRedis) {
      const userModel = await UsersModel.findOne({ where: { email } });
      if (!userModel) return;
      userRedis = await redisController.setRedis({ keyValue: email, value: this.transformModelToEntity(userModel) });
    }
    return userRedis;
  }

  async createUser(fullName: string, email: string, password: string, phone: string, roleId: UserRole, transactionDb?: Transaction): Promise<UserAttributes> {
    const user = await UsersModel.create({ fullName, email, password, phone, roleId }, transactionDb && { transaction: transactionDb });
    return this.transformModelToEntity(user);
  }

  async updatePasswordByUserId(userId: string, newPassWord: string, email: string, transactionDb: Transaction): Promise<void> {
    await UsersModel.update({ password: newPassWord }, { where: { id: deCryptFakeId(userId) }, transaction: transactionDb });
    await redisController.delRedis(email);
    return;
  }

  async updateProfile(reqBody: UserAttributes, userId: string): Promise<void> {
    const { fullName, phone, password, avatar } = reqBody;
    const user = await UsersModel.findByPk(deCryptFakeId(userId));
    if (fullName) {
      user.fullName = fullName;
    }
    if (phone) {
      user.phone = phone;
    }
    if (password) {
      user.password = password;
    }
    if (user.avatar) {
      removeFile(user.avatar);
    }
    if (avatar) {
      user.avatar = avatar;
    }

    await user.save();
    await redisController.delRedis(user.email);
    await redisController.delRedis(`${MainkeysRedis.USER_ID}${userId}`);
    return;
  }

  /**
   * Transforms database model into domain entity
   * @param model
   */
  private transformModelToEntity(model: UsersModel): UserAttributes {
    if (!model) return;
    const entity: any = {};
    const keysObj = Object.keys(model.dataValues);
    for (let key of keysObj) {
      entity[key] = model[key];
    }
    entity.id = enCryptFakeId(entity.id);
    return entity;
  }
}
