'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class UtilityProduct extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            UtilityProduct.belongsTo(models.Product, { foreignKey: 'productId', targetKey: 'id', as: 'utilityProductData' })

        }
    };
    UtilityProduct.init({
        productId: DataTypes.STRING,
        utilityId: DataTypes.STRING,
    }, {
        sequelize,
        modelName: 'UtilityProduct',
    });
    return UtilityProduct;
};