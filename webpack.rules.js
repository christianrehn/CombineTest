module.exports = [
    // Add support for native node modules
    {
        test: /\.node$/,
        use: 'node-loader',
    },
    {
        // We're specifying native_modules in the test because the asset
        // relocator loader generates a "fake" .node file which is really
        // a cjs file.
        test: /native_modules\/.+\.node$/,
        use: 'node-loader',
    },
    {
        test: /\.(m?js|node)$/,
        parser: {amd: false},
        use: {
            loader: '@vercel/webpack-asset-relocator-loader',
            options: {
                outputAssetBase: 'native_modules',
            },
        },
    },
    {
        test: /\.tsx?$/,
        exclude: /(node_modules|\.webpack)/,
        use: {
            loader: 'ts-loader',
            options: {
                transpileOnly: true
            }
        }
    },
    {
        test: /\.scss$/,
        exclude: /(node_modules|\.webpack)/,
        use: [
            {loader: 'style-loader'},
            {
                loader: 'css-loader',
                // options: {
                //     modules: true,
                // },
            },
            {loader: 'sass-loader'},
        ],
    },
    {
        test: /\.css$/,
        use: [{loader: 'style-loader'}, {loader: 'css-loader'}],
    },
    {
        test: /\.(svg|png)$/i,
        loader: 'url-loader',
    },
    {
        test: /\.(txt|csv)$/i,
        loader: 'file-loader',
        options: {},
    },
];
