const db = require('_helpers/db');

module.exports = {
  getAll,
  getById,
  create,
  update,
  delete: _delete,
  getSchedulesByTournamentId
};

async function getAll() {
  return await db.Tournament.findAll();
}

async function getById(id) {
  return await getTournament(id);
}

async function create(params) {
  if (await db.Tournament.findOne({ where: { date: params.date } })) {
    throw new Error('Tournament on "' + params.date + '" is already registered');
  }
  return await db.Tournament.create(params);
}

async function update(id, params) {
  const tournament = await getTournament(id);

  // Check if the date is changed to an existing tournament date
  if (params.date && tournament.date !== params.date && await db.Tournament.findOne({ where: { date: params.date } })) {
    throw new Error('Tournament on "' + params.date + '" is already registered');
  }

  Object.assign(tournament, params);
  tournament.updated = Date.now();
  await tournament.save();
  return tournament;
}

async function _delete(tournamentId) {
  const tournament = await getTournament(tournamentId);
  await tournament.destroy();
}

async function getTournament(id) {
  const tournament = await db.Tournament.findByPk(id);
  if (!tournament) throw new Error('Tournament not found');
  return tournament;
}

async function getSchedulesByTournamentId(tournamentId) {
  return await db.Schedule.findAll({ where: { tournamentId } });
}
