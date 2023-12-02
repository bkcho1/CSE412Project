const { Sequelize } = require('sequelize');

const sequelize = new Sequelize({
    dialect: 'postgres',
    host: 'localhost',
    username: 'dd_user',
    password: 'doogiedoos',
    database: 'dd_db'
});

module.exports = sequelize;