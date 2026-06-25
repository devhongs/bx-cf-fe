import { createFileRoute } from '@tanstack/react-router';

import { ProductPage } from '@/pages/product';

export type ProductRouteState = {
  productType?: string;
};

export const Route = createFileRoute('/(page)/_page/product')({
  component: ProductPage,
});
