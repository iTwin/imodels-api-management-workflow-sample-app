# iModels API Sample Application

## Overview
This is a simple React based application that demonstrates iModel management workflow that can be achieved using iModels API:
- Loading the iModels for a project
- Loading Changesets and Named Versions for an iModel
- Creating a Named Version for a specific Changeset

The communication with the iModels API is implemented in the ```iModelHubService``` class. Full iModels API documentation can be found in [Developer Portal](https://developer.bentley.com/api-groups/data-management/apis/imodels).

This application is built using components from [@itwin/itwinui-react](https://github.com/iTwin/iTwinUI-react) library.

<b>Note:</b> This application is not production ready and is intended to only be run locally.

---
## Prerequisites
In order to run this application user has to have a SPA client with ```imodels:read``` and ```imodels:modify``` scopes and a project that has iModels. Instructions on how to create a SPA client can be found in [this tutorial](https://developer.bentley.com/tutorials/web-application-quick-start#2-register-an-application).

## Run the code

1\. Configure the application by entering the appropriate values in ```.env``` file:
- `IMJS_AUTH_CLIENT_ID`: Enter the ClientID for the client you registered.
- `IMJS_PROJECT_ID`: Enter the project id that the application will display iModels for.

The rest of the configuration has default values that do not have to be changed.

2\. Install npm packages
```
npm install
```
3\. Serve the application
```
npm start
```