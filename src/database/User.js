const { Sequelize } = require("sequelize");
const sequelize = require("sequelize")
const connection = require("./database")

const User = connection.define('user', {
    username: {
        type: Sequelize.STRING,
        allowNull: false
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false
    },
    type: {
        type: Sequelize.STRING,
        allowNull: false
    }
});


module.exports = User