const fetchMock = require('fetch-mock');

import api from '../api';

fetchMock.config.overwriteRoutes = true;

describe('login()', () => {
    afterEach(() => {
        fetchMock.restore();
    });

    it('should POST username and password to /public/users/login', (done) => {
        // Arrange
        const username = 'john';
        const password = 's3cr3t';
        fetchMock.post('/public/users/login', { body: '', status: 200 });

        // Act
        api.login(username, password).then(() => {
            // Assert
            const request = fetchMock.lastOptions();
            expect(request.body).toEqual(`username=john&password=s3cr3t`);
            done();
        });
    });

    it('should return the token', (done) => {
        // Arrange
        const token = '.t.o.k.e.n.';
        fetchMock.post('/public/users/login', { body: token, status: 200 });

        // Act
        api.login('', '').then((result) => {
            // Assert
            expect(result).toEqual(token);
            done();
        });
    });
});

describe('getContexts()', () => {
    afterEach(() => {
        fetchMock.restore();
    });

    it('should GET /contexts', (done) => {
        // Arrange
        const contexts = [{ name: 'Example'}];
        fetchMock.get('/contexts', { body: JSON.stringify(contexts), status: 200 });

        // Act
        api.getContexts('token').then((result) => {
            // Assert
            expect(result).toEqual(contexts);
            done();
        });
    });

    it('should should pass the authorization token', (done) => {
        // Arrange
        const token = '.t.o.k.e.n.';
        const contexts = [{ name: 'Example'}];
        fetchMock.get('/contexts', { body: JSON.stringify(contexts), status: 200 });

        // Act
        api.getContexts(token).then(() => {
            // Assert
            const request = fetchMock.lastOptions();
            expect(request.headers['Authorization']).toContain(token);
            done();
        });
    });
});