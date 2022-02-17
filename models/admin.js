const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('admin', {
    admin_id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      comment: "รหัสประจำตัวผู้ดูแลระบบ"
    },
    email: {
      type: DataTypes.STRING(50),
      allowNull: false,
      comment: "อีเมลล์ผู้ดูแลระบบ"
    },
    password: {
      type: DataTypes.STRING(100),
      allowNull: false,
      comment: "รหัสผ่านผู้ดูแลระบบ"
    },
    first_name: {
      type: DataTypes.STRING(50),
      allowNull: false,
      comment: "ชื่อผู้ดูแลระบบ"
    },
    last_name: {
      type: DataTypes.STRING(50),
      allowNull: false,
      comment: "นามสกุลผู้ดูแลระบบ"
    },
    role: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: "admin",
      comment: "ตำแหน่งผู้ดูแลระบบ"
    }
  }, {
    sequelize,
    tableName: 'admin',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "admin_id" },
        ]
      },
    ]
  });
};
