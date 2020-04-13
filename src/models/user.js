const bcrypt = require("bcrypt");
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    nome: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    passwordResetExpires: DataTypes.DATE,
    passwordResetToken: DataTypes.STRING
  }, {
    hooks: {
      beforeCreate: (user) => {
        const salt = bcrypt.genSaltSync();
        user.password = bcrypt.hashSync(user.password, salt);
      }
    }
  });

  User.associate = function (models) {
    User.hasMany(models.Telefone)
  };

  return User;
}