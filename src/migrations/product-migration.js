'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Products', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userId: {
        type: Sequelize.STRING
      },
      title: {
        type: Sequelize.STRING
      },
      provinces: {
        type: Sequelize.STRING
      },
      districts: {
        type: Sequelize.STRING
      },
      price: {
        type: Sequelize.STRING
      },
      categoryId: {
        type: Sequelize.STRING
      },
      guests: {
        type: Sequelize.STRING
      },
      bedrooms: {
        type: Sequelize.STRING
      },
      beds: {
        type: Sequelize.STRING
      },
      bathrooms: {
        type: Sequelize.STRING
      },
      checkIn: {
        type: Sequelize.STRING
      },
      checkOut: {
        type: Sequelize.STRING
      },
      description: {
        type: Sequelize.TEXT('long')
      },
      status: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Products');
  }
};