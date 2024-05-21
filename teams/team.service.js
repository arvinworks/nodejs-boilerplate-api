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
    const team = await db.teams.findAll();
    return team.map(x => basicTeamDetails(x));
}

async function getById(teamId) {
    const team = await getTeam(teamId);
    return basicTeamDetails(team);
}

async function create(params) {
    // validate
    if (await db.team.findOne({ where: { name: params.name } })) {
        throw 'Team "' + params.name + '" is already registered';
    }
    // save account
    await team.save();

    return basicTeamDetails(team);
}

async function update(teamId, params) {
    const team = await getAccount(teamId);

    // validate (if email was changed)
    if (params.name && team.name !== team.name && await db.team.findOne({ where: { name: params.name } })) {
        throw 'name "' + params.name + '" is already taken';
    }

    // copy params to account and save
    Object.assign(team, params);
    team.updated = Date.now();
    await team.save();

    return basicTeamDetails(team);
}

async function _delete(teamId) {
    const team = await getTeam(teamId);
    await team.destroy();
}

// helper functions

async function getTeam(teamId) {
    const team = await db.team.findByPk(teamId);
    if (!team) throw 'Team not found';
    return team;
}


function basicTeamDetails(team) {
    const { teamId, name, location, coach, region, manager } = team;
    return { teamId, name, location, coach, region, manager };
}