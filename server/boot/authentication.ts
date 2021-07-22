import * as loopback from 'loopback';

module.exports = function enableAuthentication(app: any) {
  // enable authentication
  app.use(loopback.token({
    model: app.models.AccountToken
  }));
  app.enableAuth();
};
