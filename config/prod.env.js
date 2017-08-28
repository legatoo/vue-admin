
var webpack = require('webpack');

module.exports = {
    NODE_ENV: '"production"',
    API_ROOT: '"https://dayanghome.com"',
    plugins: [
        // ...
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: '"production"'
            }
        }),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        })
    ]
};
