const request = require('supertest');
const app = require('../src/server');

describe('Test for route /users', function () {
    let body = {
        "nome": "string",
        "email": "string6",
        "password": "12345",
        "telefones": [{
            "ddd": "21",
            "numero": "string"
        }]
    }
    it('respond with 201 created', function (done) {
        request(app)
            .post('/signup')
            .send(body)
            .expect(201)
            .end((err) => {
                if (err) return done(err);
                done();
            });
    });
});
