import {
  Flower,
  Gift,
  Heart,
  Candy,
  CircleDollarSign,
  Star,
  Smartphone,
  Camera
} from 'lucide-react';

import {
  CAT_FLOWER_BOUQUET,
  CAT_MONEY_BOUQUET,
  CAT_CANDY_BOUQUET,
  CAT_CHOCOLATE_BOUQUET,
  CAT_COMBO_BOUQUET,
  CAT_WEDDING,
  CAT_FUNERAL,
  PKG_ROMANTIC_ROSE,
  PKG_CANDY_CHOCO,
  PKG_MONEY_BOUQUET_PIC,
  PKG_BIRTHDAY_HAMPER_PIC,
  PKG_WEDDING_PACKAGE_PIC,
  PKG_CUSTOM_SURPRISE_PIC,
  GALLERY
} from './assets';

export const BUSINESS_NAME = "Winnie's Flowers";
export const PHONE_NUMBER = "+263772349508";
export const ADDRESS = "Nola Building Basement, Between 8th & 9th Avenue, Bulawayo (Next to Booties Pharmacy)";

export const CATEGORIES = [
  {
    title: "Flower Bouquets",
    description: "Fresh rose bouquets in red, pink, white, and mixed wraps, with options from everyday gifts to premium arrangements.",
    icon: Flower,
    image: CAT_FLOWER_BOUQUET,
  },
  {
    title: "Money Bouquets",
    description: "Creative cash bouquets paired with roses and baby's breath for standout birthday and celebration surprises.",
    icon: CircleDollarSign,
    image: CAT_MONEY_BOUQUET,
  },
  {
    title: "Candy Bouquets",
    description: "Sweet candy bundles with wrapped chocolates and snack favorites, ideal for quick gifts from $20.",
    icon: Candy,
    image: CAT_CANDY_BOUQUET,
  },
  {
    title: "Chocolate Bouquets",
    description: "Ferrero Rocher and rose arrangements in hat boxes or wrapped bouquets, available in several sizes.",
    icon: Gift,
    image: CAT_CHOCOLATE_BOUQUET,
  },
  {
    title: "Custom Combo Bouquets",
    description: "Mixed flowers, chocolates, money, candy, and keepsakes combined into a single statement package.",
    icon: Heart,
    image: CAT_COMBO_BOUQUET,
  },
  {
    title: "Wedding Flowers",
    description: "Premium bridal-style bouquets and event flowers for weddings, introductions, and special ceremonies.",
    icon: Camera,
    image: CAT_WEDDING,
  },
  {
    title: "Funeral Flowers",
    description: "Respectful white and red tribute bouquets arranged with care for memorial and sympathy moments.",
    icon: Star,
    image: CAT_FUNERAL,
  }
];

export const POPULAR_PACKAGES = [
  {
    id: "p1",
    name: "Signature Red Rose Bouquet",
    category: "Flower Bouquets",
    description: "Full red rose bouquet wrapped with baby's breath and premium paper.",
    price: "$40",
    image: PKG_ROMANTIC_ROSE
  },
  {
    id: "p2",
    name: "Candy Bouquet",
    category: "Candy Bouquets",
    description: "Wrapped candy and chocolate bar bouquet for a simple, sweet surprise.",
    price: "$20",
    image: PKG_CANDY_CHOCO
  },
  {
    id: "p3",
    name: "Money Rose Bouquet",
    category: "Money Bouquets",
    description: "Red roses surrounded by folded notes for a memorable celebration gift.",
    price: "$25",
    image: PKG_MONEY_BOUQUET_PIC
  },
  {
    id: "p4",
    name: "Combo Gift Package",
    category: "Custom Combo Bouquets",
    description: "A coordinated combo with roses, money styling, and a matching gift box.",
    price: "$90",
    image: PKG_BIRTHDAY_HAMPER_PIC
  },
  {
    id: "p5",
    name: "Premium Bridal Bouquet",
    category: "Wedding Flowers",
    description: "Large premium rose bouquet suited to weddings, introductions, and formal gifting.",
    price: "$150",
    image: PKG_WEDDING_PACKAGE_PIC
  },
  {
    id: "p6",
    name: "Rose & Ferrero Box",
    category: "Chocolate Bouquets",
    description: "Red roses arranged with Ferrero Rocher in a luxury hat box.",
    price: "$60",
    image: PKG_CUSTOM_SURPRISE_PIC
  },
  {
    id: "p7",
    name: "Classic Red Mini",
    category: "Flower Bouquets",
    description: "Compact red rose bouquet with soft white filler and neat wrap.",
    price: "$20",
    image: "/images/package-20-mini.jpeg"
  },
  {
    id: "p8",
    name: "Ivory Rose Mix",
    category: "Flower Bouquets",
    description: "Red and ivory roses wrapped as a polished romantic bouquet.",
    price: "$60",
    image: "/images/package-60-ivory-rose.jpeg"
  }
];

export const GALLERY_IMAGES = GALLERY;

export const TRUST_CARDS = [
  { title: "Custom-made packages", icon: Gift },
  { title: "Perfect for every occasion", icon: Heart },
  { title: "Beautiful presentation", icon: Star },
  { title: "Flexible budget options", icon: CircleDollarSign },
  { title: "Easy WhatsApp ordering", icon: Smartphone }
];

export const OCCASIONS = [
  "Birthday", "Wedding", "Anniversary", "Valentine's", "Thank You", "Baby Shower", "Corporate Event", "Funeral", "Memorial", "Other"
];

export const PACKAGE_CATEGORIES = [
  "Flower Bouquets",
  "Money Bouquets",
  "Candy Bouquets",
  "Chocolate Bouquets",
  "Custom Combo Bouquets",
  "Wedding Flowers",
  "Funeral Flowers",
  "Event Flowers",
  "Gift Hampers",
  "Other"
];

export interface Package {
  id: string;
  name: string;
  category: string;
  description: string;
  price: string;
  image: string;
  isAvailable: boolean;
  isFeatured: boolean;
  showInGallery: boolean;
}

export const COLORS = ["Red", "White", "Pink", "Gold", "Mixed", "Custom"];

export const BUDGETS = ["$10-$20", "$20-$40", "$40-$70", "$70+", "$90+", "$150+", "Custom"];
