'use strict';
const chai = require('chai');
chai.should();
const assert = require('chai').assert;
const expect = require('chai').expect;
const describe = require('mocha').describe;
const it = require('mocha').it;

const lambda = require('../index');

describe('Basic Tests: ', () => {
    it('Can run lambda', done => {
        const event = {word: 'tiger '};
        lambda.handler(event, context, function (err, data) {
            if (err) {
                done(err);
            } else {
                console.log(data);
                expect(data).to.an('string');
                done();
            }
        });
    });

    it('Can cannot run lambda with no word', done => {
        const event = {word: ''};
        lambda.handler(event, context, function (err, data) {
            if (err) {
                console.log(err);
                expect(err).to.a('error');
                done();
            } else {
                done();
            }
        });
    });
});