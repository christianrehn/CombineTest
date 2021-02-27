module.exports = {
    module: {
        rules: require('./webpack.rules'),
    },
    plugins: require('./webpack.plugins'),
    resolve: {
        extensions: ['.js', '.ts', '.jsx', '.tsx', '.css']
    },
};
