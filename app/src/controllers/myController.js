const mongoose = require('mongoose');
require('../models/myModel.js');
const Message = mongoose.model('Message');


module.exports = {
    async index(req, res) {
        const { page = 1 } = req.query;
        const message = await Message.find({});
        return res.json(message);
    },

    async store(req, res) {
        const message = await Message.create(req.body);
        return res.json(message);
    },

    async show(req, res) {
        const message = await Message.findById(req.params.id);
        return res.json(message);
    },

    async update(req, res) {
        const message = await Message.findByIdAndUpdate(req.params.id, req.body, {new: true});
        return res.json(message);
    },

    async destroy(req, res) {
        const message = await Message.findByIdAndRemove(req.params.id);
        return res.send("Removido!");
    }

}