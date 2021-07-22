import { PersistedModel } from 'loopback';

module.exports = function (app: any) {
  const remotes = app.remotes();

  remotes.after('**', async (ctx: any) => {
    const ActiveLog = app.models.ActiveLog as typeof PersistedModel;
    const accountId = ctx.req.accessToken && ctx.req.accessToken.userId;
    if (accountId) {
      await ActiveLog.create({
        method: ctx.methodString,
        accessType: ctx.method.accessType,
        accountId: accountId,
      })
    }
  })
};
