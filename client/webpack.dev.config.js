const HTMLWebpackPlugin = require("html-webpack-plugin");

module.exports = {
    module: {
        rules:[
            {
                test: /\.js$/,
                except: /node_modules/,
                use: {
                    loader: "babel-loader",
                }
            }
        ]
    },
    plugins: [
        new HTMLWebpackPlugin({
            template: "./src/index.html",
            filename: "./dist/index.html",
            title: "Vendi",
        })
    ]
}