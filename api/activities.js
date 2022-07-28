const express = require("express");
const router = express.Router();
const { requireUser } = require("./utils");
const {
  getAllActivities,
  createActivity,
  getActivityByName,
  getActivityById,
  updateActivity,
  getPublicRoutinesByActivity,
} = require("../db");

router.get("/", async (req, res, next) => {
  try {
    const allActivities = await getAllActivities();
    res.send(allActivities);
  } catch (error) {
    next(error);
  }
});

router.post("/", requireUser, async (req, res, next) => {
  const { name, description } = req.body;

  try {
    const _activity = await getActivityByName(name);

    if (_activity) {
      next({
        name: "ActivityExistsError",
        message: `An activity with name ${_activity.name} already exists`,
      });
    }
    const activity = await createActivity({
      name,
      description,
    });

    res.send(activity);
  } catch ({ name, message }) {
    next({ name, message });
  }
});

router.patch("/:activityId", requireUser, async (req, res, next) => {
  const { name, description } = req.body;
  const id = req.params.activityId;
  const activity = await getActivityById(id);
  const namedActivity = await getActivityByName(name);

  try {
    if (!activity) {
      next({
        name: "NotFound",
        message: `Activity ${id} not found`,
      });
    } else if (namedActivity) {
      next({
        name: "NotFound",
        message: `An activity with name ${name} already exists`,
      });
    } else {
      const updatedActivity = await updateActivity({ id, name, description });

      res.send(updatedActivity);
    }
  } catch ({ name, message }) {
    next({ name, message });
  }
});

router.get("/:activityId/routines", async (req, res, next) => {
  const id = req.params.activityId;
  const activity = await getActivityById(id);
  const publicRoutines = await getPublicRoutinesByActivity({ id });
  try {
    if (!activity) {
      next({
        name: "NoExistingActivity",
        message: `Activity ${id} not found`,
      });
    } else {
      res.send(publicRoutines);
    }
  } catch ({ name, message }) {
    next({ name, message });
  }
});

module.exports = router;
