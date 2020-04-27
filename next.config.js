const withPlugins = require('next-compose-plugins');
const withLess = require('@zeit/next-less');
const withImages = require('next-images');;
// const withSass = require('@zeit/next-sass');

// for antd less theme
const lessToJS = require('less-vars-to-js');
const fs = require('fs')
const path = require('path')

// Where your antd-custom.less file lives
const themeVariables = lessToJS(
  fs.readFileSync(path.resolve(__dirname, './assets/antd-custom.less'), 'utf8')
);

// const nextConfig = {
//   // config settings
// };

const plugins = [

  withLess({
    lessLoaderOptions: {
      javascriptEnabled: true,
      modifyVars: themeVariables, // make your antd custom effective
    },
    webpack: (config) => {
      if (typeof require !== 'undefined') {
        require.extensions['.less'] = file => {}
      }
      return config;
    },
  }),

  withImages,
];

module.exports = withPlugins(plugins); // nextConfig
