const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('dataset_creator', {
    creator_id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      comment: "รหัสประจำตัวของการสร้างคีย์คำถาม"
    },
    dataset_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "รหัสประจำตัวของคำถาม",
      references: {
        model: 'dataset',
        key: 'dataset_id'
      }
    },
    admin_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "รหัสประจำตัวของผู้ดูแลระบบ",
      references: {
        model: 'admin',
        key: 'admin_id'
      }
    }
  }, {
    sequelize,
    tableName: 'dataset_creator',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "creator_id" },
        ]
      },
      {
        name: "admin_id",
        using: "BTREE",
        fields: [
          { name: "admin_id" },
        ]
      },
      {
        name: "dataset_id",
        using: "BTREE",
        fields: [
          { name: "dataset_id" },
        ]
      },
    ]
  });
};
