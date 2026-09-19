import { readFileSync } from 'node:fs'
import { join, resolve } from 'node:path'
import sharp from 'sharp'

const root = resolve(process.cwd())
const publicDir = join(root, 'public')
const svgPath = join(publicDir, 'favicon.svg')
const svgBuffer = readFileSync(svgPath)

const targets = [
  { name: 'pwa-192x192.png', size: 192 },
  { name: 'pwa-512x512.png', size: 512 },
  { name: 'apple-touch-icon.png', size: 180 },
]

for (const target of targets) {
  const out = join(publicDir, target.name)
  await sharp(svgBuffer).resize(target.size, target.size).png().toFile(out)
  console.log(`Generated ${target.name} (${target.size}x${target.size})`)
}