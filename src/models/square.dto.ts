import { z } from 'zod'
import { Color } from '@/constant/color'
import { Piece } from '@/constant/piece'

/**
 * 駒
 */
export const SquareSchema = z.preprocess(
  // biome-ignore lint/suspicious/noExplicitAny: required for zod preprocess input typing
  (input: any) => {
    const { value, index } = input
    // if (value instanceof Square) return input
    if (value === undefined && index === undefined) return input
    const [x, y, color, is_promoted] = (value as string)
      .trim()
      .split('')
      .map((value: string) => Number.parseInt(value))
    if ([x, y, color, is_promoted].some((value) => Number.isNaN(value))) {
      throw new Error(`Invalid square value: ${value}`)
    }
    return {
      piece: (() => {
        if (index < 18) return Piece.FU
        if (index < 22) return Piece.KY
        if (index < 26) return Piece.KE
        if (index < 30) return Piece.GI
        if (index < 34) return Piece.KI
        if (index < 36) return Piece.HI
        if (index < 38) return Piece.KA
        return Piece.OU
      })(),
      color: color === 0 ? Color.BLACK : Color.WHITE,
      // x === 0 || y === 0 のときに強制的に持ち駒に変換する
      x: y === 0 ? 0 : x,
      y: x === 0 ? 0 : y,
      is_promoted: is_promoted === 2
    }
  },
  z
    .object({
      piece: z.nativeEnum(Piece),
      color: z.nativeEnum(Color),
      x: z.number(),
      y: z.number(),
      is_promoted: z.boolean()
    })
    .transform((v) => ({
      ...v,
      csa: (() => {
        const piece: Piece = !v.is_promoted
          ? v.piece
          : (() => {
              switch (v.piece) {
                case Piece.FU:
                  return Piece.TO
                case Piece.KY:
                  return Piece.NY
                case Piece.KE:
                  return Piece.NK
                case Piece.GI:
                  return Piece.NG
                case Piece.KA:
                  return Piece.UM
                case Piece.HI:
                  return Piece.RY
                default:
                  return v.piece
              }
            })()
        return `${v.color === Color.BLACK ? '+' : '-'}${piece}`
      })()
    }))
)
export type SquareSchema = z.infer<typeof SquareSchema>
