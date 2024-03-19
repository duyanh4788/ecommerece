import { QueryInterface, DataTypes } from 'sequelize';
import { dataProducts } from '../../../common/dataProduct';

module.exports = {
  up: async (queryInterface: QueryInterface, Sequelize: typeof DataTypes) => {
    return queryInterface.bulkInsert('products', dataProducts, {});
  },
  down: async (queryInterface: QueryInterface, Sequelize: any) => {
    return queryInterface.bulkDelete('products', null, {});
  }
};

// npx sequelize-cli db:migrate --name createProducts.ts
// npx sequelize-cli db:migrate:undo --name createProducts.ts
