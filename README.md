# GTD Client Lib

[![CircleCI](https://circleci.com/gh/mthmulders/gtd-lib/tree/master.svg?style=svg)](https://circleci.com/gh/mthmulders/gtd-lib/tree/master)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=mthmulders_gtd-lib&metric=alert_status)](https://sonarcloud.io/dashboard?id=mthmulders_gtd-lib)
[![Technical Debt](https://sonarcloud.io/api/project_badges/measure?project=mthmulders_gtd-lib&metric=sqale_index)](https://sonarcloud.io/dashboard?id=mthmulders_gtd-lib)
[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=mthmulders_gtd-lib&metric=coverage)](https://sonarcloud.io/dashboard?id=mthmulders_gtd-lib)


This JavaScript library is used to interact with my [Getting Things Done server](https://github.com/mthmulders/gtd-server).

## Using it

### Add the library to your Node project

Update package.json with the following and run `npm i` afterwards.

```json
"dependencies" {
    "gtd-lib": "0.0.5"
}
```

### Import the library

```js
import gtd from 'gtd-lib';
```

### Use the library

```js
const token = await gtd.login('username', 's3cr3t-p455w0rd');

const getContexts = async () => {
    return await gtd.getContexts(token);
}

const getTasks = async (contextId) => {
    return await gtd.getTasksForContext(token, contextId);
}
```