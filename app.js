const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');
const flash = require('connect-flash');
require('dotenv').config();
const errorController = require('./controllers/error');
const User = require('./models/user');

const MONGODB_URI =
  `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.rwppj.mongodb.net/shop?retryWrites=true&w=majority`;

const app = express();
const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: 'sessions'
});
const csrfProtection = csrf();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(
  session({
    secret: 'my secret',
    resave: false,
    saveUninitialized: false,
    store: store
  })
);
app.use(csrfProtection);
app.use(flash());


app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
});

app.use((req, res, next) => {
  // throw new Error('Sync dummy')
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then(user => {
      if(!user){
        return next();
      }
      req.user = user;
      next();
    })
    .catch(err =>{
      next(new Error(err));
    })
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);


app.use('/500', errorController.get500);

app.use(errorController.get404);

app.use((error, req, res, next) =>{
  //res.status(error.httpStatusCode).render(..);
  // res.redirect('/500');
  res.status(500).render('500', {
    pageTitle: 'Error!',
    path: '/500',
    isAuthenticated: req.session.isLoggedIn
  });
});


const PORT = process.env.PORT || 5000
mongoose
  .connect(MONGODB_URI,
    )
  .then(result => {
    app.listen(PORT);
  })
  .catch(err => {
    console.log(err);
  });






















// const User = require('./models/user');
// require('dotenv').config();
// const PORT = process.env.PORT || 5000

// const path = require('path');

// const express = require('express');
// const bodyParser = require('body-parser');
// const mongoose = require('mongoose');
// const cors = require('cors')
// const session = require('express-session');
// const MongoDBStore =require('connect-mongodb-session')(session);
// const csrf = require('csurf');
// const flash = require('connect-flash');
// const errorController = require('./controllers/error');


// const MONGODB_URI = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.rwppj.mongodb.net/shop?retryWrites=true&w=majority`

// const app = express();
// const store = new MongoDBStore({
//   uri: MONGODB_URI,
//   collection: 'sessions'
// });

// const csrfProtection = csrf();

// app.set('view engine', 'ejs');
// app.set('views', 'views');

// const adminRoutes = require('./routes/admin');
// const shopRoutes = require('./routes/shop');
// const authRoutes = require('./routes/auth');

// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(express.static(path.join(__dirname, 'public')));

// app.use(
//   session({
//     secret: "my secret",
//     resave: false,
//     saveUninitialized: false,
//     store: store,
//   })
// );
// app.use(csrfProtection);
// app.use(flash());
// app.use((req, res, next) => {
//   if(!req.session.user){
//     return next();
//   }
//   User.findById(req.session.user._id)
//     .then((user) => {
//       req.user = user;
//       next();
//     })
//     .catch((err) => {
//       console.log(err);
//     });
// });

// app.use((req, res, next) => {
//   res.locals.isAuthenticated = req.session.isLoggedIn;
//   res.locals.csrfToken = req.csrfToken();
//   next();
// })
// app.use('/admin', adminRoutes);
// app.use(shopRoutes);
// app.use(authRoutes);

// app.use(errorController.get404);

// const corsOptions = {
//   origin: "https://doda-online-store1.herokuapp.com/",
//   optionsSuccessStatus: 200
// };
// app.use(cors(corsOptions));
// const options = {
//   family: 4
// };

// const MONGODB_URL = process.env.MONGODB_URL || "mongodb+srv://mdoda111:Forzamilan123455555@cluster0.rwppj.mongodb.net/shop?retryWrites=true&w=majority";


// mongoose
//   .connect(
//     MONGODB_URL,
//     options )
//  .then((result) => {
//    User.findOne().then((user) => {
//      if (!user) {
//        const user = new User({
//          name: "Mateo",
//          email: "mateo@gmail.com",
//          cart: {
//            items: [],
//          },
//        });
//        user.save();
//      }
//    });
//    app.listen(PORT);
//   })
//   .catch(err => {
//     console.log(err);
//   });
