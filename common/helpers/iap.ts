import * as iap from 'in-app-purchase';
import * as path from 'path';

iap.config({
  /* Configurations for Apple */
  appleExcludeOldTransactions: true,
  applePassword: 'ff29d4cf89d14ab888fe3dc86b1e19ab',

  /* Configurations for Google Service Account validation: You can validate with just packageName, productId, and purchaseToken */
  // googlePublicKeyPath: path.resolve(__dirname, '/../../credentials/google-public') // this is the path to the directory containing iap-sanbox/iap-live files
  googlePublicKeyStrSandBox: 'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA4O6nBa9XiX4liFTdSxpLaodQw6u0wA/1R5I8FgFGuHS7ci+uw9vZ46ln0c/ts2vp1LL0q2MMEkPkQT9IZocLK+NUYWzi1I627d9uzkmAhoifJ7Bk7jb/f+Fel9d07TCDAn1MF0ZuCqetMNGVLRrCAQK6MTvBWamArll6E3TVJa9iognGZ3p/BjNGcOHGDNt8c+KFLxsXTPKqllbvc+uLYw7QPsnZRhJDW3L8LbiTx1QDpVJug5wDCym2UsDYJVZz17DxhgJ2PfIWw6ZxdsP3ce22pilp6GM3nCf5OfRK83gix6cEibDoXC8RMGpOKoggDWXCFG+HqwUTAvwRAr2zQwIDAQAB',
  // this is the google iap-sandbox public key string
  googlePublicKeyStrLive: 'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA4O6nBa9XiX4liFTdSxpLaodQw6u0wA/1R5I8FgFGuHS7ci+uw9vZ46ln0c/ts2vp1LL0q2MMEkPkQT9IZocLK+NUYWzi1I627d9uzkmAhoifJ7Bk7jb/f+Fel9d07TCDAn1MF0ZuCqetMNGVLRrCAQK6MTvBWamArll6E3TVJa9iognGZ3p/BjNGcOHGDNt8c+KFLxsXTPKqllbvc+uLYw7QPsnZRhJDW3L8LbiTx1QDpVJug5wDCym2UsDYJVZz17DxhgJ2PfIWw6ZxdsP3ce22pilp6GM3nCf5OfRK83gix6cEibDoXC8RMGpOKoggDWXCFG+HqwUTAvwRAr2zQwIDAQAB', // this is the google iap-live public key string
} as any);

console.log(path.join(__dirname, '/../../credentials/google-public'));

export { iap };
