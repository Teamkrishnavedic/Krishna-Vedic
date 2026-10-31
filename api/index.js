// api/index.js - Vercel serverless entry point
// IMPORTANT: This must NOT call app.listen()
// Vercel routes incoming serverless requests through this exported Express app instance.

const appModule = require('../server/dist/app');
const app = appModule.default || appModule;

module.exports = app;
