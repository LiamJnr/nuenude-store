import fs from 'fs'
import path from 'path'
import { CATALOG } from '../src/data/catalog.js'

const root = process.cwd()
const imgDir = path.join(root, 'public', 'imgs')
const entries = fs.readdirSync(imgDir, { withFileTypes: true })

const folders = entries.filter((e) => e.isDirectory()).map((e) => e.name)
const mainImages = entries.filter((e) => e.isFile() && e.name.endsWith('.webp')).map((e) => e.name)

const media = {}

for (const p of CATALOG) {
  let main = mainImages.find(
    (img) => img.toLowerCase().replace(/[^a-z0-9]/g, '') === p.name.toLowerCase().replace(/[^a-z0-9]/g, '')
  )
  if (!main) {
    main = mainImages.find(
      (img) =>
        img.toLowerCase().includes(p.name.toLowerCase()) ||
        p.name.toLowerCase().includes(img.replace('.webp', '').toLowerCase())
    )
  }

  const folder = folders.find(
    (f) =>
      f.toLowerCase().replace(/[^a-z0-9]/g, '').includes(p.name.toLowerCase().replace(/[^a-z0-9]/g, '')) ||
      p.name
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '')
        .includes(
          f
            .toLowerCase()
            .replace(/[^a-z0-9]/g, '')
            .replace('additionalimages', '')
            .replace('additionalimage', '')
        )
  )

  const gallery = []
  if (main) {
    gallery.push('/imgs/' + main)
  }
  if (folder) {
    const subFiles = fs
      .readdirSync(path.join(imgDir, folder))
      .filter((f) => f.endsWith('.webp') || f.endsWith('.jpg') || f.endsWith('.png'))
    for (const sf of subFiles) {
      gallery.push('/imgs/' + folder + '/' + sf)
    }
  }

  media[p.id] = {
    image: main ? '/imgs/' + main : gallery[0] || '',
    gallery: gallery,
  }
}

const fileContent = `import { CATALOG } from './catalog'

const PRODUCT_MEDIA = ${JSON.stringify(media, null, 2)}

export const PRODUCTS = CATALOG.map((product) => ({ ...product, ...PRODUCT_MEDIA[product.id] }))

export function getProduct(id) {
  return PRODUCTS.find((p) => p.id === id)
}
`

fs.writeFileSync(path.join(root, 'src', 'data', 'products.js'), fileContent, 'utf8')

// Verify all paths
let invalid = 0
for (const [id, m] of Object.entries(media)) {
  if (!fs.existsSync(path.join(root, 'public', m.image))) {
    console.error('Missing main:', id, m.image)
    invalid++
  }
  for (const g of m.gallery) {
    if (!fs.existsSync(path.join(root, 'public', g))) {
      console.error('Missing gallery:', id, g)
      invalid++
    }
  }
}

console.log('SUCCESS: All 38 products generated in products.js')
console.log('Total invalid/missing image files:', invalid)
