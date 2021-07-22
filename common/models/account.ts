import { RoleMapping, User } from 'loopback';
import { EMAIL_FROM, sendCreateAccount, sendMdpPerdu } from '../helpers/sendMail';
import * as path from 'path';
import { Account } from '../../codegen/api/fetch/api';
import { Roles } from '../utils/role-utils';
import { HttpContext, PersistedModelStatic, PersistedModel } from '../helpers/loopback';

module.exports = function (Account: PersistedModelStatic<Account>) {
  Account.beforeRemote('**', async (ctx: HttpContext<Account>) => {
    console.log(ctx);
    console.log(ctx.methodString)
  });

  const searchExistUserBeforeLogin = async (ctx: HttpContext<Account>) => {
    const email = ctx.args.credentials.email;
    const username = ctx.args.credentials.username;
    const user: Account | null = await Account.findOne({
      where: {
        or: [
          {
            email: email
          },
          {
            username: username
          }
        ]
      }
    });

    if (!user) {
      throw Error('Votre compte n\'existe pas');
    }

    if (user.status === 'DEACTIVATE') {
      throw Error('Votre compte a été supprimé');
    }
  };

  const checkExistEmailBeforePatchAttributes = async (ctx: HttpContext<Account>) => {
    if (!ctx.args.data.id) {
      return;
    }
    const oldAccount = await Account.findById(ctx.args.data.id, {});
    const newAccount = await Account.findOne({
      where: {
        email: ctx.args.data.email
      }
    });
    if (oldAccount && oldAccount.email !== ctx.args.data.email) {
      if (newAccount) {
        throw Error('Email has existed');
      }
      (ctx as any).newEmail = ctx.args.data.email;
    }
  };

  const sendVerificationEmailAfterPatchAttributes = async (ctx: HttpContext<Account>, account: PersistedModel<Account> | undefined ) => {
    await afterUpsert(ctx, account);
    const currentUserId = ctx.req.accessToken && ctx.req.accessToken.userId || 0 ;
    if ((ctx as any).newEmail) {
      const options = {
        type: 'email',
        to: account && account.email,
        from: EMAIL_FROM,
        subject: 'Bienvenue sur Mobilisation .',
        host: 'api.mobilisation.ql6625.fr',
        protocol: 'https',
        port: 443,
        template: path.resolve(__dirname, '../../common/helpers/emailTemplates/verify.ejs'),
        redirect: '/activeAccount.html',
        user: account
      };

      const currentAccount: any = await Account.findById(currentUserId, {
        include: [
          'roles'
        ]
      });
      if (!currentAccount || !currentAccount.__data || !currentAccount.__data.roles[0]) {
        return;
      }
      if (currentAccount.__data.roles[0].name === Roles.SUPERADMIN || currentAccount.__data.roles[0].name === Roles.ADMIN) {
        await Account.upsert({
          id: account && account.id,
          emailVerified: 1
        } as any);
        return;
      } else {
        await (account as any).verify(options as any);
      }
    }
  };

  const afterUpsert = async (ctx: HttpContext<Account>, account: PersistedModel<Account> | undefined) => {
    if (ctx.args.data.roles && ctx.args.data.roles.length > 0) {
      await RoleMapping.destroyAll({
        principalType: 'USER',
        principalId: account && account.id
      });
      await RoleMapping.create(
          ctx.args.data.roles.map((role: any) => {
            return {
              principalType: 'USER',
              principalId: account && account.id,
              roleId: role.id
            };
          })
      );
    }
  };

  Account.beforeRemote('login', searchExistUserBeforeLogin);
  Account.beforeRemote('prototype.patchAttributes', checkExistEmailBeforePatchAttributes);
  Account.afterRemote('prototype.patchAttributes', sendVerificationEmailAfterPatchAttributes);

  (Account as any).on('resetPasswordRequest', async (info: any) => {
    const Email = Account.app.models.Email;

    await sendMdpPerdu(Email, info);
  });

  Account.beforeRemote('create', async (ctx: any) => {
    ctx.accountToCreate = ctx.args.data;
  });

  Account.afterRemote('create', async (ctx: any, account: PersistedModel<Account> | undefined) => {
    const Email = (Account as any).app.models.Email;
    await afterUpsert(ctx, account);
    const currentUserId = ctx.req.accessToken.userId;
    await checkUser(currentUserId, account, ctx);

  });

  Account.beforeRemote('upsertWithWhere', async (ctx: HttpContext<Account>, account: PersistedModel<Account> | undefined) => {
    (ctx as any).accountToCreate = ctx.args.data;
  });

  Account.afterRemote('upsertWithWhere', async (ctx: HttpContext<Account>, account: PersistedModel<Account> | undefined) => {
    const Email = Account.app.models.Email;
    const currentUserId = ctx.req.accessToken && ctx.req.accessToken.userId || 0;

    await checkUser(currentUserId, account, ctx)
      .catch((error => {
        console.log(error);
      }));

    // sendCreateAccount(Email, ctx.accountToCreate);
  });

  async function checkUser(currentUserId: number, createAccount: any, ctx: any) {
    const Email = (Account as any).app.models.Email;
    // send email activation
    const options = {
      type: 'email',
      to: createAccount.email,
      from: EMAIL_FROM,
      subject: 'Bienvenue sur BFast-System .',
      host: 'api.bfast-system.ql6625.fr',
      protocol: 'https',
      port: 443,
      template: path.resolve(__dirname, '../../common/helpers/emailTemplates/verify.ejs'),
      redirect: '/activeAccount.html',
      user: createAccount
    };
    const currentAccount: any = await Account.findById(currentUserId, {
      include: [
        'roles'
      ]
    });
    if (!currentAccount || !currentAccount.__data || !currentAccount.__data.roles[0]) {
      return;
    }
    // if (currentAccount.__data.roles[0].name === Roles.SUPERADMIN || currentAccount.__data.roles[0].name === Roles.ADMIN) {
    //   await Account.upsert({
    //     id: createAccount.id,
    //     emailVerified: 1
    //   });
    // } else {
    //   await createAccount.verify(options as any);
    // }
    sendCreateAccount(Email, ctx.accountToCreate);
  }
};
