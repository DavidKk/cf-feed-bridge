import { json } from '@/initializer/json'
import { fetchTasiCompaniesDaily } from '@/services/finance/tasi'

export const dailyRecords = json(async () => {
  const records = await fetchTasiCompaniesDaily()
  return records
})
