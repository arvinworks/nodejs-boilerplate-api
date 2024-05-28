const express = require('express');
const router = express.Router();
const Joi = require('joi');
const validateRequest = require('_middleware/validate-request');
const scheduleService = require('./schedule.service');

// Routes for Schedule model
router.get('/', getAll);
router.get('/:scheduleId', getById);
router.get('/tournament/:tournamentId/schedules', getSchedulesByTournamentId);
router.get('/tournaments/:tournamentId/schedules', getScheduleByTournamentId);
router.get('/tournament/:tournamentName/schedules', getSchedulesByTournamentName);

function getSchedulesByTournamentName(req, res, next) {
  const tournamentName = req.params.tournamentName;
  scheduleService.getSchedulesByTournamentName(tournamentName)
    .then(schedules => res.json(schedules))
    .catch(next);
}
router.post('/', createSchema, create);
router.post('/tournament/:tournamentId/schedules', createSchema, create);
router.put('/:scheduleId', updateSchema, update);
router.delete('/:scheduleId', _delete);

module.exports = router;

// Controller functions for Schedule model
function getAll(req, res, next) {
  scheduleService.getAll()
    .then(schedules => res.json(schedules))
    .catch(next);
}

function getById(req, res, next) {
  scheduleService.getById(req.params.scheduleId)
    .then(schedule => schedule ? res.json(schedule) : res.sendStatus(404))
    .catch(next);
}

function createSchema(req, res, next) {
  const schema = Joi.object({
    date: Joi.string().required(),
    match: Joi.string().required(),
    teams: Joi.string().required(),
    result: Joi.string().required(),
    tournamentId: Joi.number().integer().required()
  });
  validateRequest(req, next, schema);
}

function create(req, res, next) {
  const tournamentId = req.params.tournamentId || req.body.tournamentId;
  const scheduleData = req.body;

  scheduleService.createSchedule(tournamentId, scheduleData)
    .then(schedule => res.json(schedule))
    .catch(next);
}

function updateSchema(req, res, next) {
  const schema = Joi.object({
    date: Joi.string().empty(''),
    match: Joi.string().empty(''),
    teams: Joi.string().empty(''),
    result: Joi.string().empty(''),
    tournamentId: Joi.number().empty('')
  });
  validateRequest(req, next, schema);
}

function update(req, res, next) {
  scheduleService.update(req.params.scheduleId, req.body)
    .then(schedule => res.json(schedule))
    .catch(next);
}

function _delete(req, res, next) {
  scheduleService.delete(req.params.scheduleId)
    .then(() => res.json({ message: 'Schedule deleted successfully' }))
    .catch(next);
}

function getSchedulesByTournamentId(req, res, next) {
  const tournamentId = req.params.tournamentId;

  scheduleService.getSchedulesByTournamentId(tournamentId)
    .then(schedules => res.json(schedules))
    .catch(next);
}

function getSchedulesByTournamentName(req, res, next) {
  const tournamentName = req.params.tournamentName;
  scheduleService.getSchedulesByTournamentName(tournamentName)
    .then(schedules => res.json(schedules))
    .catch(next);
}


function getScheduleByTournamentId(req, res, next) {
  const tournamentId = req.params.tournamentId;

  scheduleService.getSchedulesByTournamentId(tournamentId)
    .then(schedules => res.json(schedules))
    .catch(next);
}