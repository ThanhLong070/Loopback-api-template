import { PersistedModelStatic, Where } from './loopback';
import { Installation, Notification } from '../../codegen/api/fetch/api';

export async function notifyByQuery(Push: any, where: Where<Installation>, notification: PersistedModelStatic<Notification>): Promise<undefined> {
  return new Promise<any>((resolve, reject) => {
    Push.notifyByQuery(where, notification, (err: any) => {
      if (err) {
        return reject(err);
      }
      resolve(undefined);
    });
  });
}
