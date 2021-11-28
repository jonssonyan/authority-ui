const path = require('path');

function resolve(dir) {
    path.join(__dirname, dir);
}

module.exports = {
    devServer: {
        proxy: {
            '/api': {
                target: `http://127.0.0.1:8888/authority`,
                changeOrigin: true,
                pathRewrite: {
                    '^/api': ''
                }
            }
        }
    },
    configureWebpack: {
        resolve: {
            extensions: ['js', 'vue'],
            alias: {
                '@': resolve('src')
            }
        }
    }
}
