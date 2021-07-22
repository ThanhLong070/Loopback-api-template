import * as nodeSchedule from 'node-schedule';
import { PersistedModel } from 'loopback';

module.exports = async function notificationSchedule(app: any) {
    const OrganizationModel = app.models.Organization as typeof PersistedModel;
    const AccountModel = app.models.Account as typeof PersistedModel;
    const AccessTokenModel = app.models.AccountToken as typeof PersistedModel;

    //  every week on 23h59' Friday
    nodeSchedule.scheduleJob('59 59 23 * * 5', function () {
    });
    // sendPDF every month on 6h00 28th
    const rule = new nodeSchedule.RecurrenceRule();
    rule.month = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
    rule.date = 28;
    rule.hour = 6;
    rule.minute = 0;
    nodeSchedule.scheduleJob(rule, function () {
    });
};


