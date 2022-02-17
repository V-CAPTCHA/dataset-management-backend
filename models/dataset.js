const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('dataset', {
    dataset_id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      comment: "รหัสข้อมูล dataset ที่ใช้ในการยืนยันตัวตน"
    },
    dataset_img: {
      type: DataTypes.STRING(50),
      allowNull: false,
      comment: "รูปที่ประกอบคำถามสำหรับยืนยันตัวตน"
    },
    dataset_question: {
      type: DataTypes.TEXT,
      allowNull: false,
      comment: "คำถามสำหรับยืนยันตัวตน"
    },
    dataset_reply: {
      type: DataTypes.TEXT,
      allowNull: false,
      comment: "คำตอบสำหรับยืนยันตัวตน"
    }
  }, {
    sequelize,
    tableName: 'dataset',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "dataset_id" },
        ]
      },
    ]
  });
};
