module.exports = (sequelize, DataTypes)=>{
    const object = {
        message_id: {
            type: DataTypes.INTEGER,
            primary: true,
            unique: true
        }, 
        user_id:{
            type: DataTypes.INTEGER,
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
        type: {
            type: DataTypes.ENUM('credit', 'debit', 'regular'),
            allowNull: false,
            defaultValue: 'regular'
        }
    }
    const Messages = sequelize.define('messages', object)
    return Messages
}