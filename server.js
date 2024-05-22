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


app.use((req, res, next) => {
  if (req.session.message) {
    res.locals.message = req.session.message;
    req.session.message = null;
  }
  next();
});



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
      req.body.createdBy = req.session.user.userId;
      // throw new Error ('I forced this error')
      const newFood = await Food.create(req.body);
      req.session.message = "Food successfully created.";
      res.redirect('/foods');
    } catch (error) {
      req.session.message = error.message;
      res.redirect('/foods')
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
    res.render('error.ejs', { error: error.message })
  }
})


app.get('/foods/:foodId/reviews', (req, res) => {
  res.render('newReview.ejs', { foodId: req.params.foodId })
})



app.delete('/foods/:foodId', async (req, res) => {
  try {
    await Food.findByIdAndDelete(req.params.foodId)
    res.redirect('/foods')
  } catch (error) {
    res.render('error.ejs', { error: error.message })
  }
})

app.put('/foods/:foodId', async (req, res) => {
  try {
    const updateFood = await Food.findByIdAndUpdate(req.params.foodId, req.body, { new: true })
    res.redirect('/foods')
  } catch (error) {
    res.render('error.ejs', { error: error.message })
  }
})


app.post('/foods/:foodId/reviews', async (req, res) => {
  console.log(req.body)
  if(req.session.user) {
    const foodId = req.params.foodId
    const foodFromDB = await Food.findById(foodId)
    req.body.reviewer = req.session.user.userId
    foodFromDB.reviews.push(req.body)
    await foodFromDB.save()
    res.redirect(`/foods/${foodId}`)
  } else {
    res.redirect('/auth/sign-in')
  }

})



app.listen(port, () => {
  console.log(`Listening ${process.env.MONGODB_URI}`);
});