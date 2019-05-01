const mongoose = require('mongoose');

// map global promises
mongoose.Promise = global.Promise;

mongoose
  .connect('mongodb://victor:v1ctor@ds115436.mlab.com:15436/polling-app')
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));
