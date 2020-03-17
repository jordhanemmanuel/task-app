const express = require('express')
const router = new express.Router()
const Task = require('../models/task')
const checkValidKeys = require('../others/checkValidKeys')

/* ---------- Tratamento de Tasks ------------------------------------------------------------ */

router.post('/tasks', async (req, res) => {
    try {
        const task = new Task(req.body)
        await task.save()
        res.status(201).send(task)
    } catch (e) {
        res.status(400).send(e.errors)
    }
})

router.get('/tasks', async (req, res) => {
    try {
        const tasks = await Task.find({})
        res.send(tasks)
    } catch (e) {
        res.status(500).send(e)
    }
})

router.get('/tasks/:id', async (req, res) => {
    try {
        const task = await Task.findById(req.params.id)
        if (!task)
            return res.status(404).send()

        res.send(task)
    } catch (e) {
        res.status(500).send(e)
    }
})

router.patch('/tasks/:id', async (req, res) => {
    const updates = Object.keys(req.body)
    if (!checkValidKeys(['description', 'completed'], updates))
        return res.status(400).send({error: 'Invalid updates keys'})

    try {
        //const task = await Task.findByIdAndUpdate(req.params.id, req.body, {  new: true, runValidators: true  })
        const task = await Task.findById(req.params.id)
        updates.forEach((update) => task[update] = req.body[update])
        await task.save()

        if (!task)
            return res.status(404).send()

        res.send(task)
    } catch (e) {
        res.status(500).send(e)
    }
})

router.delete('/tasks/:id', async (req, res) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id)
        if (!task)
            return res.status(404).send()

        res.send(task)
    } catch (e) {
        res.status(500).send(e)
    }
})

module.exports = router