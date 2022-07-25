const client = require("./client");

// database functions
async function createActivity({ name, description }) {
    const { rows: [ activity ] } = await client.query(`
      INSERT INTO activities(name, description) 
      VALUES($1, $2)
      RETURNING *;
    `, [name, description]);

    return activity
}

async function getAllActivities() {
  const { rows: activityIds } = await client.query(`
  SELECT id
  FROM activities;
`);

const activities = await Promise.all(activityIds.map(
  activity => getActivityById( activity.id )
));

return activities;
}

async function getActivityById(id) {
  const { rows: [ activity ]  } = await client.query(`
  SELECT *
  FROM activities
  WHERE id=$1;
`, [id]);

if (!activity) {
  throw {
    name: "ActivityNotFoundError",
    message: "Could not find an activity with that id"
  };
}

}

async function getActivityByName(name) {
  const { rows: [activity] } = await client.query(`
    SELECT *
    FROM activity
    WHERE name=$1;
  `, [name]);

return activity;}

async function attachActivitiesToRoutines(routines) {
  
}

async function updateActivity({ id, ...fields}) {
  // don't try to update the id
  // do update the name and description
  // return the updated activity
  const setString = Object.keys(fields).map(
    (key, index) => `"${ key }"=$${ index + 1 }`
  ).join(', ');

  // return early if this is called without fields
  if (setString.length === 0) {
    return;
  }

  const result = await client.query(`
  UPDATE activity
  SET ${ setString }
  WHERE id=${id}
  RETURNING *;
`, Object.values(fields));

return result;
}

module.exports = {
  getAllActivities,
  getActivityById,
  getActivityByName,
  attachActivitiesToRoutines,
  createActivity,
  updateActivity,
};
