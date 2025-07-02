import { afterAll, describe, test } from 'bun:test'
import { doesNotThrow } from 'node:assert'
import { readdirSync, readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
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
const failures: Failure[] = []

describe('Parse', () => {
  afterAll(() => {
    for (const failure of failures) {
      console.error(`Failed ${failure.file}: ${failure.error.message}`)
    }
  })

  for (const fileName of txtFiles) {
    test(`File: ${fileName}`, () => {
      const content = readFileSync(join(dataDir, fileName), 'utf8')
      try {
        doesNotThrow(() => TPASchema.parse(content))
      } catch (error) {
        failures.push({ file: fileName, error: error as Error })
        throw error
      }
    })
  }
})
