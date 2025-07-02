import { PieceType, Square } from 'tsshogi'
import { z } from 'zod'

export const MoveSchema = z
  .object({
    from: z.object({
      x: z.number().int().min(0).max(9),
      y: z.number().int().min(0).max(9)
    }),
    to: z.object({
      x: z.number().int().min(0).max(9),
      y: z.number().int().min(0).max(9)
    }),
    promote: z.boolean()
  })
  .transform((v) => ({
    ...v,
    square: (() => {
      if (v.from.x === 0) {
        switch (v.from.y - 1) {
          case 0:
            return PieceType.PAWN
          case 1:
            return PieceType.LANCE
          case 2:
            return PieceType.KNIGHT
          case 3:
            return PieceType.SILVER
          case 4:
            return PieceType.GOLD
          case 5:
            return PieceType.ROOK
          case 6:
            return PieceType.BISHOP
          default:
            throw new Error(`Unexpected piece type: ${v.from.y}`)
        }
      }
      return new Square(v.from.x, v.from.y)
    })()
  }))
export type MoveSchema = z.infer<typeof MoveSchema>
