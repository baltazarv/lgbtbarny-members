# Install and run:

```bash
npm install
npm run dev
# or
yarn
yarn dev
```

## Production debugging
```bash
yarn build --debug
```

## webpack cli
May need to install `webpack cli`, which `webpack 4` requires:
https://stackoverflow.com/questions/43179531/error-cannot-find-module-webpack-lib-node-nodetemplateplugin

```
npm install --save-dev webpack webpack-cli html-webpack-plugin webpack-dev-server webpack-dev-middleware
```

# Built With

## Ant Design
[Ant Design](http://ant.design), on [version 4](https://ant.design/docs/react/migration-v4).

Default variables can be found in the node_modules `/node_modules/antd/es/style/themes/default.less` or on [GitHub](https://github.com/ant-design/ant-design/blob/master/components/style/themes/default.less) and https://medium.com/anna-coding/how-to-config-ant-design-in-next-js-with-custom-theme-b704022591af.

## Next.js + Ant Design Configurations
* `next.config.js`: without configuration get [error](https://github.com/vercel/next.js/issues/8150). See [config example](https://github.com/vercel/next.js/blob/canary/examples/with-ant-design-less/next.config.js).
* `.babelrc`

### Plugins Required
* [babel-plugin-import](https://www.npmjs.com/package/)
* less-vars-to-js
* null-loader

## Next.js + Less
https://github.com/vercel/next-plugins/tree/master/packages/next-less

## Bootstrap
Only using utitlity classes.

## Auth0
https://github.com/auth0/nextjs-auth0

## Stripe

### For reference
* [Stripe.js Reference](https://stripe.com/docs/js)
* [React Stripe.js reference](https://stripe.com/docs/stripe-js/react)
* [How Subscriptions Work](https://stripe.com/docs/billing/subscriptions/overview#how-payments-work-subscriptions)

### Examples
* [Create fixed-price subscriptions with Elements](https://stripe.com/docs/billing/subscriptions/fixed-price): Docs that show how to use React Stripe Elements with `subscription-use-cases` sample:
  * [stripe-samples / subscription-use-cases](https://github.com/stripe-samples/subscription-use-cases)

# PDFs

[Parameters for Opening PDF Files](https://www.adobe.com/content/dam/acom/en/devnet/acrobat/pdfs/pdf_open_parameters.pdf)

# Code Strandards

Default VS Code formatter: `Prettier - Code formatter`.
