import sharp from 'sharp'

const src = 'public/images/hero-product.jpg'
const meta = await sharp(src).metadata()
const w = meta.width
const h = meta.height

// Keep the right product composition (cake + props), drop baked-in UI text/nav
const left = Math.round(w * 0.38)
await sharp(src)
  .extract({
    left,
    top: 0,
    width: w - left,
    height: h,
  })
  .jpeg({ quality: 92 })
  .toFile('public/images/hero-cake.jpg')

console.log('cropped', w, h, '->', w - left, h)
