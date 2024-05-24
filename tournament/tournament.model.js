const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Tournament = sequelize.define('Tournament', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    date: {
      type: DataTypes.STRING,
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
    },
    game: {
      type: DataTypes.ENUM('Dota 2', 'Valorant', 'Mobile Legends'),
      allowNull: false
    }
  });

  Tournament.associate = (models) => {
    Tournament.hasMany(models.Schedule, { foreignKey: 'tournamentId' });
  };

  return Tournament;
};
