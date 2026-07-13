import { CONTRACT_ID } from '@/lib/config'
import { celenganMock } from '@/lib/celengan.mock'
import type { CelenganService } from '@/lib/types'

function select(): CelenganService {
  if (CONTRACT_ID === '') return celenganMock
  // generated contract bindings replace this branch once CONTRACT_ID is deployed
  return celenganMock
}

export const celengan: CelenganService = select()
