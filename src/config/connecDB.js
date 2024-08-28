const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('project_booking', 'root', null, {
    host: 'localhost',
    dialect: 'mysql',
    logging: false
});

let connectDB = async () => {
    sequelize.authenticate().then(() => {
        console.log('Connection has been established successfully.');
    }).catch((error) => {
        console.error('Unable to connect to the database:', error);
    })
}

module.exports = connectDB;