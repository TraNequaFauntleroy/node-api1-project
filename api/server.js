const express = require('express')
const server = express()
const User = require('./users/model')
server.use(express.json())

//[GET] api/users
server.get('/api/users', (req, res) => {
    User.find()
    .then(users => 
        res.status(200).json(users))
    .catch(err => {
        res.status(500).json({
            message: "The users information could not be retrieved",
            err: err
        })
    })
})

//[GET] api/users/:id
server.get('/api/users/:id', (req, res) => {
    User.findById(req.params.id)
    .then(user => {
        if (!user) {
            res.status(404).json({
                message: "The user with the specified ID does not exist" 
            })
        } else {
            res.status(200).json(user)
        }
    })
    .catch(err => {
        res.status(500).json({
            message: "The user information could not be retrieved",
            err: err
        })
    })
})

//[POST] api/users
server.post('/api/users', (req, res) => {
    const user = req.body
        if (!user.name || !user.bio) {
            res.status(400).json(
                {message: "Please provide name and bio for the use"})
        } else {
            User.insert(user)
            .then(newUser => {
                res.status(201).json(newUser)
            })
            .catch(err => {
                res.status(500).json({
                    message: "There was an error while saving the user to the database",
                    err: err
                })
            })
        }
})

// [DELETE] api/users/:id
server.delete('/api/users/:id', async (req, res) => {
   try {
    const user = await User.findById(req.params.id)
    if (!user) {
        res.status(404).json({
            message: "The user with the specified ID does not exist"
        })
    } else {
       const deletedUser = await User.remove(user.id)
                res.status(200).json(deletedUser)
    }
   } catch(err) {
    res.status(500).json({
        message: "There was an error while saving the user to the database",
        err: err
   }) 
    }
})

// [PUT] api/users/:id
server.put('/api/users/:id', async (req, res) => {
   try {
    const potentialUser = await User.findById(req.params.id)
    if (!potentialUser) {
        res.status(404).json({
            message: "The user with the specified ID does not exist"
        })
    } else {
        if (!req.body.name || !req.body.bio) {
            res.status(400).json({
                message: "Please provide name and bio for the user"
            })
        } else {
           const updatedUser = await User.update(
               req.params.id, 
               req.body
            )
           res.status(200).json(updatedUser)
        }
      }
   } catch (err) {
    res.status(500).json({
        message: "The user information could not be modified",
        err: err
   }) 
  }
})




server.use('*', (req, res) => {
    res.status(404).json({
        message: 'not found'
    })
})

module.exports = server