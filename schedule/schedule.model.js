const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Schedule = sequelize.define('Schedule', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    date: {
      type: DataTypes.STRING,
      allowNull: false
    },
    match: {
      type: DataTypes.STRING,
      allowNull: false
    },
    teams: {
      type: DataTypes.STRING,
      allowNull: false
    },
    result: {
      type: DataTypes.STRING,
      allowNull: false
    }
  });

  Schedule.associate = (models) => {
    Schedule.belongsTo(models.Tournament, { foreignKey: 'tournamentId' });
  };

  return Schedule;
};
