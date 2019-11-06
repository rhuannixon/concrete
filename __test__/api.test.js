const request = require('supertest');
const app = require('../index');

/**
 * Testing get all user endpoint
 */
describe('POST /users', function() {
    let body = {
        "nome": "string",
        "email": "string5",
        "password": "12345"
    }
    it('respond with 201 created', function(done) {
        request(app)
            .post('/user/signup')
            .send(body)
            .set('Accept', 'application/json')
            .expect(201)
            .end((err) => {
                if (err) return done(err);
                done();
            });
    });
});

describe('GET /users', function() {
    it('respond with json containing a list of all users', function(done) {
        request(app)
            .get('/')
            .set('Accept', 'application/json')
            .expect(200, done);
    });
});