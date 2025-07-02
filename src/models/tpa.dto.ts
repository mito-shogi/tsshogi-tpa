import dayjs from 'dayjs'
import { chunk } from 'lodash'
import { importCSA, type Move, type Record, SpecialMoveType, Square } from 'tsshogi'
import { z } from 'zod'
import { Color } from '@/constant/color'
import { MetadataKey } from '@/constant/metadata'
import { BoardSchema } from './board.dto'
import { HandSchema } from './hand.dto'
import { MetadataSchema } from './metadata.dto'
import { MoveSchema } from './move.dto'
import { RecordSchema } from './record.dto'
import { SquareSchema } from './square.dto'

export const TPASchema = z.preprocess(
  // biome-ignore lint/suspicious/noExplicitAny: required for dynamic query parsing
  (query: any) => {
    return Object.fromEntries(
      new Map(
        decodeURIComponent(query as string)
          .split('&')
          .map((query) => query.split('='))
          .map(([key, value]) => [key, value])
      )
    )
  },
  z
    .object({
      d: z.coerce.number().int(),
      workid: z.coerce.number().int(),
      csv: z.string().nonempty(),
      hint: z.string().nonempty(),
      answercsv: z.string().nonempty(),
      title: z.string().nonempty(),
      authorname: z.string().nonempty(),
      progresscnt: z.coerce.number().int(),
      workupdate: z.string().transform((date) => dayjs(date, 'YYYY/MM/DD[HH:mm:ss]').toDate()),
      arrayFlg: z.coerce.number().optional(),
      point: z.coerce.number().int(),
      level: z.coerce.number().int()
    })
    .transform((v) => ({
      ...v,
      squares: v.csv
        .split('_')
        .filter((value) => value.length > 0)
        .map((value, index) => SquareSchema.parse({ value: value, index: index })),
      moves: (v.answercsv.includes('@')
        ? v.answercsv.split('_@')
        : chunk(
            v.answercsv
              .replace('_a', '_')
              .split('_')
              .filter((v) => v.length > 0),
            v.progresscnt
          ).map((v) => v.join('_'))
      )
        .map((v) => v.split('_').filter((v) => v.length > 0))
        .map((v) =>
          v.map((v) => {
            const [fromX, fromY, toX, toY, promote] = v
              .trim()
              .split('')
              .map((v) => Number.parseInt(v))
            if ([fromX, fromY, toX, toY, promote].some((v) => Number.isNaN(v))) {
              throw new Error(`Invalid move format: ${v}`)
            }
            return MoveSchema.parse({
              from: { x: fromX, y: fromY },
              to: { x: toX, y: toY },
              promote: promote === 1
            })
          })
        )
    }))
    .transform((v) => ({
      moves: v.moves,
      squares: v.squares,
      board: BoardSchema.parse({
        pieces: [1, 2, 3, 4, 5, 6, 7, 8, 9].map((y) =>
          [9, 8, 7, 6, 5, 4, 3, 2, 1].map((x) => v.squares.find((s) => s.x === x && s.y === y) || null)
        )
      }),
      hands: [Color.BLACK, Color.WHITE].map((color) =>
        HandSchema.parse({
          color,
          pieces: v.squares.filter((square) => square.color === color && square.x === 0 && square.y === 0)
        })
      ),
      metadata: [
        { key: MetadataKey.TITLE, value: v.title },
        { key: MetadataKey.AUTHOR, value: v.authorname },
        { key: MetadataKey.PUBLISHED_BY, value: '詰将棋パラダイス' },
        { key: MetadataKey.PUBLISHED_AT, value: dayjs(v.workupdate).format('YYYY/MM/DD') },
        { key: MetadataKey.LEVEL, value: v.level },
        { key: MetadataKey.POINT, value: v.point },
        { key: MetadataKey.LENGTH, value: v.progresscnt },
        { key: MetadataKey.OPUS_NAME, value: '詰将棋パラダイス' },
        { key: MetadataKey.OPUS_NO, value: v.workid }
      ].map((v) => MetadataSchema.parse(v))
    }))
    .transform((v) => ({
      record: (() => {
        const record = importCSA(
          RecordSchema.parse({
            metadata: v.metadata,
            squares: v.squares,
            hands: v.hands,
            board: v.board
          }).csa
        )
        if (record instanceof Error) {
          throw new Error(`Invalid CSA format: ${record.message}`)
        }
        for (const moves of v.moves) {
          record.goto(0)
          for (const move of moves) {
            const m: Move | null = record.position.createMove(move.square, new Square(move.to.x, move.to.y))
            if (m !== null) {
              m.promote = move.promote
              record.append(m)
            }
          }
          record.append(SpecialMoveType.RESIGN)
        }
        return record
      })()
    }))
)
export type TPASchema = z.infer<typeof TPASchema>

/**
 * TPA(詰将棋パラダイス)形式の棋譜を読み取ります。
 * @param data
 */
export function importTPA(data: string): Record | Error {
  return TPASchema.parse(data).record
}
