const fetchMock = require('fetch-mock');

import helpers from '../helpers';

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
                return helpers.get('/').catch((error) => {
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
                return helpers.get('/', undefined, errorMapping).catch((error) => {
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
                    return helpers.get('/').catch((error) => {
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
            return helpers.get('/').then((result) => {
                // Assert
                expect(result).toEqual({ hello: 'world' });
            });
        });
    });
});