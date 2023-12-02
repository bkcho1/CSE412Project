const { DataTypes } = require('sequelize');
const sequelize = require('./sequelize');

const Customer = sequelize.define('Customer', {
    cid: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
    },
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

const Dog = sequelize.define('Dog', {
    c_key: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Customer,
            key: 'cid'
        },
        primaryKey: true
    },
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

const Groomer = sequelize.define('Groomer', {
    gid: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true
    },
    firstName: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    lastName: {
        type: DataTypes.STRING(50)
    }
});

const Scheduler = sequelize.define('Scheduler', {
    cid: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Customer,
            key: 'cid'
        },
        primaryKey: true
    },
    gid: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Groomer,
            key: 'gid'
        },
        primaryKey: true
    },
    date: {
        type: DataTypes.DATEONLY
    },
    time: {
        type: DataTypes.TIME
    }
},
{
    freezeTableName: true,
    modelName: 'Scheduler'
});

module.exports = Customer;
module.exports = Dog;
module.exports = Groomer;
module.exports = Scheduler;