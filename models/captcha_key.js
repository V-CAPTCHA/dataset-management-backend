const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('captcha_key', {
    key_id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      comment: "รหัสประจำตัวของแคปช่าคีย์"
    },
    key_name: {
      type: DataTypes.STRING(50),
      allowNull: false,
      comment: "ชื่อของแคปช่าคีย์"
    },
    creation_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      comment: "วันที่สร้างแคปช่าคีย์"
    },
    domain: {
      type: DataTypes.STRING(50),
      allowNull: false,
      comment: "โดเมนที่ใช้งานแคปช่าคีย์"
    },
    key_value: {
      type: DataTypes.STRING(50),
      allowNull: false,
      comment: "รหัสแคปช่าคีย์"
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "รหัสประจำตัวของผู้ใช้งาน\t",
      references: {
        model: 'user',
        key: 'user_id'
      }
    }
  }, {
    sequelize,
    tableName: 'captcha_key',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "key_id" },
        ]
      },
      {
        name: "key_value",
        using: "BTREE",
        fields: [
          { name: "key_value" },
        ]
      },
      {
        name: "user_id",
        using: "BTREE",
        fields: [
          { name: "user_id" },
        ]
      },
    ]
  });
};
