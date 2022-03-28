#! /usr/bin/env node

console.log('This script populates some test books, authors, genres and bookinstances to your database. Specified database as argument - e.g.: populatedb mongodb+srv://cooluser:coolpassword@cluster0.a9azn.mongodb.net/local_library?retryWrites=true');

// Get arguments passed on command line
var userArgs = process.argv.slice(2);
/*
if (!userArgs[0].startsWith('mongodb')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}
*/
var async = require('async')
var Item = require('./models/item')
var Category = require('./models/category')

var mongoose = require('mongoose');
var mongoDB = userArgs[0];
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var items = [];
var categories = []

function itemCreate(name, description, category, price, stock, URL, pictures, cb ) {
  itemdetail = {name:name , description: description, category: category, price: price, stock: stock, URL: URL, pictures: pictures }
  var item = new Item(itemdetail);
       
  item.save(function (err) {
    if (err) {
      cb(err, null)
      return
    }
    console.log('New Item: ' + item);
    items.push(item)
    cb(null, item)
  }  );
}

function categoryCreate(name, description, URL, cb) {
  var category = new Category({ name: name });
       
  category.save(function (err) {
    if (err) {
      cb(err, null);
      return;
    }
    console.log('New category: ' + category);
    categories.push(category)
    cb(null, category);
  }   );
}

function createItems(cb) {
    async.parallel([
        function(callback) {
          itemCreate( 'laptop msi 32', 'this is the description for a fucking item', categories[0], 58 , 55, 'google.com', ['pic1', 'pic2', 'pic3'], callback);
        },
        function(callback) {
          itemCreate( 'playstation 5', 'the most wanted console in the worl, it is not on sale', categories[2], 1800 , 1, 'ps.sony.com', ['pic1', 'pic2', 'pic3'], callback);
        },
        function(callback) {
          itemCreate( 'rtx 3070', 'the last credit card you will ever want', categories[3], 800 , 1, 'nvidia.com', ['pic1', 'pic2', 'pic3'], callback);
        }
        ],
        // optional callback
        cb);
}


function createCategory(cb) {
    async.parallel([
        function(callback) {
          categoryCreate('laptops', 'gaming and professional laptops', 'google.com', callback);
        },
        function(callback) {
          categoryCreate('monitors', 'The best monitors in the world', 'google.com', callback);
        },
        function(callback) {
          categoryCreate('gaming consoles', 'every single video game console that you want, we have it', 'google.com', callback);
        },
        function(callback) {
          categoryCreate('GPUs', 'GPUs available for everybody', 'google.com', callback);
        }
        ],
        // Optional callback
        cb);
}



async.series([
    createItems,
    createCategory
],
// Optional callback
function(err, results) {
    if (err) {
        console.log('FINAL ERR: '+err);
    }
    else {
        console.log('BOOKInstances: ');
        
    }
    // All done, disconnect from database
    mongoose.connection.close();
});