const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api/',
    createProxyMiddleware(
      '/api/',
      {
      target: 'ws://localhost:5000',
      ws:true,
      changeOrigin: false,
    })
  );
};