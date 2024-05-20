const express = require('express');
const router = express.Router();
const Joi = require('joi');
const validateRequest = require('_middleware/validate-request');
const tournamentService = require('./tournament.service');

// Routes for Tournament model
router.get('/', getAll);
router.get('/:id', getById);
router.post('/', createSchema, create);
router.put('/:id', updateSchema, update);
router.delete('/:id', _delete);

module.exports = router;

// Controller functions for Tournament model
function getAll(req, res, next) {
  tournamentService.getAll()
    .then(tournaments => res.json(tournaments))
    .catch(next);
}

function getById(req, res, next) {
  tournamentService.getById(req.params.id)
    .then(tournament => tournament ? res.json(tournament) : res.sendStatus(404))
    .catch(next);
}

function createSchema(req, res, next) {
  const schema = Joi.object({
    date: Joi.date().required(),
    prize_pool: Joi.string().required(),
    location: Joi.string().required(),
    winner: Joi.string().required(),
    runner_up: Joi.string().required()
  });
  validateRequest(req, next, schema);
}

function create(req, res, next) {
  tournamentService.create(req.body)
    .then(tournament => res.json(tournament))
    .catch(next);
}

function updateSchema(req, res, next) {
  const schema = {
    date: Joi.date().empty(''),
    prize_pool: Joi.string().empty(''),
    location: Joi.string().empty(''),
    winner: Joi.string().empty(''),
    runner_up: Joi.string().empty('')
  };
  validateRequest(req, next, schema);
}

function update(req, res, next) {
  tournamentService.update(req.params.id, req.body)
    .then(tournament => res.json(tournament))
    .catch(next);
}

function _delete(req, res, next) {
  tournamentService.delete(req.params.id)
    .then(() => res.json({ message: 'Tournament deleted successfully' }))
    .catch(next);
}