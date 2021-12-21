const {Sequelize}=require("sequelize");

const db = new Sequelize("users","root","contrasena",{
    host:"localhost",
    dialet:"mysql"
})

module.exports = {db}