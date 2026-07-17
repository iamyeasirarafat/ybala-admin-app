import React, { useEffect, useMemo, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { ImagePickerField } from '@/components/settings/ImagePickerField';
import { SectionHeading } from '@/components/settings/SectionHeading';
import { Button, Input } from '@/components/ui';
import { useSeoInfo, useUpdateSeoInfo } from '@/hooks/useSettings';
import { promotionService } from '@/services/promotionService';
import { ImageUpload, SeoPage, SeoPageLocale, SeoPageName } from '@/types';
import { extractApiError } from '@/utils/errorExtractor';
import { toast } from '@/utils/toast';

type ImageKind = 'meta' | 'twitter';
type LangImages = { meta: ImageUpload | null; twitter: ImageUpload | null };
const emptyLangImages = (): LangImages => ({ meta: null, twitter: null });

interface FullMeta {
  image: string;
  meta_title: string;
  meta_description: string;
}
interface FullLocale {
  meta_title: string;
  meta_description: string;
  schema_type: string;
  meta: FullMeta;
  twitter: FullMeta;
}

const PAGES: { key: SeoPageName; label: string }[] = [
  { key: 'home_page', label: 'Home' },
  { key: 'product_page', label: 'Menu' },
  { key: 'contact_page', label: 'Contact' },
  { key: 'location_page', label: 'Location' },
];

const emptyLocale = (): FullLocale => ({
  meta_title: '',
  meta_description: '',
  schema_type: 'page',
  meta: { image: '', meta_title: '', meta_description: '' },
  twitter: { image: '', meta_title: '', meta_description: '' },
});

const normalizeLocale = (loc?: SeoPageLocale): FullLocale => ({
  meta_title: loc?.meta_title ?? '',
  meta_description: loc?.meta_description ?? '',
  schema_type: loc?.schema_type ?? 'page',
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

export const PageSeoForm: React.FC = () => {
  const { data: seoInfo } = useSeoInfo();
  const update = useUpdateSeoInfo();

  const [page, setPage] = useState<SeoPageName>('home_page');
  const [lang, setLang] = useState<'en' | 'ar'>('en');
  const [en, setEn] = useState<FullLocale>(emptyLocale());
  const [ar, setAr] = useState<FullLocale>(emptyLocale());
  const [localImages, setLocalImages] = useState<{
    en: LangImages;
    ar: LangImages;
  }>({ en: emptyLangImages(), ar: emptyLangImages() });
  const [saving, setSaving] = useState(false);

  const pageData: SeoPage | undefined = useMemo(
    () => seoInfo?.[page],
    [seoInfo, page],
  );

  useEffect(() => {
    setEn(normalizeLocale(pageData?.en));
    setAr(normalizeLocale(pageData?.ar));
    // Freshly picked images belong to the previously selected page — drop them.
    setLocalImages({ en: emptyLangImages(), ar: emptyLangImages() });
  }, [pageData]);

  const current = lang === 'en' ? en : ar;
  const setCurrent = lang === 'en' ? setEn : setAr;

  const patch = (updater: (prev: FullLocale) => FullLocale) =>
    setCurrent((prev) => updater(prev));

  const pickImage = (kind: ImageKind, asset: ImageUpload) =>
    setLocalImages((prev) => ({
      ...prev,
      [lang]: { ...prev[lang], [kind]: asset },
    }));

  const handleSave = async () => {
    try {
      setSaving(true);
      // Upload any freshly picked meta/twitter images, then persist as strings.
      const resolve = async (
        l: 'en' | 'ar',
        loc: FullLocale,
      ): Promise<FullLocale> => {
        const picks = localImages[l];
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

      const enResolved = await resolve('en', en);
      const arResolved = await resolve('ar', ar);
      await update.mutateAsync({
        [page]: { en: enResolved, ar: arResolved },
      } as any);
    } catch (error) {
      toast.error(extractApiError(error, 'Failed to update SEO info.'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <View className="px-4 pt-5 pb-12 gap-5">
      <SectionHeading
        title="Page SEO"
        description="Set meta tags for each public page"
      />

      {/* Page selector */}
      <View className="flex-row flex-wrap gap-2">
        {PAGES.map((p) => (
          <TouchableOpacity
            key={p.key}
            onPress={() => setPage(p.key)}
            className={`px-3 py-1.5 rounded-full border ${
              page === p.key
                ? 'bg-primary-600 border-primary-600'
                : 'border-gray-200 dark:border-gray-700'
            }`}
            activeOpacity={0.8}
          >
            <Text
              className={`text-sm font-medium ${
                page === p.key ? 'text-white' : 'text-gray-600 dark:text-gray-300'
              }`}
            >
              {p.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Language tabs */}
      <View className="flex-row bg-gray-100 dark:bg-gray-800 rounded-xl p-1">
        {(['en', 'ar'] as const).map((l) => (
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
        label="Page Meta Title"
        value={current.meta_title}
        onChangeText={(v) => patch((p) => ({ ...p, meta_title: v }))}
        placeholder="Page meta title"
      />
      <Input
        label="Page Meta Description"
        value={current.meta_description}
        onChangeText={(v) => patch((p) => ({ ...p, meta_description: v }))}
        placeholder="Page meta description"
        multiline
        numberOfLines={3}
      />

      <Text className="text-sm font-semibold text-gray-700 dark:text-gray-300">
        Meta
      </Text>
      <ImagePickerField
        label="Meta Image"
        defaultImage={current.meta.image}
        value={localImages[lang].meta}
        onPick={(asset) => pickImage('meta', asset)}
      />
      <Input
        label="Meta Title"
        value={current.meta.meta_title}
        onChangeText={(v) =>
          patch((p) => ({ ...p, meta: { ...p.meta, meta_title: v } }))
        }
        placeholder="Meta title"
      />
      <Input
        label="Meta Description"
        value={current.meta.meta_description}
        onChangeText={(v) =>
          patch((p) => ({ ...p, meta: { ...p.meta, meta_description: v } }))
        }
        placeholder="Meta description"
        multiline
        numberOfLines={3}
      />

      <Text className="text-sm font-semibold text-gray-700 dark:text-gray-300">
        Twitter Card
      </Text>
      <ImagePickerField
        label="Twitter Image"
        defaultImage={current.twitter.image}
        value={localImages[lang].twitter}
        onPick={(asset) => pickImage('twitter', asset)}
      />
      <Input
        label="Twitter Title"
        value={current.twitter.meta_title}
        onChangeText={(v) =>
          patch((p) => ({ ...p, twitter: { ...p.twitter, meta_title: v } }))
        }
        placeholder="Twitter card title"
      />
      <Input
        label="Twitter Description"
        value={current.twitter.meta_description}
        onChangeText={(v) =>
          patch((p) => ({
            ...p,
            twitter: { ...p.twitter, meta_description: v },
          }))
        }
        placeholder="Twitter card description"
        multiline
        numberOfLines={3}
      />

      <Button onPress={handleSave} loading={saving || update.isPending}>
        <Text className="text-white font-semibold text-base">Save Changes</Text>
      </Button>
    </View>
  );
};
