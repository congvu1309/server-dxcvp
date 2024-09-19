'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Evaluation extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Evaluation.belongsTo(models.User, { foreignKey: 'userId', targetKey: 'id', as: 'userEvaluationData' })
    }
  };
  Evaluation.init({
    userId: DataTypes.STRING,
    productId: DataTypes.STRING,
    rating: DataTypes.STRING,
    text: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Evaluation',
  });
  return Evaluation;
};