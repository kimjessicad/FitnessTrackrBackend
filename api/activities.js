const express = require('express');
const router = express.Router();
const { requireUser } = require("./utils");

// GET /api/activities
router.get('/', async (req, res, next) => {

});

// POST /api/activities
router.post('/', requireUser, async (req, res, next) => {

});

// PATCH /api/activities/:activityId
router.patch('./:activityId', requireUser, async (req, res, next) => {

});

// GET /api/activities/:activityId/routines
router.get('./:activityId/routines', async (req, res, next) => {

});

module.exports = router;
