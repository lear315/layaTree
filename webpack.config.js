let path = require('path');

module.exports = {
    entry: {
        popup: path.resolve(__dirname, "./src/popup/main.js")
    },
    output: {
        path: path.resolve(__dirname, './dist'),
        publicPath: '/',
        filename: '[name].main.js'
    },
    module: {
        rules: [{
            test: /\.(less|css)$/,
            use: [
              'vue-style-loader',
              'css-loader'
            ],
        }]
    },
    
}