const { DataTypes } = require('sequelize');

module.exports = model;

function model(sequelize) {
    const attributes = {
        playerId: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        name: { type: DataTypes.STRING, allowNull: false },
        nationality: { type: DataTypes.STRING, allowNull: false },
        born: { type: DataTypes.STRING, allowNull: false },
        region: { type: DataTypes.STRING, allowNull: false },
        role: { type: DataTypes.STRING, allowNull: false },
        ingameName: { type: DataTypes.STRING, allowNull: false }

    };

    return sequelize.define('player', attributes);
}