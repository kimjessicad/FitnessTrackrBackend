/* eslint-disable no-useless-catch */
const client = require("./client");

// database functions
async function createActivity({ name, description }) {
  try {
    const {
      rows: [activity]
    } = await client.query(
      `
      INSERT INTO activities(name, description) 
      VALUES($1, $2)
      RETURNING *;
    `,
      [name, description]
    );

    return activity
  } catch (error) {
    throw error;
  }
}

async function getAllActivities() {
  try {
    const {
      rows
    } = await client.query(
      `
      SELECT *
      FROM activities;
`);
    return rows;
  } catch (error) {
    throw error;
  }
}

async function getActivityById(id) {
  try {

    const {
      rows: [activity]
    } = await client.query(`
  SELECT *
  FROM activities
  WHERE id=${id};
`,);

    return activity;
  } catch (error) {
    throw error;
  }
}

async function getActivityByName(name) {
  try {
    const {
      rows: [activity]
    } = await client.query(`
    SELECT *
    FROM activities
    WHERE name=$1;
  `, [name]);

    return activity;
  } catch (error) {
    throw error;
  }
}

async function attachActivitiesToRoutines(routines) {
  // try {
  //   const createPostTagPromises = tagList.map(
  //     tag => createPostTag(postId, tag.id)
  //   );

  //   await Promise.all(createPostTagPromises);
      
  //   return await getPostById(postId);
  // } catch (error) {
  //   throw error;
  // }
}

async function updateActivity({ id, ...fields }) {
  const setString = Object.keys(fields).map(
    (key, index) => `"${key}"=$${index + 1}`
  ).join(', ');

  if (setString.length === 0) {
    return;
  }

  try {
    const {
      rows: [activity],
    } = await client.query(`
  UPDATE activities
  SET ${setString}
  WHERE id=${id}
  RETURNING *;
`, Object.values(fields)
    );

    return activity;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  getAllActivities,
  getActivityById,
  getActivityByName,
  attachActivitiesToRoutines,
  createActivity,
  updateActivity,
};
