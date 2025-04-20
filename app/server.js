const express = require('express');
const promClient = require('prom-client');

// Create Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Prometheus metrics registry
const collectDefaultMetrics = promClient.collectDefaultMetrics;
const Registry = promClient.Registry;
const register = new Registry();

// Collect default Node.js metrics
collectDefaultMetrics({ register });

// Create custom metrics
const httpRequestCounter = new promClient.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'endpoint', '
