# iModels API Sample Application

## Overview
This is a simple React based application that demonstrates iModel management workflow that can be achieved using iModels API:
- Loading the iModels for an iTwin
- Loading Changesets and Named Versions for an iModel
- Creating a Named Version for a specific Changeset

The communication with the iModels API is implemented in the ```iModelHubService``` class. Full iModels API documentation can be found in [Developer Portal](https://developer.bentley.com/apis/imodels-v2).

This application is built using components from [@itwin/itwinui-react](https://github.com/iTwin/iTwinUI-react) library.

<b>Note:</b> This application is not production ready and is intended to only be run locally.

---
## Prerequisites
In order to run this application user has to have a SPA client with ```itwin-platform``` scope and an iTwin that has iModels. Instructions on how to create a SPA client can be found in [this tutorial](https://developer.bentley.com/tutorials/web-application-quick-start#3-register-an-application) under section "Register an Application".

## Run the code

1\. Configure the application by entering the appropriate values in ```.env``` file:
- `REACT_APP_AUTH_CLIENT_ID`: Enter the ClientID for the client you registered.
- `REACT_APP_ITWIN_ID`: Enter the iTwin id that the application will display iModels for.

The rest of the configuration has default values that do not have to be changed.

2\. Install npm packages
```
npm install
```
3\. Serve the application
```
npm start
```

## Client Packages

This application defines [IModelsService class](./src/services/iModelsService.ts) to wrap API calls. It supports only a few operations, is very minimal and is intended to demonstrate the basics on how to consume the iModels API.

Open source TypeScript client packages are available for iModels API:
- @itwin/imodels-client-management - [NPM registry](https://www.npmjs.com/package/@itwin/imodels-client-management), [documentation](https://github.com/iTwin/imodels-clients/blob/main/docs/IModelsClientManagement.md)
- @itwin/imodels-client-authoring - [NPM registry](https://www.npmjs.com/package/@itwin/imodels-client-authoring), [documentation](https://github.com/iTwin/imodels-clients/blob/main/docs/IModelsClientAuthoring.md)

Please check the [general documentation](https://github.com/iTwin/imodels-clients/tree/main/docs) for explanation on the difference between the packages.
