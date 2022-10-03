const expect = require('chai').expect;
const sinon = require('sinon');

const User = require('../models/user');
const authConroller = require('../controllers/auth');

describe('Auth Controller - Login', function (done) {
    it('should throw an error with code 500 if accessing db fails', function (done) {
        sinon.stub(User, 'findOne');
        User.findOne.throws();

        const req = {
            body: {
                email: 'test@test.com',
                password: 'tester',
            },
        };

        authConroller
            .postLogin(req, {}, () => {})
            .then(result => {
                expect(result).to.be.an('error');
                expect(result).to.have.property('statusCode', 500);
                done();
            });
        User.findOne.restore();
    });
});
