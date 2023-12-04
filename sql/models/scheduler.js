const { DataTypes } = require('sequelize');
const sequelize = require('../sequelize');
const Customer = require('./customer');
const Groomer = require('./groomer');

const Scheduler = sequelize.define('Scheduler', {
    gid: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Groomer,
            key: "id"
        },
        primaryKey: true
    },
    cid: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Customer,
            key: "id"
        },
        primaryKey: true
    },
    date: {
        type: DataTypes.DATEONLY,
        primaryKey: true
    },
    time: {
        type: DataTypes.TIME,
        primaryKey: true
    }
},
{
    freezeTableName: true,
    modelName: "Scheduler"
});

module.exports = Scheduler;