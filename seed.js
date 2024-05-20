
const mongoose = require('mongoose')
require('dotenv').config();

const Foods = require('./models/foods.js')

async function seed() {
    mongoose.connect(process.env.MONGODB_URI)
    const foodData = await Foods.create({
        name: 'apple',
        type: 'fruit'
    })
 }
 
 seed()


