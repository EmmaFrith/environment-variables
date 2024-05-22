const port = 4000

const authController = require("./controllers/auth.js");


require('dotenv').config();
const express = require('express');

const mongoose = require('mongoose')

const Food = require('./models/foods')

const session = require('express-session');

const app = express();

const path = require('path')

const methodOverride = require("method-override")
const morgan = require("morgan")

mongoose.connect(process.env.MONGODB_URI)

mongoose.connection.on("connected", () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});

app.use(express.json())

app.use(express.static(path.join(__dirname, "public")));

app.use(express.urlencoded({ extended: false }));

app.use(methodOverride("_method"))

app.use(morgan('dev'));

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

app.use(function (req, res, next) {
  res.locals.user = req.session.user;
  next();
});

app.use("/auth", authController);


app.get('/', (req, res) => {
  try {
    res.render('home.ejs', {
      user: req.session.user,
    });
  } catch (error) {
    res.render('error.ejs', { error: error.message })
  }
});


app.get('/foods', async (req, res) => {
  try {
    const foods = await Food.find()
    res.render('foods.ejs', {
      foods,
    });
  } catch (error) {
    res.render('error.ejs', { error: error.message })
  }
});


app.get('/new-food', (req, res) => {
  res.render('new.ejs')
});

app.post('/foods', async (req, res) => {
  if (req.session.user) {
    try {
      const newFood = await Food.create(req.body);
      res.redirect('/foods');
    } catch (error) {
      res.render('error.ejs', { error: error.message });
    }
  } else {
    res.redirect('auth/sign-in')
  }
});

app.get('/foods/:foodId', async (req, res) => {
  try {
    const singleFood = await Food.findById(req.params.foodId)
    res.render('show.ejs', {
      singleFood
    });
  } catch (error) {
    res.render('error.ejs', { error: error.message })
  }
});

app.get('/foods/:foodId/edit', async (req, res) => {
  try {
    const singleFood = await Food.findById(req.params.foodId)
    res.render('edit.ejs', {
      singleFood
    });
  } catch (error) {
    res.render('error,ejs', { error: error.message })
  }
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