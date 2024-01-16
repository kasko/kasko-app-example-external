# KASKO App Example External
Example KASKO webapp.

## Requirements
- node v20+
- npm v9+

## Project structure

```js
  ├─ .env
  ├─ .env.example
  ├─ .kasko
  │  └─ config.json   // configurations of source files
  ├─ mock-api
  │  └─ api.js
  ├─ product.json     // configuration of product
  └─ src
    ├─ app.js         // webapp code
    ├─ app.css        // webapp css
    ├─ dashboard.css  // webapp css (only when open from dashboard)
    ├─ plugin-versions.yaml   // versions of plugins
    ├─ integrations
    │  └─ test1
    │     ├─ index.js
    │     ├─ response.js
    │     └─ style.css
    ├─ product
    │  ├─ contents
    │  │  ├─ en.csv
    │  │  └─ index.js
    │  ├─ index.js
    │  ├─ field-definition.json
    │  ├─ pricing-field-definition.json
    │  ├─ manifest.json
    │  └─ response.js
    ├─ sub_products
    │  └─ test1
    │     └─ index.js
    ├─ components
    │  └─ custom-title.jsx         // sample custom component
    ├─ services
    │  └─ set-age-from-dob.js      // sample custom data service
    └─ validators
        └─ disallow-odd-number.js  // sample custom validation rule
```

## Getting started

1. Install dependencies using npm or your package manager of choice.
```sh
npm install
```

2. Create `.env` file using `.env.example` as a template.

3. Update `product.json` to meet your product configuration & needs.


## Import data from webapp builder

In webapp builder there's a feature that exports zip file containing webapp manifest, js & css files (this file is ready for upload in dashboard). And another zip file that contains field definition and content files.

Use both of these files to fill data in this repo.

Here's a rough idea of how it should be done.

```
Webapp File (.zip)
  manifests/main.json         ->  src/product/manifest.json
  app.css                     ->  src/app.css

Contents & Field Definition (.zip)
  field_definition.json       ->  src/product/field-definition.json
  field_definition_quote.json ->  src/product/pricing-field-definition.json
  contents.csv                ->  src/product/contents/en.csv
```

Make sure that `src/plugin-versions.yaml` file contains same plugins and versions as in webapp builder.

> **Note**
> After changing framework version, please run `npm install` to get latest manifest types.

More information: https://docs.kasko.io/kasko-frontend-documentation/getting-started/manifest-flow

## Start dev server

To start webapp locally run `start` command:

```sh
npm start
```

This will start webapp/product with multiple integrations defined in `product.json` on localhost port 3000.

Navigate to that page to see current webapp configuration "in action". Update manifest/field definition/contents to see changes reflected in live preview.

## Create custom component

If existing components do not fit the requirements of some specific UI element or feature then it's possible to write a custom component (using web components).

There's a sample of how that can be done in `src/components/custom-title.jsx`. This component is written using React, but practically any framework or vanilla web components can be used.

Every component must be defined in `src/app.js`.

This sample component can be used in `manifest.json` like so:
```json
{
  "type": "custom-title",
  "config": {
    "content_key": "flow.start.title"
  }
}
```

More information: https://docs.kasko.io/kasko-frontend-documentation/guides/plugins

## Create custom service

For custom data manipulation or other needs, it's possible to create custom service, that runs in the background of webapp.

There's a sample service in `src/services/set-age-from-dob.js`. This service uses kasko public service that is exposed from framework. Typescript interface of that can be found in `typos/public.service.d.ts` files.

More information: https://docs.kasko.io/kasko-frontend-documentation/guides/plugins

## Create custom validation (FE only)

If existing validation rules do not get the job done, it's possible to create custom validation rules.

There's a sample validation rule in `src/validators/disallow-odd-number.js`.

This rule can be used in field definition like so:
```json
{
  "path": "data",
  "name": "age",
  "validation": "required|disallowed_odd_number"
}
```

More information: https://docs.kasko.io/kasko-frontend-documentation/core-concepts/validation/custom-validators

## Mock requests

For getting example of different price for example, it's possible to change request response that is mocked in local dev server.

Mocked requests can be defined in `mock-api/api.js` file.

## Deploy webapp

First thing to do is to prepare everything for deployment by running `build` command:

```sh
npm run build
```

It will produce file structure like this in `dist` folder:
```js
  └─ products
    └─ pr_123
        ├─ field_definition.json
        ├─ pricing_field_definition.json
        └─ webapp
          ├─ .kasko
          │  └─ config.json
          ├─ app.css
          ├─ app.js
          ├─ dashboard.css
          └─ manifests
              └─ manifest.json
```

Now every product/webapp folder is ready for zipping:

```sh
zip -r webapp.zip dist/products/pr_123/webapp
```

1. Upload newly created `webapp.zip` to KASKO dashboard;

2. Update product field definition in KASKO dashboard;
    - (from `dist/products/pr_123/field_definition.json`)

3. Update product pricing field definition in KASKO dashboard;
    - (from `dist/products/pr_123/pricing_field_definition.json`)

4. Update product contents in KASKO dashboard;
    - (from `src/product/contents/en.csv`)

5. *(optional)* Update product integration css;
    - (from `src/integrations/test1/style.css`)

Product is now on KASKO platform.

## Documentation

More information on how to work with manifest, field definition and other concepts can be found in our documentation site: https://docs.kasko.io/kasko-frontend-documentation/
