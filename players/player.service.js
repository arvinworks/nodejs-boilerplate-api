const config = require('config.json');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require("crypto");
const { Op } = require('sequelize');
const db = require('_helpers/db');
const Role = require('_helpers/role');
const { param } = require('./player.controller');

module.exports = {
    
    getAll,
    getById,
    create,
    update,
    delete: _delete
};


async function getAll() {
    const player = await db.Player.findAll();
    return player.map(x => basicPlayerDetails(x));
}

async function getById(playerId) {
    const player = await getTeam(playerId);
    return basicPlayerDetails(player);
}

async function create(params) {
    // Validate
    const existingTeam = await db.Player.findOne({ where: { name: params.name } });
    if (existingTeam) {
        throw 'Player "' + params.name + '" is already registered';
    }

    // Create and save new team
    const team = await db.Player.create({
        name: params.name,
        nationality: params.location,
        born: params.born,
        region: params.region,
        role: params.role,
        ingameName: params.ingameName
    });

    return basicTeamDetails(team);
}

async function update(playerId, params) {
    const player = await getPlayer(playerId);

    // validate (if email was changed)
    if (params.name && player.name !== player.name && await db.Player.findOne({ where: { name: params.name } })) {
        throw 'name "' + params.name + '" is already taken';
    }

    // copy params to account and save
    Object.assign(player, params);
    player.updated = Date.now();
    await player.save();

    return basicPlayerDetails(player);
}

async function _delete(playerId) {
    const player = await getPlayer(playerId);
    await player.destroy();
}

// helper functions

async function getPlayer(playerId) {
    const player = await db.Player.findByPk(playerId);
    if (!player) throw 'Player not found';
    return player;
}


function basicPlayerDetails(player) {
    const { playerId, name, nationality, born, region, role, ingameName, teamId } = player;
    return { playerId, name, nationality, born, region, role, ingameName, teamId };
}