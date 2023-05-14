module.exports=(sequelize,DataTypes)=>{
    const User = sequelize.define("user",{
        user_id:{
            type: DataTypes.STRING,
            allowNull: false,
        },
        username:{
            type: DataTypes.STRING,
            allowNull: false,
        },
        room:{
            type: DataTypes.STRING,
            allowNull: false,
        },
    });
    return User;
}

