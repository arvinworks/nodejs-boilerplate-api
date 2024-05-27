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

async function getById(scheduleId) {
  return await getSchedule(scheduleId);
}

async function create(params) {
  if (await db.Schedule.findOne({ where: { date: params.date, match: params.match } })) {
    throw new Error('Schedule for "' + params.match + '" on "' + params.date + '" is already registered');
  }
  return await db.Schedule.create(params);
}

async function update(scheduleId, params) {
  const schedule = await getSchedule(scheduleId);

  // Check if the date and match is changed to an existing schedule date and match
  if (params.date && params.match && schedule.date !== params.date && schedule.match !== params.match && await db.Schedule.findOne({ where: { date: params.date, match: params.match } })) {
    throw new Error('Schedule for "' + params.match + '" on "' + params.date + '" is already registered');
  }

  Object.assign(schedule, params);
  schedule.updated = Date.now();
  await schedule.save();
  return schedule;
}

async function _delete(scheduleId) {
  const schedule = await getSchedule(scheduleId);
  await schedule.destroy();
}

async function getSchedule(scheduleId) {
  const schedule = await db.Schedule.findByPk(scheduleId);
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
    tournamentId: tournamentId 
  });
  return schedule;
}

async function getTournament(id) {
  const tournament = await db.Tournament.findByPk(id);
  if (!tournament) throw new Error('Tournament not found');
  return tournament;
}
