const db = require('_helpers/db');

module.exports = {
  getAll,
  getById,
  create,
  update,
  delete: _delete
};

async function getAll() {
  const tournaments = await db.Tournament.findAll();
  return tournaments;
}

async function getById(id) {
  const tournament = await getTournament(id);
  return tournament;
}

async function create(params) {
  const existingTournament = await db.Tournament.findOne({ where: { date: params.date } });
  if (existingTournament) {
    throw new Error('Tournament on "' + params.date + '" is already registered');
  }
  const tournament = await db.Tournament.create(params);
  return tournament;
}

async function update(id, params) {
  const tournament = await getTournament(id);
  if (params.date && tournament.date !== params.date && await db.Tournament.findOne({ where: { date: params.date } })) {
    throw new Error('Tournament on "' + params.date + '" is already registered');
  }
  Object.assign(tournament, params);
  tournament.updated = Date.now();
  await tournament.save();
  return tournament;
}

async function _delete(id) {
  const tournament = await getTournament(id);
  await tournament.destroy();
}

async function getTournament(id) {
  const tournament = await db.Tournament.findByPk(id);
  if (!tournament) throw new Error('Tournament not found');
  return tournament;
}