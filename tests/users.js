var request = require('superagent');
var should = require('should');
require('should-http');

var db = require('../db');
var config = require('./config');

before(function(done) {
  db.createTables(function() {
    db.applyFixtures(done);
  });
});

describe('User', function(){

  it('can successfully sign in', function(done){
    var agent = request.agent();
    agent
    .post(config.url('/signin'))
      .send({email: 'user1@example.com', password: 'password' })
      .end(function(error, res){
        res.redirects.should.eql([config.url('/')]);
        done();
      });
  });

  describe('cant sign in', function() {
    it('with wrong credentials', function(done) {
      var agent = request.agent();
      agent
      .post(config.url('/signin'))
        .send({email: 'unknown@email.com', password: 'unknown' })
        .end(function(error, res){
          res.text.should.containEql('Unknown user');
          done();
        });
    });

    it('if required fields are missing', function(done){
      var agent = request.agent();
      agent
      .post(config.url('/signin'))
        .send({email: '', password: '' })
        .end(function(error, res){
          res.text.should.containEql('Email is required');
          res.text.should.containEql('Password is required');
          done();
        });
    });
  });

  it('can successfully sign up', function(done) {
    var agent = request.agent();
    agent
    .post(config.url('/signup'))
      .send({email: 'usersadfasdf@example.com', password: 'password'})
      .end(function(error, res){
        res.redirects.should.eql([config.url('/signin')]);
        done();
      });
  });

  describe('cant signup', function() {
    it('if email is invalid', function(done) {
      var agent = request.agent();
      agent
      .post(config.url('/signup'))
        .send({email: 'invalid', password: 'password' })
        .end(function(error, res){
          res.text.should.containEql('Invalid email');
          done();
        });
    });

    it('if required fields are missing', function(done) {
      var agent = request.agent();
      agent
      .post(config.url('/signup'))
        .send({email: '', password: '' })
        .end(function(error, res){
          res.text.should.containEql('Invalid email');
          res.text.should.containEql('Password is required');
          done();
        });
    });

    it('if user already exists', function(done) {
      var agent = request.agent();
      agent
      .post(config.url('/signup'))
        .send({email: 'user1@example.com', password: 'password' })
        .end(function(error, res){
          res.text.should.containEql('User with given email already exists');
          done();
        });
    });
  });

  describe('can change current password', function () {
    it('if old password is valid', function (done) {
      var agent = request.agent();
      var signed = config.signInUser(
        agent, {email: 'user1@example.com', password: 'password'}
      );
      signed(function () {
        agent
          .post(config.url('/settings'))
          .send({password: 'password', new_password: 'new_password', confirm_new_password: 'new_password'})
          .end(function (error, res) {
            res.should.have.status(200);
            res.text.should.containEql('Password is successfully changed');
            done();
          });
      });
    });

    it('can successfully login in with the new password', function (done) {
      var agent = request.agent();
      agent
        .post(config.url('/signin'))
        .send({email: 'user1@example.com', password: 'new_password'})
        .end(function (error, res) {
          res.redirects.should.eql([config.url('/')]);
          done();
        });
    });
  });

})
