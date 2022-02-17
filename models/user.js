const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('user', {
    user_id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      comment: "รหัสประจำตัวของผู้ใช้งาน"
    },
    email: {
      type: DataTypes.STRING(50),
      allowNull: false,
      comment: "อีเมลล์ของผู้ใช้งาน"
    },
    password: {
      type: DataTypes.STRING(100),
      allowNull: false,
      comment: "รหัสผ่านของผู้ใช้งาน"
    },
    first_name: {
      type: DataTypes.STRING(50),
      allowNull: false,
      comment: "ชื่อของผู้ใช้งาน"
    },
    last_name: {
      type: DataTypes.STRING(50),
      allowNull: false,
      comment: "นามสกุลของผู้ใช้งาน"
    }
  }, {
    sequelize,
    tableName: 'user',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "user_id" },
        ]
      },
    ]
  });
};
