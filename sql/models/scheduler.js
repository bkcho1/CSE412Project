const { DataTypes } = require('sequelize');
const sequelize = require('../sequelize');
const Customer = require('./customer');
const Groomer = require('./groomer');

const Scheduler = sequelize.define('Scheduler', {
    date: {
        type: DataTypes.DATEONLY
    },
    time: {
        type: DataTypes.TIME
    }
},
{
    freezeTableName: true,
    modelName: "Scheduler"
});

Customer.belongsToMany(Groomer, { through: Scheduler });
Groomer.belongsToMany(Customer, { through: Scheduler })

module.exports = Scheduler;