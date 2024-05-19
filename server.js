const port = 4000


require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose')

const Food = require('./models/foods')

const app = express();

const path = require('path')

const methodOverride = require("method-override")
const morgan = require("morgan")

mongoose.connect(process.env.MONGODB_URI)
app.use(express.json())

app.use(express.static(path.join(__dirname, "public")));

app.use(express.urlencoded({ extended: false }));

app.use(methodOverride("_method"))


app.get('/', (req, res) => {
  res.render('home.ejs');
});


app.get('/foods', async (req, res) => {
  const foods = await Food.find()
  res.render('foods.ejs', {
    foods,
  })
})

app.get('/new-food', (req, res) => {
  res.render('new.ejs')
})


app.post('/foods', async (req, res) => {
  const newFood = await Food.create(req.body)
  res.redirect('/foods')
})


app.get('/foods/:foodId', async (req, res) => {
  const singleFood = await Food.findById(req.params.foodId)
  res.render('show.ejs', {
    singleFood
  })
})

app.get('/foods/:foodId/edit', async (req, res) => {
  const singleFood = await Food.findById(req.params.foodId)
  res.render('edit.ejs', {
    singleFood
  })
})

app.delete('/foods/:foodId', async (req, res) => {
  await Food.findByIdAndDelete(req.params.foodId)
  res.redirect('/foods')
})

app.put('/foods/:foodId', async (req, res) => {
  const updateFood = await Food.findByIdAndUpdate(req.params.foodId, req.body, { new: true })
  res.redirect('/foods')
})


app.listen(port, () => {
  console.log(`Listening ${process.env.MONGODB_URI}`);
});