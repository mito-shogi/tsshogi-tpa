import { z } from 'zod'
import { MetadataKey } from '@/constant/metadata'

/**
 * メタデータ
 */
export const MetadataSchema = z
  .object({
    key: z.nativeEnum(MetadataKey),
    value: z.union([z.string(), z.number()])
  })
  .transform((v) => ({
    ...v,
    csa: `${v.key}:${v.value}`
  }))

export type MetadataSchema = z.infer<typeof MetadataSchema>
