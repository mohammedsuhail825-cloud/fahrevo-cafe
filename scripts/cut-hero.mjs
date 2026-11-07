import sharp from 'sharp'

// Cuts the tin out of the original photo using its shape, not its colours, so dark
// chocolate and gold can't turn into holes. Needs sharp: npm install --no-save sharp
// Usage: node scripts/cut-hero.mjs [output path]
const src = 'public/images/kinder-bueno.jpg'
const out = process.argv[2] || 'public/images/hero-cake.png'

// Tin outline, measured from the source photo (pixels)
const rim = { cx: 507, cy: 382.5, rx: 305, ry: 217.5 }
const wallLeft = y => 202 + (y - rim.cy) * 0.13
const wallRight = y => 812 - (y - rim.cy) * 0.121
// Bottom edge as [x, y]. The base isn't a true ellipse: the tin leans slightly in the photo.
const bottomEdge = [
  [224, 570], [230, 600], [250, 642], [270, 664], [290, 678], [310, 692], [330, 707],
  [350, 718], [370, 726], [390, 733], [410, 737], [430, 741], [450, 745], [470, 749],
  [490, 751], [510, 752], [530, 753], [550, 751], [570, 749], [590, 747], [610, 744],
  [630, 739], [650, 733], [670, 726], [690, 717], [710, 705], [730, 691], [750, 672],
  [770, 646], [785, 612], [792, 570],
]
const smoothing = 12 // px either side, keeps the measured curve free of bumps
const crop = { left: 153, top: 104, width: 709, height: 709 }
const samples = 4 // per axis, for anti-aliased edges

function edgeAt(x) {
  if (x <= bottomEdge[0][0]) return bottomEdge[0][1]
  for (let i = 1; i < bottomEdge.length; i++) {
    const [x1, y1] = bottomEdge[i]
    if (x <= x1) {
      const [x0, y0] = bottomEdge[i - 1]
      return y0 + ((x - x0) / (x1 - x0)) * (y1 - y0)
    }
  }
  return bottomEdge[bottomEdge.length - 1][1]
}

const bottomAt = new Float64Array(1024)
for (let x = 0; x < bottomAt.length; x++) {
  let sum = 0
  for (let d = -smoothing; d <= smoothing; d++) sum += edgeAt(x + d)
  bottomAt[x] = sum / (smoothing * 2 + 1)
}

function inTin(x, y) {
  if (y < rim.cy) return ((x - rim.cx) / rim.rx) ** 2 + ((y - rim.cy) / rim.ry) ** 2 <= 1
  return x >= wallLeft(y) && x <= wallRight(y) && y <= bottomAt[Math.floor(x)]
}

const { data, info } = await sharp(src)
  .extract(crop)
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true })

const { width, height, channels } = info
for (let py = 0; py < height; py++) {
  for (let px = 0; px < width; px++) {
    let hits = 0
    for (let sy = 0; sy < samples; sy++) {
      for (let sx = 0; sx < samples; sx++) {
        const x = crop.left + px + (sx + 0.5) / samples
        const y = crop.top + py + (sy + 0.5) / samples
        if (inTin(x, y)) hits++
      }
    }
    const i = (py * width + px) * channels
    data[i + 3] = Math.round((hits / samples ** 2) * 255)
    if (!hits) data.fill(0, i, i + 3) // hidden background compresses to nothing
  }
}

await sharp(data, { raw: { width, height, channels } })
  .png({ compressionLevel: 9 })
  .toFile(out)

console.log('wrote', out, width, height)
