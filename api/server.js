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




server.use('*', (req, res) => {
    res.status(404).json({
        message: 'not found'
    })
})

module.exports = server