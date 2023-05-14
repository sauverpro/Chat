// const db= require("../server.")
const dbConfig = require("../config/db.config.js");

const {Sequelize , DataTypes} = require("sequelize");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
    host: dbConfig.HOST,
    dialect: dbConfig.dialect,
    operationAliase: false,
    pool: {
      max: dbConfig.pool.max,
      mim: dbConfig.pool.min,
      acquire: dbConfig.pool.acquire,
      idle: dbConfig.pool.idle,
    },
  });
  sequelize
    .authenticate()
    .then(() => {
      console.log("connected to database...");
    })
    .catch((err) => {
      console.log(`error:${err}`);
    });
  
  const db = {};
  
  db.Sequelize = Sequelize;
  db.sequelize = sequelize;
  db.users = require("../models/user.model.js")(sequelize, DataTypes);
  
  db.sequelize.sync({ force: false }).then(() => {
    console.log("yes re-sync done!");
  })
  const Users = db.users;
  
  module.exports = db;

// const users = [];

// join user to a chat

function userJoin(id,username,room){
    const user= {id,username, room};

      let info = {
      user_id: user.id,
      username: user.username,
      room: user.room,
    };
    const insert = Users.create(info);
    console.log(`well inserted data: ${insert}`);

    // users.push(user);

    return user;
}

// get current user

function getCurrentUser(id) {
    return Users.findOne({where: {user_id: id}})
    // return users.find(user => user.id === id)
}
// user leaves
function userLeave(id) {
    // const index = users.findIndex(user => user.id === id);
    // if (index !== -1) {
    //     return Users.splice(index, 1)[0];
    // }
    return Users.destroy({where: {user_id: id}});
}
// get room users

function getRoomUsers(room) {

    return Users.findAll({where: {room: room}});
    // return users.filter(user => user.room === room);
}

module.exports = {
    userJoin,
    getCurrentUser,
    userLeave,
    getRoomUsers
}
