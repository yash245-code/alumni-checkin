const { join } = require('path');

/**
 * @type {import("puppeteer").Configuration}
 */
module.exports = {
  // Cache Chrome inside the project folder so Render preserves it at runtime
  cacheDirectory: join(__dirname, '.cache', 'puppeteer'),
};
