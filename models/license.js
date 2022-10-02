'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class license extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  license.init({
    user_id: DataTypes.INTEGER,
    license_name: DataTypes.STRING,
    qty: DataTypes.INTEGER,
    license_code: DataTypes.STRING,
    status: DataTypes.INTEGER,
    type: DataTypes.INTEGER,
    info: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'license',
  });
  return license;
};