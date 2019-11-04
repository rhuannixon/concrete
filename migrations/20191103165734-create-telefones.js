module.exports = {
  up: (queryInterface, DataTypes) => {
    return queryInterface.createTable('Telefones', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      numero: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      ddd: {
        allowNull: false,
        type: DataTypes.INTEGER,
        unique: true,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id'
        }
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
    });
  },

  down: (queryInterface) => {
    return queryInterface.dropTable('Telefones');
  }
};