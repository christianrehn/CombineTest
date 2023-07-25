const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

const {IgnorePlugin} = require('webpack');

const optionalPlugins = [];
if (process.platform !== "darwin") { // don't ignore on OSX
    optionalPlugins.push(new IgnorePlugin({resourceRegExp: /^fsevents$/}));
}

module.exports = [
    new ForkTsCheckerWebpackPlugin(),
    ...optionalPlugins,
];
