import { z } from 'zod'
import { SquareSchema } from './square.dto'

export const BoardSchema = z
  .object({
    pieces: z.array(z.array(SquareSchema.nullable()).length(9)).length(9)
  })
  .transform((v) => ({
    ...v,
    csa: v.pieces.map((line, index) => `P${index + 1}${line.map((piece) => piece?.csa || ' * ').join('')}`).join('\n')
  }))
export type BoardSchema = z.infer<typeof BoardSchema>
