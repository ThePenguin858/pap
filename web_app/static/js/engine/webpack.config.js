const path = require('path');
module.exports = {
    entry: "./src/app.ts",
    devtool: "inline-source-map",
    output: {
        filename: "bundle.js",
        path: path.resolve(__dirname, 'dist'),
    },
    resolve: {
        extensions: [".ts"]
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                loader: 'ts-loader',
                include: [
                    path.resolve(__dirname, 'src/')
                ],
                exclude: [
                    path.resolve(__dirname, '/node_modules/')
                ]
	        }
	    ]
    }};
