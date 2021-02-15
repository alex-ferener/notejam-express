// Enable test environment
process.env.NODE_ENV = 'test';

const config = {
  host: 'http://localhost',
  port: 3000,

  // build absolute url
  url: function(url) {
    return this.host + ":" + this.port + url;
  },

  // sign in user/agent
  signInUser: function (agent, user) {
    var self = this;
    return function(done) {
      agent
        .post(self.url('/signin'))
        .send(user)
        .end(onResponse);

      function onResponse(err, res) {
        res.should.have.status(200);
        return done();
      }
    };
  }
}

const app = require('../app');
app.listen(config.port);

module.exports = config
