const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Tournament = sequelize.define('Tournament', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    prize_pool: {
      type: DataTypes.STRING,
      allowNull: false
    },
    location: {
      type: DataTypes.STRING,
      allowNull: false
    },
    winner: {
      type: DataTypes.STRING,
      allowNull: false
    },
    runner_up: {
      type: DataTypes.STRING,
      allowNull: false
    }
  });

  return Tournament;
};