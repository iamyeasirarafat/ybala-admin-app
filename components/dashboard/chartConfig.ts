import { Dimensions } from 'react-native';

// Card sits inside a px-4 screen container and has p-4 padding itself.
// Make the chart a little wider than the card interior and pull it in with a
// small negative margin so it spans edge-to-edge without wasted side padding.
export const CHART_WIDTH = Dimensions.get('window').width - 48;

// Default chart-kit paddingRight is 64 (huge gap on the right). Trim it so the
// 12-month labels have room to breathe.
export const CHART_STYLE = { borderRadius: 12, paddingRight: 24 } as const;

export const getLineChartConfig = (isDark: boolean) => ({
  backgroundGradientFrom: isDark ? '#111827' : '#FFFFFF',
  backgroundGradientTo: isDark ? '#111827' : '#FFFFFF',
  decimalPlaces: 0,
  color: () => '#6FA25F',
  labelColor: () => (isDark ? '#9CA3AF' : '#6B7280'),
  propsForDots: { r: '3' },
  propsForLabels: { fontSize: 10 },
});
