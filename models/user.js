const bcrypt = require("bcrypt");
module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define('User', {
      nome: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      token: DataTypes.STRING,
    }, {
      hooks: {
        beforeCreate: (user) => {
          const salt = bcrypt.genSaltSync();
          user.password = bcrypt.hashSync(user.password, salt);
        }
      },
      instanceMethods: {
          generateHash: function(password) {
              return bcrypt.hash(password, bcrypt.genSaltSync(8));
          },
          validPassword(password) {
              console.log('verificando senha...')
              return bcrypt.compare(password, this.password);
          }
      }});
  
    User.associate = function(models) {
      User.hasMany(models.Telefone)
    };

    return User;
}