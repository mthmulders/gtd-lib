import helpers from './helpers';

const login = (username, password) => {
    const params = [
        `${encodeURIComponent('username')}=${encodeURIComponent(username)}`,
        `${encodeURIComponent('password')}=${encodeURIComponent(password)}`,
    ]
    const data = params.join('&').replace(/%20/g, '+');
    const options = {
        ...helpers.defaultOptions,
        body: data,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        method: 'POST'
    };

    return fetch('/public/users/login', options)
                .then(helpers.checkStatus)
                .then(response => response.text());
};

const getContexts = (token) => {
    const options = {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    };
    return helpers.get('/contexts', options);
};

const api = { getContexts, login };

export default api;
