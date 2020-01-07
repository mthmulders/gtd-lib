const defaultOptions = {
    credentials: 'same-origin',
};

// errorMapping is an object, where each key is
// an HTTP status code. The value for that key
// is a function from response => string.

/**
 * Verifies an HTTP response, converting it into a rejected promise if needed.
 * @param {Response} response The response that yielded from fetch(...)
 * @param {object} errorMapping An error mapping as described above.
 * @returns {Promise<any>} 
 */
const checkStatus = (response, errorMapping = {}) => {
    const status = response.status;
    if (status >= 200 && status < 300) {
        return Promise.resolve(response);
    } else {
        const mapping = errorMapping[status];
        const message = mapping ? mapping(response) : `HTTP error ${response.status}: ${response.statusText}`;
        return Promise.reject(new Error(message));
    }
};

/**
 * Convert an HTTP response into an object structure. It assumes the response
 * contains JSON.
 * @param {Response} response The response that yielded from fetch(...)
 * @returns {Promise<object>} An object structure corresponding to the JSON response body.
 */
const parseJSON = (response) => response.json();

const get = (input, init, errorMapping) => {
    const options = { ...defaultOptions, ...init };
    return fetch(input, options)
        .then((res) => checkStatus(res, errorMapping))
        .then(parseJSON);
};

const post = (input, init, errorMapping) => {
    const options = { ...defaultOptions, ...init, method: 'POST' };
    return fetch(input, options)
        .then((res) => checkStatus(res, errorMapping))
        .then(parseJSON);
};

const login = (username, password) => {
    const params = [
        `${encodeURIComponent('username')}=${encodeURIComponent(username)}`,
        `${encodeURIComponent('password')}=${encodeURIComponent(password)}`,
    ]
    const data = params.join('&').replace(/%20/g, '+');
    const options = {
        ...defaultOptions,
        body: data,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        method: 'POST'
    };

    return fetch('/public/users/login', options)
                .then(checkStatus)
                .then(response => response.text());
};

const getContexts = (token) => {
    const options = {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    };
    return get('/contexts', options);
};

const api = { getContexts, login };

export default api;
