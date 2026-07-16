import { Text, View } from 'react-native';

interface ReportCardProps {
  title?: string;
  children: React.ReactNode;
}

export const ReportCard: React.FC<ReportCardProps> = ({ title, children }) => {
  return (
    <View className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-4">
      {title && (
        <Text className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
          {title}
        </Text>
      )}
      {children}
    </View>
  );
};
