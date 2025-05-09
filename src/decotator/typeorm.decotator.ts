import { UseFilters } from '@nestjs/common'
import { TypeormFilter } from '../filters/typeorm.filter'
export function TypeormDecorator() {
  return UseFilters(new TypeormFilter())
}
