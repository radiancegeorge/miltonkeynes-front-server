module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
        id: {
            autoIncrement:true,
            unique: true,
            primaryKey: true,
            type: DataTypes.INTEGER
        },
        fullName:{
            unique: false,
            type: DataTypes.STRING,
            validate:{
                notEmpty: true
            }
        },
        email:{
            unique: true,
            type: DataTypes.STRING,
            validate:{
                notEmpty: true
            }
        },
        phoneNumber:{
            unique: true,
            type: DataTypes.STRING,
            validate:{
                notEmpty: true
            }
        },
        country:{
            unique: false,
            type: DataTypes.STRING,
            validate:{
                notEmpty: true
            }
        },
        residence:{
            unique: false,
            type: DataTypes.STRING,
            validate:{
                notEmpty: true
            }
        },
        occupation:{
            unique: false,
            type: DataTypes.STRING,
            validate:{
                notEmpty: true
            }
        },
        maritalStatus:{
            unique: false,
            type: DataTypes.ENUM('single', 'married'),
            allowNull: false,
            defaultVale: 'single'
        },
        gender:{
            unique: false,
            type: DataTypes.ENUM('male', 'female'),
            allowNull: false,
            defaultVale: 'male'
        },
        dob:{
            unique: false,
            type: DataTypes.STRING,
            allowNull: false
        },
        password:{
            unique: true,
            type: DataTypes.STRING,
            validate:{
                notEmpty: true
            }
        },
        active:{
            unique: false,
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        balance:{
            unique: false,
            type: DataTypes.INTEGER,
            defaultVale: 0,
        },
        bonus:{
            unique: false,
            type: DataTypes.INTEGER,
            validate: {
                notEmpty: true
            }
        },
        token:{
            unique: true,
            type: DataTypes.STRING(500),
            validate:{
                notEmpty: false
            }
        },
        emailVerification:{
            unique: true,
            type: DataTypes.BOOLEAN,
            validate:{
                notEmpty: false
            }
        },
        typeOfAccount: {
            type: DataTypes.ENUM('savings', 'checking', 'joint', 'corporate'),
            allowNull:false,
            defaultVale: 'savings'
        },
        accountNumber: {
            type: DataTypes.INTEGER,
            unique: true,
            defaultValue: 0,
            allowNull: false
        },
        imageName: {
            type: DataTypes.STRING(500),
            unique: false
        },
        companyEmail:{
            type: DataTypes.STRING,
            allowNull: true,
            unique: true  
        },
        yearOfEstablishment:{
            type: DataTypes.STRING,
            allowNull: true,
            unique: true
        },
        nameOfBusiness:{
            type: DataTypes.STRING,
            allowNull: true,
            unique: true
        }, 
        companyAddress:{
            type: DataTypes.STRING,
            allowNull: true,
            unique: true
        },
        jointOwners:{
            type: DataTypes.STRING,
            allowNull: true,
            unique: true
        },
        jointPhoneNumbers: {
            type: DataTypes.STRING,
            allowNull: true,
            unique: true
        },
        jointEmails:{
            type: DataTypes.STRING,
            allowNull: true,
            unique: true
        },
        jointAddresses:{
            type: DataTypes.STRING,
            allowNull: true,
            unique: true
        }
    });
    return User;
}