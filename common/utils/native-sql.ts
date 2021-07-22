export async function executeNativeSql(connector: any, sql: string, params: any[]): Promise<any> {
  return new Promise((resolve, reject) => {
    connector.execute(sql, params, function (error: Error, rows: []) {
      if (error) {
        reject(error);
      } else {
        resolve(rows);
      }
    })
  }).catch(error => {
    console.error(error);
  });
}

export async function getChildServices(connector: any, serviceId: number): Promise<any> {
  return executeNativeSql(
    connector,
      `select group_concat(lv separator ',') as ids
from (select @pv :=
             (select group_concat(id SEPARATOR ',') from Service where find_in_set(parentId, @pv)) as lv
      from Service
             join (select @pv := ?) tmp) a`,
    [serviceId]);
}

