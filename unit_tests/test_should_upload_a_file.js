const request = require('supertest');
const app = require('../app');
const path = require('path');

describe('API Tests', () => {
    it('Проверяет загрузку файла', (done) => {
        const filePath = path.join(__dirname, '../uploads', '1698746829555-41.jpg');

        const authToken = 'w'
    })
})