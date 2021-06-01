module.exports = (sequelize, DataTypes)=>{
    const object = {
        message_id: {
            type: DataTypes.INTEGER,
            primary: true,
            unique: true
        }, 
        user_id:{
            type: DataTypes.INTEGER,
            allowNull: true
        },
        header:{
            type: DataTypes.STRING(500)
        },
        message: {
            type:DataTypes.TEXT,
            allowNull: false
        }, 
        read: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        amount: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        type: {
            type: DataTypes.ENUM('credit', 'debit', 'regular'),
            allowNull: false,
            defaultValue: 'regular'
        },
        receiver_id:{
            type: DataTypes.INTEGER,
            allowNull: true
        }
    }
    const Messages = sequelize.define('messages', object)
    return Messages
}