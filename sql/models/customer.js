const { DataTypes } = require('sequelize');
const sequelize = require('../sequelize');
const Dog = require('./dog');

const Customer = sequelize.define('Customer', {
    firstName: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    lastName: {
        type: DataTypes.STRING(50)
    },
    phoneNum: {
        type: DataTypes.STRING(12)
    },
    address: {
        type: DataTypes.STRING
    },
    email: {
        type: DataTypes.STRING
    }
});

Customer.hasMany(Dog);

module.exports = Customer;
