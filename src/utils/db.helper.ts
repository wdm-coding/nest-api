import { ObjectLiteral, SelectQueryBuilder } from 'typeorm'

export const conditionUtils = <T extends ObjectLiteral>(
  queryBuilder: SelectQueryBuilder<T>,
  record: Record<string, unknown>
) => {
  Object.keys(record).forEach(key => {
    if (record[key]) {
      queryBuilder.andWhere(`${key} = :${key}`, { [key]: record[key] })
    }
  })
  return queryBuilder
}
