const expect = require('chai').expect;
const jwt = require('jsonwebtoken');
const sinon = require('sinon');

const authMiddlware = require('../middleware/is-auth');

describe('Auth middleware', function () {
    it('should throw an error if no authorization header is present', function () {
        const req = {
            get: function () {
                return null;
            },
        };
        expect(authMiddlware.bind(this, req, {}, () => {})).to.throw('Not authenticated');
    });

    it('should throw an error if the authorization header is only one string', function () {
        const req = {
            get: function () {
                return 'xyz';
            },
        };
        expect(authMiddlware.bind(this, req, {}, () => {})).to.throw();
    });

    it('should yield a userId after decoding the token', function () {
        const req = {
            get: function () {
                return 'Bearer xyz';
            },
        };
        sinon.stub(jwt, 'verify');
        jwt.verify.returns({ userId: 'abc' });
        authMiddlware(req, {}, () => {});
        expect(req).to.have.property('userId');
        expect(req).to.have.property('userId', 'abc');
        expect(jwt.verify.called).to.be.true;

        jwt.verify.restore();
    });
    it('should throw an error if the token cannot be verified', function () {
        const req = {
            get: function () {
                return 'Bearer xyz';
            },
        };
        expect(authMiddlware.bind(this, req, {}, () => {})).to.throw();
    });
});