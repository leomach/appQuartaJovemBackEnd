const Sequelize = require('sequelize')

const connection = new Sequelize ('appqj', 'root', 'Leandro14', {
    host: 'localhost',
    dialect: 'mysql'
})

module.exports = connection