module.exports = [
    // Add support for native node modules
    {
        test: /\.node$/,
        use: 'node-loader',
    },
    {
        test: /\.(m?js|node)$/,
        parser: {amd: false},
        use: {
            loader: '@marshallofsound/webpack-asset-relocator-loader',
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
        loaders: [
            "style-loader",
            "css-loader",
            // "postcss-loader",
            "sass-loader"
        ]
    },
    {
        test: /\.css$/,
        use: [{ loader: 'style-loader' }, { loader: 'css-loader' }],
    },
    // {
    //     test: /\.(png|jpe?g|gif|jp2|webp)$/,
    //     loader: 'file-loader',
    //     options: {
    //         name: '[name].[ext]',
    //     },
    // },
    {
        test: /\.(woff|ttf|eot|svg|png|jpg|jpeg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        include: /assets/,
        loader: 'url-loader',
    },
];
