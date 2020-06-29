const path = require("path");

module.exports = {
    context: __dirname,
    entry: "./src/index.js",
    output: {
        filename: "main.js", 
        path: path.resolve(__dirname, './'),
    },
    devtool: "source-map",
    resolve: {
        extensions: [".js", "*"]
    }};