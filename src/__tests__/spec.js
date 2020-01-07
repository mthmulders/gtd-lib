const fetchMock = require('fetch-mock');

import api from '../index';

fetchMock.config.overwriteRoutes = true;

describe('Generic helper functions', () => {
    afterEach(() => {
        fetchMock.restore();
    });

    describe('with default error handling', () => {
        describe('when the response status is not in 2xx range', () => {
            it('should throw an error', () => {
                // Arrange
                fetchMock.get('*', 404);

                // Act
                return api.get('/').catch((error) => {
                    // Assert
                    expect(error.message).toBe('HTTP error 404: Not Found');
                });
            });
        });
    });

    describe('with custom error handling', () => {
        describe('when the error code is defined as a string', () => {
            it('should throw the predefined error', () => {
                // Arrange
                const errorMapping = { 500: (response) => 'Something quite bizarre' };
                fetchMock.get('*', 500);

                // Act
                return api.get('/', undefined, errorMapping).catch((error) => {
                    // Assert
                    expect(error.message).toBe('Something quite bizarre');
                });
            });
        });

        describe('when the error code is not defined', () => {
            describe('when the response status is not in 2xx range', () => {
                it('should throw an error', () => {
                    // Arrange
                    fetchMock.get('*', 401);

                    // Act
                    return api.get('/').catch((error) => {
                        // Assert
                        expect(error.message).toBe('HTTP error 401: Unauthorized');
                    });
                });
            });
        });
    });

    describe('when the response status is in 2xx range', () => {
        it('should convert the body to JSON', () => {
            // Arrange
            const body = JSON.stringify({ hello: 'world' });
            fetchMock.get('*', { status: 200, body });

            // Act
            return api.get('/').then((result) => {
                // Assert
                expect(result).toEqual({ hello: 'world' });
            });
        });
    });
});

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