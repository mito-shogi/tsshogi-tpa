import { describe, test } from 'bun:test'
import { doesNotThrow } from 'node:assert'
import { readdirSync, readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { exportKIF, type Record } from 'tsshogi'
import { TPASchema } from '../src/models/tpa.dto'

type Failure = {
  file: string
  error: Error
}

const __dirname = dirname(fileURLToPath(import.meta.url))
const dataDir = join(__dirname, 'data')

// Collect all *.txt files
const txtFiles = readdirSync(dataDir)
  .filter((f) => f.endsWith('.txt'))
  .sort((a, b) => a.localeCompare(b))

describe('Parse', () => {
  for (const fileName of txtFiles) {
    test(`File: ${fileName}`, () => {
      const content = readFileSync(join(dataDir, fileName), 'utf8')
      doesNotThrow(() => {
        const record: Record = TPASchema.parse(content).record
        console.log(exportKIF(record))
      })
    })
  }
})
