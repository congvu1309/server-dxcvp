'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ImageProduct extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      ImageProduct.belongsTo(models.Product, { foreignKey: 'productId', targetKey: 'id', as: 'imageProductData' })
    }
  };
  ImageProduct.init({
    productId: DataTypes.STRING,
    image: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'ImageProduct',
  });
  return ImageProduct;
};