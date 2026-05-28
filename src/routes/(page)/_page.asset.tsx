import { AssetList } from '@/features/asset/ui/asset-list';
import { createFileRoute } from '@tanstack/react-router';

export function AssetPage() {
  return <AssetList />;
}

export const Route = createFileRoute('/(page)/_page/asset')({
  component: AssetPage,
});
