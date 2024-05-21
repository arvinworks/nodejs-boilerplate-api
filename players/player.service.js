const config = require('config.json');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require("crypto");
const { Op } = require('sequelize');
const db = require('_helpers/db');
const Role = require('_helpers/role');

module.exports = {
    
    getAll,
    getById,
    create,
    update,
    delete: _delete
};


async function getAll() {
    const player = await db.players.findAll();
    return player.map(x => basicPlayerDetails(x));
}

async function getById(id) {
    const player = await getTeam(id);
    return basicPlayerDetails(player);
}

async function create(params) {
    // validate
    if (await db.player.findOne({ where: { name: params.name } })) {
        throw 'Player "' + params.name + '" is already registered';
    }
    // save account
    await player.save();

    return basicPlayerDetails(player);
}

async function update(id, params) {
    const player = await getPlayer(id);

    // validate (if email was changed)
    if (params.name && player.name !== player.name && await db.player.findOne({ where: { name: params.name } })) {
        throw 'name "' + params.name + '" is already taken';
    }

    // copy params to account and save
    Object.assign(player, params);
    player.updated = Date.now();
    await player.save();

    return basicPlayerDetails(player);
}

async function _delete(id) {
    const player = await getPlayer(id);
    await player.destroy();
}

// helper functions

async function getPlayer(id) {
    const player = await db.player.findByPk(id);
    if (!player) throw 'Player not found';
    return player;
}


function basicPlayerDetails(player) {
    const { id, name, nationality, born, region, role, ingameName, teamId } = player;
    return { id, name, nationality, born, region, role, ingameName, teamId };
}