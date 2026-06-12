import { createFileRoute } from '@tanstack/react-router';

import { AssetPage } from '@/pages/asset';

export const Route = createFileRoute('/(page)/_page/asset')({
  component: AssetPage,
});
