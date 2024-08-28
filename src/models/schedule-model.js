'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Schedule extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            Schedule.belongsTo(models.Product, { foreignKey: 'productId', targetKey: 'id', as: 'productScheduleData' })
            Schedule.belongsTo(models.User, { foreignKey: 'userId', targetKey: 'id', as: 'userScheduleData' })
        }
    };
    Schedule.init({
        productId: DataTypes.STRING,
        userId: DataTypes.STRING,
        startDate: DataTypes.STRING,
        endDate: DataTypes.STRING,
        numberOfDays: DataTypes.STRING,
        guestCount: DataTypes.STRING,
        image: DataTypes.STRING,
        phoneNumber: DataTypes.STRING,
        pay: DataTypes.STRING,
        status: DataTypes.STRING
    }, {
        sequelize,
        modelName: 'Schedule',
    });
    return Schedule;
};