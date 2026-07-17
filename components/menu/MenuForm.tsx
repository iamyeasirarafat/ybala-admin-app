import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SingleSelectField } from '@/components/menu/SingleSelectField';
import { TypeVariationBuilder } from '@/components/menu/TypeVariationBuilder';
import { MultiSelectField } from '@/components/promotion/MultiSelectField';
import { ImagePickerField } from '@/components/settings/ImagePickerField';
import { SectionHeading } from '@/components/settings/SectionHeading';
import { Button, Input } from '@/components/ui';
import {
  useCategoryOptions,
  useMenu,
  useSaveMenu,
  useTagOptions,
} from '@/hooks/useMenu';
import { promotionService } from '@/services/promotionService';
import {
  ImageUpload,
  MenuKind,
  MenuTranslationLocale,
  MenuTypeGroup,
} from '@/types';
import { toast } from '@/utils/toast';

type Lang = 'en' | 'ar';
type SeoKind = 'meta' | 'twitter';
type LangImages = { meta: ImageUpload | null; twitter: ImageUpload | null };

const emptyLocale = (): MenuTranslationLocale => ({
  name: '',
  description: '',
  permalink: '',
  type: [],
  meta_title: '',
  meta_description: '',
  schema_type: '',
  meta: { image: '', meta_title: '', meta_description: '' },
  twitter: { image: '', meta_title: '', meta_description: '' },
});

const normalizeLocale = (
  loc?: Partial<MenuTranslationLocale>,
): MenuTranslationLocale => ({
  name: loc?.name ?? '',
  description: loc?.description ?? '',
  permalink: loc?.permalink ?? '',
  type: (loc?.type as MenuTypeGroup[]) ?? [],
  meta_title: loc?.meta_title ?? '',
  meta_description: loc?.meta_description ?? '',
  schema_type: loc?.schema_type ?? '',
  meta: {
    image: loc?.meta?.image ?? '',
    meta_title: loc?.meta?.meta_title ?? '',
    meta_description: loc?.meta?.meta_description ?? '',
  },
  twitter: {
    image: loc?.twitter?.image ?? '',
    meta_title: loc?.twitter?.meta_title ?? '',
    meta_description: loc?.twitter?.meta_description ?? '',
  },
});

