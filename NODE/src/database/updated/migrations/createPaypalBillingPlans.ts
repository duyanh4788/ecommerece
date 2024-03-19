import { QueryInterface, DataTypes } from 'sequelize';

module.exports = {
  up: async (queryInterface: QueryInterface, Sequelize: typeof DataTypes) => {
    const plans = [
      { planId: 'P-5G525910MD9927118MSNJZTY', tier: 'starter', frequency: 'monthly', amount: 3, numberProduct: 2, numberItem: 20, isTrial: true, createdAt: new Date(), updatedAt: new Date() },
      {
        planId: 'P-07Y87257R12876459MSNLAAQ',
        tier: 'starter_no_trial',
        frequency: 'monthly',
        amount: 3,
        numberProduct: 2,
        numberItem: 20,
        isTrial: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      { planId: 'P-2HK07811NK472464TMSNJYRI', tier: 'premium', frequency: 'monthly', amount: 5, numberProduct: 3, numberItem: 50, isTrial: true, createdAt: new Date(), updatedAt: new Date() },
      {
        planId: 'P-84S8511897284041AMSNLANA',
        tier: 'premium_no_trial',
        frequency: 'monthly',
        amount: 5,
        numberProduct: 3,
        numberItem: 50,
        isTrial: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      { planId: 'P-8NW02791EN569090XMSNJZKY', tier: 'pro', frequency: 'monthly', amount: 7, numberProduct: 4, numberItem: 100, isTrial: true, createdAt: new Date(), updatedAt: new Date() },
      { planId: 'P-5P3779420G327753MMSNLAVQ', tier: 'pro_no_trial', frequency: 'monthly', amount: 7, numberProduct: 4, numberItem: 100, isTrial: false, createdAt: new Date(), updatedAt: new Date() }
    ];

    return queryInterface.bulkInsert('paypal_billing_plans', plans);
  },
  down: async (queryInterface: QueryInterface, Sequelize: any) => {
    return queryInterface.bulkDelete('paypal_billing_plans', null, {});
  }
};

// npx sequelize-cli db:migrate --name createPaypalBillingPlans.ts
// npx sequelize-cli db:migrate:undo --name createPaypalBillingPlans.ts
