module.exports = (sequelize, DataTypes) => {
    const Telefone = sequelize.define('Telefone', {
      numero: DataTypes.STRING,
      ddd: DataTypes.INTEGER,
      userId: DataTypes.INTEGER,
    });

    Telefone.associate = function(models) {
        Telefone.belongsTo(models.User, {foreignKey: 'userId'})
    };

    return Telefone;
}