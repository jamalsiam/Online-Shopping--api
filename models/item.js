const category = ['1', '2', '3', '4', '5'];

module.exports = (sequelize, DataTypes) => {
  const Item = sequelize.define('Item', {
    name: {
      type: DataTypes.STRING,
    },
    description: {
      type: DataTypes.STRING(1000),
    },
    category: {
      type: DataTypes.ENUM,
      values: category,
      defaultValue: category[0]
    },
    price: {
      type: DataTypes.INTEGER,
    },
    discount: {
      type: DataTypes.INTEGER,
    },
    images: {
      type: DataTypes.ARRAY(DataTypes.STRING)
    },
    new: {
      type: DataTypes.BOOLEAN
    }
  });

  Item.associate = (models) => {
    Item.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'item',
      constraints: true
    })
  };

  return Item;
};