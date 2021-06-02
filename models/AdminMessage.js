module.exports = (sequelize, DataType) =>{
    const AdminMessage = sequelize.define('AdminMessage', {
        id: {
            type: DataType.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            unique: true
        },
        messages:{
            type: DataType.STRING(500),
            unique: true
        },
        type: {
            type: DataType.STRING,
            unique: false,
        }
    });
    return AdminMessage
}