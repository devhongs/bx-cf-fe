import { createFileRoute } from '@tanstack/react-router';
import { AssetList } from '@/features/asset/ui/asset-list';

function AssetPage() {
  return <AssetList />;
}

export const Route = createFileRoute('/(page)/_page/asset')({
  component: AssetPage,
});
