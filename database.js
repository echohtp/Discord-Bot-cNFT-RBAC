const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(process.env.DB,{
    dialect: "postgres",
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false // <<<<<<< YOU NEED THIS
      }
    },
})


sequelize.authenticate().then(() => {
    console.log('Connection to the database has been established successfully.');
}).catch(err => {
    console.error('Unable to connect to the database:', err);
});

module.exports = sequelize;
