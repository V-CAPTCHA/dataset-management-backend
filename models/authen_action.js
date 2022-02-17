const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('authen_action', {
    action_id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      comment: "รหัสข้อมูล dataset ที่ใช้ในการยืนยันตัวตน"
    },
    dataset_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "รูปที่ประกอบคำถามสำหรับยืนยันตัวตน",
      references: {
        model: 'dataset',
        key: 'dataset_id'
      }
    },
    action_reply: {
      type: DataTypes.STRING(50),
      allowNull: true,
      comment: "คำตอบของผู้ใช้ที่ใช้ยืนยันตัวตน"
    },
    action_create: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP'),
      comment: "วันและเวลาที่เริ่มการยืนยันตัวตน"
    },
    action_end: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: "วันและเวลาที่สิ้นสุดการยืนยันตัวตน"
    },
    action_checked: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: 0,
      comment: "สถานะความถูกต้องของการยืนยันตัวตน"
    },
    action_valid: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: "none_checked",
      comment: "สถานะการเช็คของการยืนยันตัวตน"
    },
    action_ip: {
      type: DataTypes.STRING(50),
      allowNull: false,
      comment: "หมายเลข IP ของผู้ที่ยืนยันตัวตน"
    },
    key_value: {
      type: DataTypes.STRING(50),
      allowNull: false,
      comment: "รหัสแคปช่าคีย์",
      references: {
        model: 'captcha_key',
        key: 'key_value'
      }
    }
  }, {
    sequelize,
    tableName: 'authen_action',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "action_id" },
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
        name: "dataset_id_2",
        using: "BTREE",
        fields: [
          { name: "dataset_id" },
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
