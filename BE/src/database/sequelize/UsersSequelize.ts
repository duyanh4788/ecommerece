import { Transaction, where } from 'sequelize';
import { UserAttributes, UserRole } from '../../interface/UserInterface';
import { IUserRepository } from '../../repository/IUserRepository';
import { UsersModel } from '../model/UsersModel';
import { deCryptFakeId, enCryptFakeId } from '../../utils/fakeid';

export class UserSequelize implements IUserRepository {
  async findAllLists(): Promise<UserAttributes[]> {
    return [];
  }

  async findById(userId: string): Promise<UserAttributes> {
    const user = await UsersModel.findByPk(deCryptFakeId(userId));
    return this.transformModelToEntity(user);
  }

  async findByEmail(email: string): Promise<UserAttributes> {
    const user = await UsersModel.findOne({ where: { email } });
    return this.transformModelToEntity(user);
  }

  async createUser(fullName: string, email: string, password: string, phone: number, roleId: UserRole, transactionDb?: Transaction): Promise<UserAttributes> {
    const user = await UsersModel.create({ fullName, email, password, phone: phone || 0, roleId }, transactionDb && { transaction: transactionDb });
    return this.transformModelToEntity(user);
  }

  async updatePasswordByUserId(userId: string, newPassWord: string, transactionDb: Transaction): Promise<void> {
    await UsersModel.update({ password: newPassWord }, { where: { id: deCryptFakeId(userId) }, transaction: transactionDb });
  }

  async updateProfile(reqBody: UserAttributes, userId: string): Promise<UserAttributes> {
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
    if (avatar) {
      user.avatar = avatar;
    }
    await user.save();
    return this.transformModelToEntity(user);
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
