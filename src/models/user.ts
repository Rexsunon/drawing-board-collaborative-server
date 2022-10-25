import { Model, Sequelize, UUIDV4, Optional, InferAttributes, InferCreationAttributes, CreationOptional } from "sequelize";

module.exports = (sequelize: Sequelize, DataTypes: any) => {
  class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
    declare id: CreationOptional<string>;
    firstname!: string;
    lastname!: string;
    email!: string;
    createdAt?: CreationOptional<Date>;
    updatedAt?: CreationOptional<Date>;

    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models: any) {
      // define association here
    }
  }
  
  User.init({
    id: {
      allowNull: false,
      autoIncrement: false,
      primaryKey: true,
      type: DataTypes.UUID,
      defaultValue: UUIDV4,
      unique: true,
    },
    firstname: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    lastname: {
      allowNull: false,
      type: DataTypes.TEXT,
    },
    email: {
      allowNull: true,
      type: DataTypes.TEXT,
      unique: true,
      validate: {
        isEmail: true,
      },
    }
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};