export const MenuForm: React.FC = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const menuId = id ? Number(id) : undefined;

  const { data: menu, isLoading } = useMenu(menuId);
  const saveMenu = useSaveMenu();
  const { data: categoryOptions = [] } = useCategoryOptions();
  const { data: tagOptions = [] } = useTagOptions();

  // Top-level fields
  const [type, setType] = useState<MenuKind | ''>('');
  const [image, setImage] = useState<ImageUpload | null>(null);
  const [imageAlt, setImageAlt] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState<number | null>(null);
  const [tags, setTags] = useState<number[]>([]);
  const [available, setAvailable] = useState(true);

  // Translations
  const [lang, setLang] = useState<Lang>('en');
  const [seoTab, setSeoTab] = useState<SeoKind>('meta');
  const [en, setEn] = useState<MenuTranslationLocale>(emptyLocale());
  const [ar, setAr] = useState<MenuTranslationLocale>(emptyLocale());
  const [seoImages, setSeoImages] = useState<{ en: LangImages; ar: LangImages }>({
    en: { meta: null, twitter: null },
    ar: { meta: null, twitter: null },
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!menu) return;
    setType(menu.type || '');
    setImageAlt(menu.image_alt || '');
    setPrice(menu.price != null ? String(menu.price) : '');
    setCategory(menu.category ?? menu.category_data?.id ?? null);
    setTags(menu.tag ?? menu.tag_data?.map((t) => t.id) ?? []);
    setAvailable(!!menu.available);
    setEn(normalizeLocale(menu.translations?.en));
    setAr(normalizeLocale(menu.translations?.ar));
  }, [menu]);

  const current = lang === 'en' ? en : ar;
  const setCurrent = lang === 'en' ? setEn : setAr;
  const patch = (u: (p: MenuTranslationLocale) => MenuTranslationLocale) =>
    setCurrent((p) => u(p));

  const pickSeoImage = (kind: SeoKind, asset: ImageUpload) =>
    setSeoImages((prev) => ({
      ...prev,
      [lang]: { ...prev[lang], [kind]: asset },
    }));

  const handleSave = async () => {
    if (!type) return toast.error('Product type is required.');
    if (!en.name.trim()) return toast.error('English name is required.');
    if (!ar.name.trim()) return toast.error('Arabic name is required.');
    if (type === 'simple' && !price.trim())
      return toast.error('Price is required for simple items.');

    try {
      setSaving(true);

      // Resolve SEO images (upload picked files, keep existing strings).
      const resolveLocale = async (
        l: Lang,
        loc: MenuTranslationLocale,
      ): Promise<MenuTranslationLocale> => {
        const picks = seoImages[l];
        const metaImage = picks.meta
          ? await promotionService.uploadFile(picks.meta)
          : loc.meta.image;
        const twitterImage = picks.twitter
          ? await promotionService.uploadFile(picks.twitter)
          : loc.twitter.image;
        return {
          ...loc,
          meta: { ...loc.meta, image: metaImage },
          twitter: { ...loc.twitter, image: twitterImage },
        };
      };

      const enResolved = await resolveLocale('en', en);
      const arResolved = await resolveLocale('ar', ar);

      const fd = new FormData();
      fd.append('type', type);
      fd.append('image_alt', imageAlt);
      fd.append('available', available ? 'true' : 'false');
      fd.append('translations', JSON.stringify({ en: enResolved, ar: arResolved }));
      if (type === 'simple' && price.trim()) fd.append('price', price.trim());
      if (image) fd.append('image', image as unknown as Blob);
      if (category) fd.append('category', String(category));
      if (tags.length) fd.append('tag', tags.join(','));

      await saveMenu.mutateAsync({ id: menuId, formData: fd });
      router.back();
    } catch {
      // handled by hook onError
    } finally {
      setSaving(false);
    }
  };

  if (menuId && isLoading) {
    return (
      <View className="flex-1 items-center justify-center py-16">
        <ActivityIndicator size="large" color="#6FA25F" />
      </View>
    );
  }

  return (
    <View className="px-4 py-5 gap-5">
      <SectionHeading title={menuId ? 'Edit Menu' : 'New Menu'} />

      {/* ---- Food information ---- */}
      <Text className="text-base font-bold text-gray-900 dark:text-white">
        Food Information
      </Text>

      {/* Product type */}
      <View>
        <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Product Type
        </Text>
        <View className="flex-row bg-gray-100 dark:bg-gray-800 rounded-xl p-1">
          {(['simple', 'variation'] as MenuKind[]).map((t) => (
            <TouchableOpacity
              key={t}
              onPress={() => setType(t)}
              className={`flex-1 py-2 rounded-lg items-center ${
                type === t ? 'bg-white dark:bg-gray-700' : ''
              }`}
              activeOpacity={0.8}
            >
              <Text
                className={`text-sm font-semibold capitalize ${
                  type === t
                    ? 'text-primary-600 dark:text-primary-300'
                    : 'text-gray-500 dark:text-gray-400'
                }`}
              >
                {t}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <ImagePickerField
        label="Food Image"
        defaultImage={menu?.image}
        value={image}
        onPick={setImage}
      />
      <Input
        label="Image Alt Text"
        value={imageAlt}
        onChangeText={setImageAlt}
        placeholder="Box of happiness"
      />

      {type === 'simple' && (
        <Input
          label="Price (AED)"
          value={price}
          onChangeText={setPrice}
          placeholder="124.00"
          keyboardType="numeric"
        />
      )}

      <SingleSelectField
        label="Category"
        options={categoryOptions}
        value={category}
        onChange={setCategory}
        placeholder="Select a category"
      />
      <MultiSelectField
        label="Tags"
        options={tagOptions}
        selectedIds={tags}
        onChange={setTags}
        placeholder="Search a tag"
      />

      <View className="flex-row items-center justify-between py-1">
        <Text className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Available
        </Text>
        <Switch
          value={available}
          onValueChange={setAvailable}
          trackColor={{ true: '#6FA25F' }}
        />
      </View>

      {/* ---- Detail information (translations) ---- */}
      <View className="h-px bg-gray-100 dark:bg-gray-800 my-1" />
      <Text className="text-base font-bold text-gray-900 dark:text-white">
        Food Detail Information
      </Text>

      {/* Language tabs */}
      <View className="flex-row bg-gray-100 dark:bg-gray-800 rounded-xl p-1">
        {(['en', 'ar'] as Lang[]).map((l) => (
          <TouchableOpacity
            key={l}
            onPress={() => setLang(l)}
            className={`flex-1 py-2 rounded-lg items-center ${
              lang === l ? 'bg-white dark:bg-gray-700' : ''
            }`}
            activeOpacity={0.8}
          >
            <Text
              className={`text-sm font-semibold ${
                lang === l
                  ? 'text-primary-600 dark:text-primary-300'
                  : 'text-gray-500 dark:text-gray-400'
              }`}
            >
              {l === 'en' ? 'English' : 'Arabic'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Input
        label="Name"
        value={current.name}
        onChangeText={(v) => patch((p) => ({ ...p, name: v }))}
        placeholder="Mahshi"
      />
      <Input
        label="Description"
        value={current.description}
        onChangeText={(v) => patch((p) => ({ ...p, description: v }))}
        placeholder="4 PCS Onion Mahshi in a box"
        multiline
        numberOfLines={4}
      />

      <TypeVariationBuilder
        value={current.type}
        onChange={(groups) => patch((p) => ({ ...p, type: groups }))}
        showPrice={type === 'variation'}
      />

      <Input
        label="Permalink"
        value={current.permalink}
        onChangeText={(v) => patch((p) => ({ ...p, permalink: v }))}
        placeholder="mahshi"
        autoCapitalize="none"
      />

      {/* SEO */}
      <View className="h-px bg-gray-100 dark:bg-gray-800 my-1" />
      <Text className="text-base font-bold text-gray-900 dark:text-white">
        SEO Information
      </Text>
      <Input
        label="Meta Title"
        value={current.meta_title}
        onChangeText={(v) => patch((p) => ({ ...p, meta_title: v }))}
        placeholder="Meta title"
      />
      <Input
        label="Meta Description"
        value={current.meta_description}
        onChangeText={(v) => patch((p) => ({ ...p, meta_description: v }))}
        placeholder="Meta description"
        multiline
        numberOfLines={3}
      />
      <View>
        <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Schema Type
        </Text>
        <View className="flex-row bg-gray-100 dark:bg-gray-800 rounded-xl p-1">
          {['product', 'page'].map((s) => (
            <TouchableOpacity
              key={s}
              onPress={() => patch((p) => ({ ...p, schema_type: s }))}
              className={`flex-1 py-2 rounded-lg items-center ${
                current.schema_type === s ? 'bg-white dark:bg-gray-700' : ''
              }`}
              activeOpacity={0.8}
            >
              <Text
                className={`text-sm font-semibold capitalize ${
                  current.schema_type === s
                    ? 'text-primary-600 dark:text-primary-300'
                    : 'text-gray-500 dark:text-gray-400'
                }`}
              >
                {s}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Meta / Twitter tabs */}
      <View className="flex-row bg-gray-100 dark:bg-gray-800 rounded-xl p-1">
        {(['meta', 'twitter'] as SeoKind[]).map((s) => (
          <TouchableOpacity
            key={s}
            onPress={() => setSeoTab(s)}
            className={`flex-1 py-2 rounded-lg items-center ${
              seoTab === s ? 'bg-white dark:bg-gray-700' : ''
            }`}
            activeOpacity={0.8}
          >
            <Text
              className={`text-sm font-semibold capitalize ${
                seoTab === s
                  ? 'text-primary-600 dark:text-primary-300'
                  : 'text-gray-500 dark:text-gray-400'
              }`}
            >
              {s}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {seoTab === 'meta' ? (
        <>
          <ImagePickerField
            label="Meta Image"
            defaultImage={current.meta.image}
            value={seoImages[lang].meta}
            onPick={(asset) => pickSeoImage('meta', asset)}
          />
          <Input
            label="Meta Image Title"
            value={current.meta.meta_title}
            onChangeText={(v) =>
              patch((p) => ({ ...p, meta: { ...p.meta, meta_title: v } }))
            }
            placeholder="Meta title"
          />
          <Input
            label="Meta Image Description"
            value={current.meta.meta_description}
            onChangeText={(v) =>
              patch((p) => ({ ...p, meta: { ...p.meta, meta_description: v } }))
            }
            placeholder="Meta description"
            multiline
            numberOfLines={3}
          />
        </>
      ) : (
        <>
          <ImagePickerField
            label="Twitter Image"
            defaultImage={current.twitter.image}
            value={seoImages[lang].twitter}
            onPick={(asset) => pickSeoImage('twitter', asset)}
          />
          <Input
            label="Twitter Image Title"
            value={current.twitter.meta_title}
            onChangeText={(v) =>
              patch((p) => ({ ...p, twitter: { ...p.twitter, meta_title: v } }))
            }
            placeholder="Twitter title"
          />
          <Input
            label="Twitter Image Description"
            value={current.twitter.meta_description}
            onChangeText={(v) =>
              patch((p) => ({
                ...p,
                twitter: { ...p.twitter, meta_description: v },
              }))
            }
            placeholder="Twitter description"
            multiline
            numberOfLines={3}
          />
        </>
      )}

      <View className="pb-8">
        <Button onPress={handleSave} loading={saving || saveMenu.isPending}>
          <Text className="text-white font-semibold text-base">
            {menuId ? 'Update' : 'Create'}
          </Text>
        </Button>
      </View>
    </View>
  );
};
