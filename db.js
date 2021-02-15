const async = require('async');
const orm = require('orm');
const settings = require('./settings');

if (require.main === module && process.argv.indexOf('--create-test-db') > -1) {
  orm.connect(`${settings.partial_dsn}/`, function (err, db) {
    db.driver.execQuery(`CREATE DATABASE IF NOT EXISTS test`, function (err, data) {
      console.log("Test database was successfully created");
    });
  });
}

const db = orm.connect(settings.dsn);

db.on('connect', function (err) {
  if (err) return console.error('Connection error: ' + err);
});

const functions = {
  createTables: function (next) {
    db.load("./models", function (err) {
      if (err) throw err;
      // create tables
      db.sync(function (err) {
        if (err) throw err;
        next();
      });
    });
  },

  applyFixtures: function (next) {
    this.truncateTables(function () {
      async.series([
        function (callback) {
          db.models.users.create({
            id: 1,
            email: "user1@example.com",
            password: "$2a$10$mhkqpUvPPs.zoRSTiGAEKODOJMljkOY96zludIIw.Pop1UvQCTx8u"
          }, function (err) {
            callback(null)
          });
        },
        function (callback) {
          db.models.users.create({
            id: 2,
            email: "user2@example.com",
            password: "$2a$10$mhkqpUvPPs.zoRSTiGAEKODOJMljkOY96zludIIw.Pop1UvQCTx8u"
          }, function (err) {
            callback(null)
          });
        },
        function (callback) {
          db.models.pads.create({
            id: 1,
            name: "Pad 1",
            user_id: 1
          }, function (err) {
            callback(null)
          });
        },
        function (callback) {
          db.models.pads.create({
            id: 2,
            name: "Pad 2",
            user_id: 1
          }, function (err) {
            callback(null)
          });
        },
        function (callback) {
          db.models.notes.create({
            id: 1,
            name: "Note 1",
            text: "Text",
            user_id: 1,
            pad_id: 1,
          }, function (err) {
            callback(null)
          });
        },
        function (callback) {
          db.models.notes.create({
            id: 2,
            name: "Note 2",
            text: "Text",
            user_id: 1,
            pad_id: 1,
          }, function (err) {
            callback(null)
          });
        }
      ], function (err, results) {
        next();
      })
    });
  },

  truncateTables: function (next) {
    async.series([
      function (callback) {
        db.models.users.clear();
        callback(null);
      },
      function (callback) {
        db.models.pads.clear();
        callback(null);
      },
      function (callback) {
        db.models.notes.clear();
        callback(null);
      }
    ], function (err, results) {
      next();
    })
  }
}

if (require.main === module) {
  functions.createTables(function () {
    console.log("All tables were successfully synchronized with the models");
    process.exit(0)
  });
}

module.exports = functions;
