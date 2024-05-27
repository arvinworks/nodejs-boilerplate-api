const express = require('express');
const router = express.Router();
const Joi = require('joi');
const validateRequest = require('_middleware/validate-request');
const tournamentService = require('./tournament.service');

// Routes for Tournament model
router.get('/', getAll);
router.get('/:tournamentId', getById);
router.get('/:tournamentId/schedules', getSchedulesByTournamentId);
router.post('/', createSchema, create);
router.put('/:tournamentId', updateSchema, update);
router.delete('/:tournamentId', _delete);

module.exports = router;

// Controller functions for Tournament model
function getAll(req, res, next) {
  tournamentService.getAll()
    .then(tournaments => res.json(tournaments))
    .catch(next);
}

function getById(req, res, next) {
  tournamentService.getById(req.params.tournamentId)
    .then(tournament => tournament ? res.json(tournament) : res.sendStatus(404))
    .catch(next);
}

function getSchedulesByTournamentId(req, res, next) {
  tournamentService.getSchedulesByTournamentId(req.params.tournamentId)
    .then(schedules => res.json(schedules))
    .catch(next);
}

function createSchema(req, res, next) {
  const schema = Joi.object({
    name: Joi.string().required(),
    date: Joi.string().required(),
    prize_pool: Joi.string().required(),
    location: Joi.string().required(),
    winner: Joi.string().required(),
    runner_up: Joi.string().required(),
    game: Joi.string().valid('Dota 2', 'Valorant', 'Mobile Legends').required()
  });
  validateRequest(req, next, schema);
}

function create(req, res, next) {
  tournamentService.create(req.body)
    .then(tournament => res.json(tournament))
    .catch(next);
}

function updateSchema(req, res, next) {
  const schema = Joi.object({
    name: Joi.string().empty(''),
    date: Joi.string().empty(''),
    prize_pool: Joi.string().empty(''),
    location: Joi.string().empty(''),
    winner: Joi.string().empty(''),
    runner_up: Joi.string().empty(''),
    game: Joi.string().valid('Dota 2', 'Valorant', 'Mobile Legends').empty('')
  });
  validateRequest(req, next, schema);
}

function update(req, res, next) {
  tournamentService.update(req.params.tournamentId, req.body)
    .then(tournament => res.json(tournament))
    .catch(next);
}

function _delete(req, res, next) {
  tournamentService.delete(req.params.tournamentId)
    .then(() => res.json({ message: 'Tournament deleted successfully' }))
    .catch(next);
}
