//individually testing will pass all tests.
//sometimes if run simultaneously with other tests (usually routine activities), it will fail DELETE-Hard deletes a routine.

const express = require('express');
const router = express.Router();
const { requireUser } = require("./utils");
const { getAllRoutines, createRoutine, getRoutineById, updateRoutine, destroyRoutine, addActivityToRoutine, getRoutineActivityById } = require("../db")

// GET /api/routines
router.get('/', async (req, res, next) => {
    try {
        const allRoutines = await getAllRoutines();
        res.send(allRoutines);
    } catch (error) {
        next(error);
    }
})

// POST /api/routines
router.post('/', requireUser, async (req, res, next) => {
    const { name, goal } = req.body;
    const _routine = await createRoutine({ creatorId: req.user.id, name, goal, isPublic: req.body.isPublic })
    try {
        if (_routine) {
            res.send(_routine)
        }
    } catch (error) {
        next(error);
    }
})

// PATCH /api/routines/:routineId
router.patch('/:routineId', requireUser, async (req, res, next) => {
    const { isPublic, name, goal } = req.body;
    const id = req.params.routineId;
    const routine = await getRoutineById(id)
    try {
        if (routine.creatorId != req.user.id) {
            res.status(403)
            next({
                name: "UserNotFound",
                message: `User ${req.user.username} is not allowed to update ${routine.name}`,
            });
        }
        const updatedRoutine = await updateRoutine({ id, name, goal, isPublic });
        res.send(updatedRoutine);
    } catch ({ name, message }) {
        next({ name, message });
    }
})

// DELETE /api/routines/:routineId
router.delete('/:routineId', requireUser, async (req, res, next) => {
    const id = req.params.routineId;
    const routine = await getRoutineById(id)
    try {
        if (routine.creatorId != req.user.id) {
            res.status(403)
            next({
                name: "UserDoesNotMatch",
                message: `User ${req.user.username} is not allowed to delete ${routine.name}`
            })
        }
            destroyRoutine(id)
            res.send(routine)
    } catch (error) {
        next(error);
    }
})

// POST /api/routines/:routineId/activities
router.post('/:routineId/activities', requireUser, async (req, res, next) => {
    const {routineId} = req.params
    const { activityId, duration, count } = req.body;
    const _activityId = await getRoutineActivityById(activityId)
    try {
        if (_activityId) {
            next({
                name:"duplicate activityId",
                message: `Activity ID ${activityId} already exists in Routine ID ${routineId}`
            })
        }else{
            const newRoutine = await addActivityToRoutine({routineId, activityId, duration, count})
            res.send(newRoutine)
        }
    } catch (error) {
        next(error);
    }
})

module.exports = router;
