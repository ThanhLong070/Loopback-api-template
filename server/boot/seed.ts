import * as _ from 'lodash';
import { PersistedModel } from 'loopback';
import { Account } from '../../codegen/api/fetch/api';


module.exports = function (app: any) {
    async function automigrate(model: string): Promise<typeof PersistedModel> {
        return new Promise<typeof PersistedModel>((resolve, reject) => {
            app.dataSources.mysql.automigrate(model, function (err: Error) {
                if (err) {
                    return reject(err);
                }
                resolve(app.models[model]);
            });
        });
    }

    async function autoupdate(model: string): Promise<typeof PersistedModel> {
        return new Promise<typeof PersistedModel>((resolve, reject) => {
            app.dataSources.mysql.autoupdate(model, function (err: Error) {
                if (err) {
                    return reject(err);
                }
                resolve(app.models[model]);
            });
        });
    }

    (async () => {
        const [
            Application,
            Notification,
            ACL,
            RoleMapping,
            Role,
            Account,
            ActiveLog,
            Example
        ] = await Promise.all(_.map([
            'Application',
            'Notification',
            'ACL',
            'RoleMapping',
            'Role',
            'Account',
            'ActiveLog',
            'Example'

        ], process.env.NODE_ENV === 'production' ? autoupdate : automigrate));

        const [
            Installation,
            AccountToken
        ] = await Promise.all(_.map([
            'Installation',
            'AccountToken'
        ], autoupdate));

        if (process.env.NODE_ENV === 'production') {
            return;
        }

        const application = {
            id: 'link.bfast.weeep',
            userId: 'linktohack',
            name: 'Weeep App',
            description: 'Weeep Application',
            pushSettings: {
                apns: {
                    token: {
                        keyId: '93VL5JJY64',
                        key: './server/credentials/AuthKey_93VL5JJY64.p8',
                        teamId: 'A6HH75QWMS'
                    },
                    bundle: 'link.bfast.weeep',
                    production: false
                },
                gcm: {
                    serverApiKey: 'AAAA4_sxhyo:APA91bEMiJns_110_x93NrwbSiYJiPIv8kJRrBcv8E0hZdbgzUnGiSiA3_KIR2injPFXyRn9b27Wz1p7yzkYpv9MzbwuN0EL9d-c2mss-yIWyzN4zYu1cuflqiXrUmAtNHCPDGfN7BJW'
                }
            }
        };

        (Application as any).observe('before save', function (context: any, next: Function) {
            if (context.instance && context.instance.name === application.name) {
                context.instance.id = application.id;
            }
            next();
        });

        await (Application as any).register(application.userId, application.name, {
            description: application.description,
            pushSettings: application.pushSettings
        });

        console.log('Start seeding ...');

        const roles = [
            { name: 'SUPERADMIN' },
            { name: 'ADMIN' },
            { name: 'MANAGER' },
            { name: 'EMPLOYEE' },
            { name: 'DRH' },
            { name: 'CHSTC' },
            { name: 'DIRECTEUR' }
        ];
        for (let role of roles) {
            await Role.create(role);
        }

        const accounts: Account[] = [
            {
                // id: 1,
                username: 'superadmin',
                password: 'test',
                nom: 'Super',
                prenom: 'Admin',
                sex: 'male',
                email: 'superadmin@ql6625.fr',
                fonction: 'Super admin'
            },
            {
                // id: 2,
                username: 'admin',
                password: 'test',
                nom: 'Nguyen',
                prenom: 'Admin',
                sex: 'male',
                email: 'admin@ql6625.fr',
                fonction: 'Admin'
            },
            {
                // id: 3,
                username: 'hoangnv',
                password: 'test',
                nom: 'Nguyen',
                prenom: 'Hoang',
                sex: 'male',
                email: 'hoangnv@ql6625.fr',
                fonction: 'Fullstack engineer'
            },
            {
                // id: 4,
                username: 'tannt',
                password: 'test',
                nom: 'Nguyen',
                prenom: 'Tan',
                sex: 'male',
                email: 'tannt@ql6625.fr',
                fonction: 'Fullstack engineer'

            },
            {
                // id: 5,
                username: 'haivm',
                password: 'test',
                nom: 'VM',
                prenom: 'Hai',
                sex: 'male',
                email: 'haivm@ql6625.fr',
                fonction: 'Manager'
            },
            {
                // id: 6,
                username: 'anhnp',
                password: 'test',
                nom: 'Nguyen Phuong',
                prenom: 'Anh',
                sex: 'female',
                email: 'anhnp@ql6625.fr',
                fonction: 'HR'
            },
            {
                // id: 7,
                username: 'longnt',
                password: 'test',
                nom: 'NT',
                prenom: 'Long',
                sex: 'male',
                email: 'longnt@ql6625.fr',
                fonction: 'Ios engineer'
            },
            {
                // id: 8,
                username: 'longbt',
                password: 'test',
                nom: 'BT',
                prenom: 'Long',
                sex: 'male',
                email: 'longbt@ql6625.fr',
                fonction: 'Android engineer'
            },
            {
                // id: 9,
                username: 'nghipn',
                password: 'test',
                nom: 'PN',
                prenom: 'Nghi',
                sex: 'male',
                email: 'nghipn@ql6625.fr',
                fonction: 'Android engineer'
            },
            {
                // id: 10,
                username: 'tunt',
                password: 'test',
                nom: 'NT',
                prenom: 'Tu',
                sex: 'male',
                email: 'tunt@ql6625.fr',
                fonction: 'Android engineer'
            },
            {
                // id: 11,
                username: 'linhlq',
                password: 'test',
                nom: 'Linh',
                prenom: 'Le Quang',
                sex: 'male',
                email: 'linhlq@ql6625.fr',
                fonction: 'Boss'
            },
            {
                // id: 12,
                username: 'rh',
                password: 'test',
                nom: 'rh',
                prenom: 'rh',
                sex: 'male',
                email: 'rh@ql6625.fr',
                fonction: 'RH'
            },
            {
                // id: 13,
                username: 'chsct',
                password: 'test',
                nom: 'chsct',
                prenom: 'chsct',
                sex: 'male',
                email: 'chsct@ql6625.fr',
                fonction: 'CHSCT'
            },
            {
                // id: 14,
                username: 'director',
                password: 'test',
                nom: 'director',
                prenom: 'director',
                sex: 'male',
                email: 'director@ql6625.fr',
                fonction: 'DIRECTOR'
            }
        ];
        for (let account of accounts) {
            await Account.create(account);
        }

        const roleMappings = [
            { principalType: (RoleMapping as any).USER, principalId: 1, roleId: 1 },
            { principalType: (RoleMapping as any).USER, principalId: 2, roleId: 2 },
            { principalType: (RoleMapping as any).USER, principalId: 3, roleId: 4 },
            { principalType: (RoleMapping as any).USER, principalId: 4, roleId: 4 },
            { principalType: (RoleMapping as any).USER, principalId: 5, roleId: 3 },
            { principalType: (RoleMapping as any).USER, principalId: 6, roleId: 3 },
            { principalType: (RoleMapping as any).USER, principalId: 7, roleId: 4 },
            { principalType: (RoleMapping as any).USER, principalId: 8, roleId: 4 },
            { principalType: (RoleMapping as any).USER, principalId: 9, roleId: 4 },
            { principalType: (RoleMapping as any).USER, principalId: 10, roleId: 4 },
            { principalType: (RoleMapping as any).USER, principalId: 11, roleId: 3 },
            { principalType: (RoleMapping as any).USER, principalId: 12, roleId: 5 },
            { principalType: (RoleMapping as any).USER, principalId: 13, roleId: 6 },
            { principalType: (RoleMapping as any).USER, principalId: 14, roleId: 7 }
        ];
        for (let roleMapping of roleMappings) {
            await RoleMapping.create(roleMapping);
        }
        console.log('done seeding');
    })().catch(error => {
        console.error('error seeding ', error);
    });
};
