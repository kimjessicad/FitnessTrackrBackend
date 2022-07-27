/* eslint-disable no-useless-catch */
const express = require("express");
const router = express.Router();
const jwt = require('jsonwebtoken');
const {createUser, getUser, getUserByUsername, getAllRoutinesByUser, getPublicRoutinesByUser} = require('../db')
const { requireUser} = require('./utils')


// POST /api/users/register
router.post('/register', async (req, res, next) =>{
    const { username, password } = req.body;

  try {
    const _user = await getUserByUsername(username);

    if (_user) {
      next({
        name: 'UserExistsError',
        message: `User ${username} is already taken.`
      });
    }
    if (password.length < 8){
        next({
            name: 'PasswordTooShort',
            message: 'Password Too Short!',
        })
    }

    const user = await createUser({
      username,
      password
    });

    const token = jwt.sign({ 
        id: user.id, 
        username
      }, process.env.JWT_SECRET, {
        expiresIn: '3w'
      });
  
      res.send({ 
        message: "thank you for signing up",
        token, user 
      });
    } catch ({ name, message }) {
      next({ name, message })
  } 
})
// POST /api/users/login
router.post('/login', async (req, res, next) => {
    const { username, password } = req.body;
  
    if (!username || !password) {
      next({
        name: "MissingCredentialsError",
        message: "Please supply both a username and password"
      });
    }
  
    try {
      const user = await getUserByUsername(username);
  
      if (user && user.password == password) {
  
        const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' });
  
  token;
  
        res.send({ message: "you're logged in!", token, user });
      } else {
        next({ 
          name: 'IncorrectCredentialsError', 
          message: 'Username or password is incorrect'
        });
      }
    } catch(error) {
      console.log(error);
      next(error);
    }
  });

// GET /api/users/me
router.get('/me', requireUser, async (req, res, next) => {
    try{
        res.send(req.user); 
    } catch(error){
        next(error)
    }
});

// GET /api/users/:username/routines
router.get('/:username/routines', requireUser, async (req, res, next) => {
    const { username} = await req.params;
    const user = await getUserByUsername(username);
    console.log(user, "sdfbsd")
    try{
      if (!user){
        next({
          name: "NoExistingUser",
          message: "User doesn't exist"
        })
      } else if (user.id === req.user.id){
        const allRoutines = await getAllRoutinesByUser({username})
        res.send(allRoutines)
      } else {
        const publicRoutines = await getPublicRoutinesByUser({username})
        res.send(publicRoutines);
      }

    } catch(error){
        next(error)
    }
});

module.exports = router;
