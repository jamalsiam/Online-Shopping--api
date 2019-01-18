module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    username: {
      type: DataTypes.STRING,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
    },
    password: DataTypes.STRING,
  });

  User.associate = (models) => {
    User.hasMany(models.Item, {
      foreignKey: 'user_id',
      as: 'user',
      constraints: true

    })
  };

  return User;
};