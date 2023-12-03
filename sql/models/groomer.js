const { DataTypes } = require('sequelize');
const sequelize = require('../sequelize');

const Groomer = sequelize.define('Groomer', {
    firstName: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    lastName: {
        type: DataTypes.STRING(50)
    }
});

module.exports = Groomer;