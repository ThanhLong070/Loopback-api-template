import { Account, Role } from '../../codegen/api/fetch/api';

export enum Roles {
  SUPERADMIN = 'SUPERADMIN',
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
  EMPLOYEE = 'EMPLOYEE',
  DIRECTOR = 'DIRECTOR',
  CHSTC = 'CHSTC',
  DRH = 'DRH',
  ECOUTE = 'ECOUTE'
}

export enum Rythems {
  Hebdo = 'Hebdo',
  Mensuel = 'Mensuel'
}

export class RoleUtils {
  static getRoles(account: Account & { roles: Role[] }): { [key: string]: boolean } {
    let roleMap: { [key: string]: boolean } = {};
    account.roles && account.roles.forEach(role => roleMap[role.name] = true);
    return roleMap;
  }
}
