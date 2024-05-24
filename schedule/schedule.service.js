const db = require('_helpers/db');

module.exports = {
  getAll,
  getById,
  create,
  update,
  delete: _delete,
  getSchedulesByTournamentId,
  createSchedule,
};

async function getAll() {
  return await db.Schedule.findAll();
}

async function getById(id) {
  return await getSchedule(id);
}

async function create(params) {
  if (await db.Schedule.findOne({ where: { date: params.date, match: params.match } })) {
    throw new Error('Schedule for "' + params.match + '" on "' + params.date + '" is already registered');
  }
  return await db.Schedule.create(params);
}

async function update(id, params) {
  const schedule = await getSchedule(id);

  // Check if the date and match is changed to an existing schedule date and match
  if (params.date && params.match && schedule.date !== params.date && schedule.match !== params.match && await db.Schedule.findOne({ where: { date: params.date, match: params.match } })) {
    throw new Error('Schedule for "' + params.match + '" on "' + params.date + '" is already registered');
  }

  Object.assign(schedule, params);
  schedule.updated = Date.now();
  await schedule.save();
  return schedule;
}

async function _delete(id) {
  const schedule = await getSchedule(id);
  await schedule.destroy();
}

async function getSchedule(id) {
  const schedule = await db.Schedule.findByPk(id);
  if (!schedule) throw new Error('Schedule not found');
  return schedule;
}

async function getSchedulesByTournamentId(tournamentId) {
  const tournament = await db.Tournament.findByPk(tournamentId, {
    include: [db.Schedule],
  });

  if (!tournament) throw new Error('Tournament not found');

  return tournament.Schedules;
}

async function createSchedule(tournamentId, scheduleData) {
  const tournament = await getTournament(tournamentId);
  const schedule = await db.Schedule.create({
    ...scheduleData,
    tournamentId: tournamentId // Ensure tournamentId is set
  });
  return schedule;
}

async function getTournament(id) {
  const tournament = await db.Tournament.findByPk(id);
  if (!tournament) throw new Error('Tournament not found');
  return tournament;
}
