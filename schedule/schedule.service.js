const db = require('_helpers/db');

module.exports = {
  getAll,
  getById,
  create,
  update,
  delete: _delete
};

async function getAll() {
  const schedules = await db.Schedule.findAll();
  return schedules;
}

async function getById(id) {
  const schedule = await getSchedule(id);
  return schedule;
}

async function create(params) {
  const existingSchedule = await db.Schedule.findOne({ where: { date: params.date, match: params.match } });
  if (existingSchedule) {
    throw new Error('Schedule for "' + params.match + '" on "' + params.date + '" is already registered');
  }
  const schedule = await db.Schedule.create(params);
  return schedule;
}

async function update(id, params) {
  const schedule = await getSchedule(id);
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