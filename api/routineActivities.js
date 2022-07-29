const express = require('express');
const router = express.Router();
const { requireUser } = require("./utils");
const { getRoutineActivityById, getRoutineById, destroyRoutineActivity, updateRoutineActivity } = require("../db")

// PATCH /api/routine_activities/:routineActivityId
router.patch('/:routineActivityId', requireUser, async (req, res, next) => {
    const { duration, count } = req.body;
    const id = req.params.routineActivityId;
    const routine = await getRoutineById(id)
    try {
        if (routine.creatorId != req.user.id) {
            res.status(403)
            next({
                name: "UserNotFound",
                message: `User ${req.user.username} is not allowed to update ${routine.name}`,
            });
        }
        const updatedRoutineActivity = await updateRoutineActivity({ id, duration, count });
        res.send(updatedRoutineActivity);
    } catch ({ name, message }) {
        next({ name, message });
    }
})

// DELETE /api/routine_activities/:routineActivityId
router.delete('/:routineActivityId', requireUser, async (req, res, next) => {
    const id = req.params.routineActivityId;
    const routineActivity = await getRoutineActivityById(id)
    const routine = await getRoutineById(routineActivity.id)
    try {
        if (routine.creatorId != req.user.id) {
            res.status(403)
            next({
                name: "UserDoesNotMatch",
                message: `User ${req.user.username} is not allowed to delete ${routine.name}`
            })
        }
            await destroyRoutineActivity(id)
            res.send(routineActivity)
    } catch (error) {
        next(error);
    }
})

module.exports = router;
