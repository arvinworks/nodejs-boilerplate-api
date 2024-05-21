const express = require('express');
const router = express.Router();
const Joi = require('joi');
const validateRequest = require('_middleware/validate-request');
const authorize = require('_middleware/authorize')
const playerService = require('./player.service');


router.get('/', getAll);
router.get('/:id', getById);
router.post('/players/', createSchema, create);
router.put('/players/:id', updateSchema, update);
router.delete('/players/:id', _delete);

module.exports = router;

function getAll(req, res, next) {
    playerService.getAll()
        .then(players => res.json(players))
        .catch(next);
}

function getById(req, res, next) {
    
    playerService.getById(req.params.playerId)
        .then(player => player ? res.json(player) : res.sendStatus(404))
        .catch(next);
}

function createSchema(req, res, next) {
    const schema = Joi.object({
        name: Joi.string().required(),
        nationality: Joi.string().required(),
        born: Joi.date().required(),
        region: Joi.string().required(),
        role: Joi.string().required(),
        ingameName: Joi.string().required(),
        
    });
    validateRequest(req, next, schema);
}

function create(req, res, next) {
    playerService.create(req.body)
        .then(player => res.json(player))
        .catch(next);
}

function updateSchema(req, res, next) {
    const schema = {
        name: Joi.string().empty(''),
        nationality: Joi.string().empty(''),
        born: Joi.date().empty(''),
        region: Joi.string().empty(''),
        role: Joi.string().empty(''),
        ingameName: Joi.string().empty(''),
    };

    validateRequest(req, next, schema);
}

function update(req, res, next) {
    
    playerService.update(req.params.playerId, req.body)
        .then(player => res.json(player))
        .catch(next);
}

function _delete(req, res, next) {
    
    playerService.delete(req.params.playerId)
        .then(() => res.json({ message: 'Player deleted successfully' }))
        .catch(next);
}