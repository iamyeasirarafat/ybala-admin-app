// Menu domain types — mirrors yabala-be/apps/menu

export type MenuKind = 'simple' | 'variation';

export interface MenuVariation {
  name: string;
  price: string | number;
}

export interface MenuTypeGroup {
  name: string;
  variation: MenuVariation[];
}

export interface MenuSeoBlock {
  image: string;
  meta_title: string;
  meta_description: string;
}

export interface MenuTranslationLocale {
  name: string;
  description: string;
  permalink: string;
  type: MenuTypeGroup[];
  meta_title: string;
  meta_description: string;
  schema_type: string;
  meta: MenuSeoBlock;
  twitter: MenuSeoBlock;
}

export interface MenuTranslations {
  en: MenuTranslationLocale;
  ar: MenuTranslationLocale;
}

export interface Tag {
  id: number;
  name: string;
  items?: number;
}

export interface Category {
  id: number;
  name: string;
  arabic_name?: string | null;
  icon?: string | null;
  banner?: string | null;
  banner_alt?: string | null;
  index?: number;
  items?: number;
}

export interface MenuItem {
  id: number;
  type: MenuKind;
  image?: string | null;
  image_alt?: string | null;
  category?: number | null;
  category_data?: Category | null;
  tag?: number[];
  tag_data?: Tag[];
  available: boolean;
  translations: MenuTranslations;
  price?: string | number;
  index?: number;
}
