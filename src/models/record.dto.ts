import { z } from 'zod'
import { BoardSchema } from './board.dto'
import { HandSchema } from './hand.dto'
import { MetadataSchema } from './metadata.dto'
import { SquareSchema } from './square.dto'

export const RecordSchema = z
  .object({
    metadata: z.array(MetadataSchema),
    squares: z.array(SquareSchema).min(39).max(40),
    hands: z.array(HandSchema),
    board: BoardSchema
  })
  .transform((v) => ({
    ...v,
    csa: [
      v.metadata.map((metadata) => metadata.csa).join('\n'),
      v.board.csa,
      v.hands.map((hand) => hand.csa).join('\n'),
      '+'
    ].join('\n')
  }))
export type RecordSchema = z.infer<typeof RecordSchema>
