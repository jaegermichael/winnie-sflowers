/**
 * Winnie's Flowers - Asset Mapping
 * Real product images copied from the Desktop folder into /public/images.
 */

const IMG = (name: string) => `/images/${name}`;

// LOGOS
export const LOGO_MAIN = IMG("logo.jpeg");
export const LOGO_ALT = IMG("logo-card.jpeg");

// HERO
export const HERO_IMAGE = IMG("hero-red-box.jpeg");

// PRODUCT CATEGORIES (What We Offer)
export const CAT_FLOWER_BOUQUET = IMG("package-40-red-rose.jpeg");
export const CAT_MONEY_BOUQUET = IMG("package-25-money.jpeg");
export const CAT_CANDY_BOUQUET = IMG("package-20-candy.jpeg");
export const CAT_CHOCOLATE_BOUQUET = IMG("package-60-ferrero-box.jpeg");
export const CAT_COMBO_BOUQUET = IMG("package-90-combo.jpeg");
export const CAT_WEDDING = IMG("package-150-premium.jpeg");
export const CAT_FUNERAL = IMG("gallery-24.jpeg");

// POPULAR PICKS
export const PKG_ROMANTIC_ROSE = IMG("package-40-red-rose.jpeg");
export const PKG_CANDY_CHOCO = IMG("package-20-candy.jpeg");
export const PKG_MONEY_BOUQUET_PIC = IMG("package-25-money.jpeg");
export const PKG_BIRTHDAY_HAMPER_PIC = IMG("package-90-combo.jpeg");
export const PKG_WEDDING_PACKAGE_PIC = IMG("package-150-premium.jpeg");
export const PKG_CUSTOM_SURPRISE_PIC = IMG("package-60-ferrero-box.jpeg");

// LAYOUT ASSETS
export const IMG_ABOUT_1 = IMG("gallery-11.jpeg");
export const IMG_ABOUT_2 = IMG("gallery-18.jpeg");
export const IMG_WEDDING_1 = IMG("gallery-19.jpeg");
export const IMG_WEDDING_2 = IMG("package-150-premium.jpeg");
export const IMG_WEDDING_3 = IMG("gallery-24.jpeg");
export const IMG_WEDDING_4 = IMG("gallery-09.jpeg");

// FALLBACK
export const FALLBACK_BOUQUET = IMG("gallery-11.jpeg");

// GALLERY
export const GALLERY = [
  IMG("gallery-01.jpeg"),
  IMG("gallery-02.jpeg"),
  IMG("gallery-03.jpeg"),
  IMG("gallery-04.jpeg"),
  IMG("gallery-05.jpeg"),
  IMG("gallery-06.jpeg"),
  IMG("gallery-07.jpeg"),
  IMG("gallery-08.jpeg"),
  IMG("gallery-09.jpeg"),
  IMG("gallery-10.jpeg"),
  IMG("gallery-11.jpeg"),
  IMG("gallery-12.jpeg"),
  IMG("gallery-13.jpeg"),
  IMG("gallery-14.jpeg"),
  IMG("gallery-15.jpeg"),
  IMG("gallery-16.jpeg"),
  IMG("gallery-17.jpeg"),
  IMG("gallery-18.jpeg"),
  IMG("gallery-19.jpeg"),
  IMG("gallery-20.jpeg"),
  IMG("gallery-21.jpeg"),
  IMG("gallery-22.jpeg"),
  IMG("gallery-23.jpeg"),
  IMG("gallery-24.jpeg"),
  IMG("package-20-mini.jpeg"),
  IMG("package-60-ivory-rose.jpeg")
];
