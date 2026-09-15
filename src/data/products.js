import { CATALOG } from './catalog'

const PRODUCT_MEDIA = {
  'after-midnight': {
    image: '/imgs/After Midnight Embroidered Sheer 3 Piece Set.webp',
    gallery: ['/imgs/After Midnight Embroidered Sheer 3 Piece Set.webp', '/imgs/After Midnight Embroidered Additional Images/05-29-26_S3_12_LI1038_BlackBlue_ZSR_LB_JS_11-40-31_PLUS_0400_PXF.webp'],
  },
  'all-for-you': {
    image: '/imgs/All For You Satin Longline Open Cup 2 Piece.webp',
    gallery: ['/imgs/All For You Satin Longline Open Cup 2 Piece.webp', '/imgs/All For You Satin Longline Additional Images/11201FNL_Black_JR_V2.webp'],
  },
  amara: {
    image: '/imgs/Amara Mesh Embroidered 3 Piece Set.webp',
    gallery: ['/imgs/Amara Mesh Embroidered 3 Piece Set.webp', '/imgs/Amara Mesh Embroidered 3 Piece Set Additional Image/03-16-26_S9PM_45_ZDFNL1280_Fuchsia_ZSR_LR_DR_19-38-21_0725_PXF.webp'],
  },
  'bare-secrets': {
    image: '/imgs/Bare Secrets Crotchless Open Cup Lace.webp',
    gallery: ['/imgs/Bare Secrets Crotchless Open Cup Lace.webp', '/imgs/Bare Secrets Crotchless Open Cup Lace Additional Images/JEN115_Black_JR_V2.webp'],
  },
  daria: {
    image: '/imgs/Daria Mesh Embroidered 3 Piece Bra and Panty.webp',
    gallery: ['/imgs/Daria Mesh Embroidered 3 Piece Bra and Panty.webp', '/imgs/Daria Mesh Embroidered 3 Piece Bra and Panty Additional Images/05-05-26_S6_6_ZDFT006_Whitecombo_ZSR_AE_AA_10-51-07_14892_PXF.webp'],
  },
  lilliana: {
    image: '/imgs/Lilliana Mesh Embroidered 2 Piece Set.webp',
    gallery: ['/imgs/Lilliana Mesh Embroidered 2 Piece Set.webp', '/imgs/Lilliana Mesh Embroidered 2 Piece Set Additional Images/06-01-26_S4_29_ZDFKP1222018_Black_ZSR_AB_RL_14-16-19_28955_PXF.webp'],
  },
}

export const PRODUCTS = CATALOG.map((product) => ({ ...product, ...PRODUCT_MEDIA[product.id] }))

export function getProduct(id) {
  return PRODUCTS.find((p) => p.id === id)
}
