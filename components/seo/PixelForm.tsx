import React, { useEffect, useState } from 'react';
import { Switch, Text, View } from 'react-native';
import { SectionHeading } from '@/components/settings/SectionHeading';
import { Button, Input } from '@/components/ui';
import { useMetaPixel, useUpdateMetaPixel } from '@/hooks/useSettings';

const ToggleRow: React.FC<{
  label: string;
  value: boolean;
  onValueChange: (v: boolean) => void;
}> = ({ label, value, onValueChange }) => (
  <View className="flex-row items-center justify-between py-1">
    <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 flex-1 pr-3">
      {label}
    </Text>
    <Switch value={value} onValueChange={onValueChange} trackColor={{ true: '#6FA25F' }} />
  </View>
);

export const PixelForm: React.FC = () => {
  const { data } = useMetaPixel();
  const update = useUpdateMetaPixel();

  const [enabled, setEnabled] = useState(false);
  const [pixelEnabled, setPixelEnabled] = useState(false);
  const [pixelId, setPixelId] = useState('');
  const [enableConversation, setEnableConversation] = useState(false);
  const [enableMatching, setEnableMatching] = useState(false);
  const [conversationApiKey, setConversationApiKey] = useState('');
  const [textEventCode, setTextEventCode] = useState('');

  useEffect(() => {
    if (!data) return;
    setEnabled(!!data.enabled);
    setPixelEnabled(!!data.pixel_enabled);
    setPixelId(data.pixel_id || '');
    setEnableConversation(!!data.enable_conversation);
    setEnableMatching(!!data.enable_matching);
    setConversationApiKey(data.conversation_api_key || '');
    setTextEventCode(data.text_event_code || '');
  }, [data]);

  const handleSave = () => {
    update.mutate({
      enabled,
      pixel_enabled: pixelEnabled,
      pixel_id: pixelId,
      enable_conversation: enableConversation,
      enable_matching: enableMatching,
      conversation_api_key: conversationApiKey,
      text_event_code: textEventCode,
      verification_meta_tag: data?.verification_meta_tag ?? [],
    });
  };

  return (
    <View className="px-4 py-5 gap-5">
      <View className="flex-row items-center justify-between">
        <SectionHeading
          title="Meta Pixels"
          description="Track conversions with the Meta (Facebook) Pixel"
        />
        <Switch value={enabled} onValueChange={setEnabled} trackColor={{ true: '#6FA25F' }} />
      </View>

      <View className="p-4 rounded-2xl border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/40 gap-3">
        <ToggleRow label="Enable Pixel" value={pixelEnabled} onValueChange={setPixelEnabled} />
        <Input
          label="Meta Pixel ID"
          value={pixelId}
          onChangeText={setPixelId}
          placeholder="Add your pixel ID"
          autoCapitalize="none"
        />
        <ToggleRow
          label="Enable Conversion API"
          value={enableConversation}
          onValueChange={setEnableConversation}
        />
        <ToggleRow
          label="Enable Advanced Matching"
          value={enableMatching}
          onValueChange={setEnableMatching}
        />
        <Input
          label="Conversion API Token"
          value={conversationApiKey}
          onChangeText={setConversationApiKey}
          placeholder="Add your conversion API token"
          autoCapitalize="none"
          multiline
          numberOfLines={4}
        />
        <Input
          label="Test Event Code"
          value={textEventCode}
          onChangeText={setTextEventCode}
          placeholder="Add your event test code"
          autoCapitalize="none"
        />
      </View>

      <Button onPress={handleSave} loading={update.isPending}>
        <Text className="text-white font-semibold text-base">Save Changes</Text>
      </Button>
    </View>
  );
};
