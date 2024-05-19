const mongoose = require('mongoose')

const foodsModel = new mongoose.Schema({
    name: { type: String, required: true },
    type: { type: String, required: false},
}) 

module.exports = mongoose.model('Food', foodsModel)