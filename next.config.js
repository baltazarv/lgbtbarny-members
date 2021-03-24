const withPlugins = require('next-compose-plugins');
const withLess = require('@zeit/next-less');

// for antd less theme
const lessToJS = require('less-vars-to-js');
const fs = require('fs');
const path = require('path');

const withImages = require('next-images');;

// Where your antd-custom.less file lives
const themeVariables = lessToJS(
  fs.readFileSync(path.resolve(__dirname, './assets/antd-custom.less'), 'utf8')
);

const plugins = [

  withLess({
    lessLoaderOptions: {
      javascriptEnabled: true,
      modifyVars: themeVariables, // make your antd custom effective
    },
    webpack: (config, { isServer }) => {
      if (isServer) {
        const antStyles = /antd\/.*?\/style.*?/
        const origExternals = [...config.externals]
        config.externals = [
          (context, request, callback) => {
            if (request.match(antStyles)) return callback();
            if (typeof origExternals[0] === 'function') {
              origExternals[0](context, request, callback);
            } else {
              callback();
            }
          },
          ...(typeof origExternals[0] === 'function' ? [] : origExternals),
        ];

        // may be required to use sib-api-v3-sdk and avoid `Error Module not found`
        // config.module.rules.push({ parser: { amd: false } });

        config.module.rules.unshift({
          test: antStyles,
          use: 'null-loader',
        });
      }
      return config;
    },
  }),

  withImages,
];

module.exports = withPlugins(plugins); // nextConfig
