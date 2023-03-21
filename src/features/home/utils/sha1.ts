import * as crypto from 'crypto'

export default function sha1(rawInput?: string): string {
  const hash = crypto.createHash('sha1')
  const sss = crypto.randomBytes(20).toString('hex')
  const input = rawInput ? rawInput : sss
  hash.update(input)
  return hash.digest('hex')
}