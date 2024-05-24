const express = require('express');
const router = express.Router();
const Joi = require('joi');
const validateRequest = require('_middleware/validate-request');
const scheduleService = require('./schedule.service');

// Routes for Schedule model
router.get('/', getAll);
router.get('/:id', getById);
router.get('/:tournamentId/schedules', getSchedulesByTournamentId);
router.post('/', createSchema, create);
router.post('/:tournamentId/schedules', createSchema, create);
router.put('/:id', updateSchema, update);
router.delete('/:id', _delete);

module.exports = router;

// Controller functions for Schedule model
function getAll(req, res, next) {
  scheduleService.getAll()
    .then(schedules => res.json(schedules))
    .catch(next);
}

function getById(req, res, next) {
  scheduleService.getById(req.params.id)
    .then(schedule => schedule ? res.json(schedule) : res.sendStatus(404))
    .catch(next);
}

function createSchema(req, res, next) {
  const schema = Joi.object({
    date: Joi.string().required(),
    match: Joi.string().required(),
    teams: Joi.string().required(),
    result: Joi.string().required(),
  });
  validateRequest(req, next, schema);
}

function create(req, res, next) {
  const tournamentId = req.params.tournamentId;
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
    tournamentId: Joi.number().integer().empty('')
  });
  validateRequest(req, next, schema);
}

function update(req, res, next) {
  scheduleService.update(req.params.id, req.body)
    .then(schedule => res.json(schedule))
    .catch(next);
}

function _delete(req, res, next) {
  scheduleService.delete(req.params.id)
    .then(() => res.json({ message: 'Schedule deleted successfully' }))
    .catch(next);
}

function getSchedulesByTournamentId(req, res, next) {
  const tournamentId = req.params.tournamentId;

  scheduleService.getSchedulesByTournamentId(tournamentId)
    .then(schedules => res.json(schedules))
    .catch(next);
}
