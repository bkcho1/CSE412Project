const { DataTypes } = require('sequelize');
const sequelize = require('../sequelize');

const Dog = sequelize.define('Dog', {
    name: {
        type: DataTypes.STRING(50),
        allowNull: false,
        primaryKey: true
    },
    breed: {
        type: DataTypes.STRING(50)
    },
    age: {
        type: DataTypes.INTEGER
    },
    specialInstructions: {
        type: DataTypes.STRING
    },
    healthConditions: {
        type: DataTypes.STRING
    },
    comments: {
        type: DataTypes.STRING
    }
});

module.exports = Dog;