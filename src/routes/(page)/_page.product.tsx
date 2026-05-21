import { createFileRoute } from '@tanstack/react-router';

import ProductPage from '@/pages/page/product';

export const Route = createFileRoute('/(page)/_page/product')({
  component: ProductPage,
});
