const request = require('supertest');
const assert = require('assert');
const app = require('../app');

describe('API Tests', () => {
    it('Ответ сервера на запрос несуществующего маршрута', (done) => {
        request(app)
        .get('/non-existing-route')
        .expect(404)
        .end((err, res) => {
            if (err) return done(err);
            assert.strictEqual(res.body.error, '404. Страница не существует');
            assert.strictEqual(res.body.code, 404);
            done();
        });
    });

});