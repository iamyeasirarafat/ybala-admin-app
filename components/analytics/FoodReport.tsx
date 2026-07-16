import { useState } from 'react';
import { useTopSellingProducts } from '@/hooks/useAnalytics';
import { AnalyticsPeriod, ReportOrder } from '@/types';
import { formatCurrency, mediaUrl } from '@/utils/format';
import { ProductReportCard, ProductRowItem } from './ProductReportCard';

const PAGE_SIZE = 5;

export const FoodReport: React.FC = () => {
  const [period, setPeriod] = useState<AnalyticsPeriod>('12_months');
  const [order, setOrder] = useState<ReportOrder>('desc');
  const [limit, setLimit] = useState(PAGE_SIZE);
  const { data, isLoading, isFetching } = useTopSellingProducts({
    period,
    order,
    limit,
  });

  const items: ProductRowItem[] =
    data?.results?.map((item, index) => ({
      id: item.menu?.id ?? index,
      name: item.menu?.translations?.en?.name ?? 'Unnamed item',
      image: mediaUrl(item.menu?.image),
      primary: { label: 'Sold', value: item.sold_count ?? 0 },
      secondary: { label: 'Revenue', value: formatCurrency(item.total_price ?? 0) },
    })) ?? [];

  const hasMore = (data?.count ?? 0) > items.length;

  const resetAnd = (fn: () => void) => {
    setLimit(PAGE_SIZE);
    fn();
  };

  return (
    <ProductReportCard
      title="Food Report"
      period={period}
      onPeriodChange={(p) => resetAnd(() => setPeriod(p))}
      order={order}
      onOrderChange={(o) => resetAnd(() => setOrder(o))}
      items={items}
      isLoading={isLoading}
      hasMore={hasMore}
      onLoadMore={() => setLimit((l) => l + PAGE_SIZE)}
      loadingMore={isFetching && !isLoading}
    />
  );
};
