import { z } from 'zod'
import { Color } from '@/constant/color'
import { SquareSchema } from './square.dto'

/**
 * 持ち駒
 */
export const HandSchema = z
  .object({
    color: z.nativeEnum(Color),
    pieces: z.array(SquareSchema)
  })
  .transform((v) => ({
    ...v,
    csa: `P${v.color === Color.BLACK ? '+' : '-'}${v.pieces.map((s) => `00${s.piece}`).join('')}`
  }))
export type HandSchema = z.infer<typeof HandSchema>
