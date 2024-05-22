const mongoose = require('mongoose')


const reviewSchema = new mongoose.Schema(
    {
        text: { type: String, required: true },
        reviewer: { type: mongoose.Schema.ObjectId, required: true, ref: 'user' },
    },
    { timestamps: true }

    );

const foodsModel = new mongoose.Schema({
    name: { type: String, required: true },
    type: { type: String, required: false },
    createdBy: { type: mongoose.Schema.ObjectId, ref: 'User' },
    reviews: [reviewSchema],
})

module.exports = mongoose.model('Food', foodsModel)