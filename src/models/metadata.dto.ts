import { CustomMetadataKey } from '@/constant/metadata'
import { RecordMetadataKey } from 'tsshogi'
import { z } from 'zod'

/**
 * メタデータ
 */
export const MetadataSchema = z
  .object({
    key: z.union([z.nativeEnum(RecordMetadataKey), z.nativeEnum(CustomMetadataKey)]),
    value: z.union([z.string(), z.number()])
  })
  .transform((v) => ({
    ...v,
    csa: `${v.key}:${v.value}`
  }))

export type MetadataSchema = z.infer<typeof MetadataSchema>
