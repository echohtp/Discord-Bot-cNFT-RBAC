const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../database');

const User = sequelize.define('User', {
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    solanaPublicKey: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    membershipNFTPublicKey: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    registrationKey: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    roles: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: ""
    },
    nftId: {
        type: DataTypes.INTEGER,
        allowNull: true
    }

}, {
    timestamps: false,
});

// User.sync({force: true}).then(() => {
User.sync().then(() => {
    console.log('User table created successfully.');
});

module.exports = User;
