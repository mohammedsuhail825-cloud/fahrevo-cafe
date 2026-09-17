import sharp from 'sharp'

const src = 'public/images/kinder-bueno.jpg'
const out = 'public/images/kinder-bueno-hero.jpg'
const size = 1000
const cream = [247, 242, 232]

const { data, info } = await sharp(src)
  .resize(size, size, { fit: 'cover', position: 'centre' })
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true })

const { width, height, channels } = info
const cx = width * 0.5
const cy = height * 0.52
const maxR = Math.min(width, height) * 0.47

function backdropAmount(r, g, b) {
  // Pure / saturated reds only — not chocolate browns
  const redDom = r - Math.max(g, b)
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const sat = max === 0 ? 0 : (max - min) / max

  // Bright studio red
  if (r > 120 && g < r * 0.5 && b < r * 0.5 && redDom > 40 && sat > 0.35) {
    return Math.min(1, 0.7 + redDom / 100)
  }
  // Deep maroon backdrop (very little green/blue)
  if (r > 40 && g < 22 && b < 22 && redDom > 30 && g < r * 0.35) {
    return 0.98
  }
  // Mid reds with almost no brown warmth
  if (r > 90 && g < 50 && b < 45 && redDom > 45 && sat > 0.4) {
    return 0.95
  }
  return 0
}

for (let y = 0; y < height; y++) {
  for (let x = 0; x < width; x++) {
    const i = (y * width + x) * channels
    const r = data[i]
    const g = data[i + 1]
    const b = data[i + 2]

    const dx = (x - cx) / maxR
    const dy = (y - cy) / maxR
    const d = Math.sqrt(dx * dx + dy * dy)

    let replace = 0

    // Soft falloff outside the product circle
    if (d >= 1) replace = 1
    else if (d > 0.82) replace = (d - 0.82) / 0.18

    const red = backdropAmount(r, g, b)
    if (red > 0) {
      // Protect the product core — only clear clear red there
      if (d < 0.58) replace = Math.max(replace, red * 0.35)
      else replace = Math.max(replace, red)
    }

    replace = Math.min(1, Math.max(0, replace))
    replace = replace * replace * (3 - 2 * replace)

    if (replace > 0) {
      data[i] = Math.round(r * (1 - replace) + cream[0] * replace)
      data[i + 1] = Math.round(g * (1 - replace) + cream[1] * replace)
      data[i + 2] = Math.round(b * (1 - replace) + cream[2] * replace)
    }
    data[i + 3] = 255
  }
}

await sharp(data, { raw: { width, height, channels } })
  .modulate({ brightness: 1.02, saturation: 0.98 })
  .jpeg({ quality: 93 })
  .toFile(out)

const check = await sharp(out).raw().toBuffer({ resolveWithObject: true })
const s = (x, y) => {
  const i = (y * check.info.width + x) * check.info.channels
  return [check.data[i], check.data[i + 1], check.data[i + 2]]
}
console.log({
  tl: s(5, 5),
  midEdge: s(Math.floor(size / 2), 20),
  tinSide: s(Math.floor(size * 0.28), Math.floor(size * 0.55)),
  topCenter: s(Math.floor(size / 2), Math.floor(size * 0.42)),
})
