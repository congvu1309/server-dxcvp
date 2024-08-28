'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Product extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            Product.hasMany(models.ImageProduct, { foreignKey: 'productId', as: 'imageProductData' })
            Product.hasMany(models.UtilityProduct, { foreignKey: 'productId', as: 'utilityProductData' })
            Product.belongsTo(models.User, { foreignKey: 'userId', targetKey: 'id', as: 'userProductData' })
            Product.hasMany(models.Schedule, { foreignKey: 'productId', as: 'productScheduleData' })
        }
    };
    Product.init({
        userId: DataTypes.STRING,
        title: DataTypes.STRING,
        provinces: DataTypes.STRING,
        districts: DataTypes.STRING,
        price: DataTypes.STRING,
        categoryId: DataTypes.STRING,
        guests: DataTypes.STRING,
        bedrooms: DataTypes.STRING,
        beds: DataTypes.STRING,
        bathrooms: DataTypes.STRING,
        checkIn: DataTypes.STRING,
        checkOut: DataTypes.STRING,
        description: DataTypes.STRING,
        status: DataTypes.STRING,
    }, {
        sequelize,
        modelName: 'Product',
    });
    return Product;
};