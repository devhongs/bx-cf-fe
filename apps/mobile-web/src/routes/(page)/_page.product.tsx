import { Page } from '@bx/shared';
import { createFileRoute } from '@tanstack/react-router';
import { ProductList } from '@/features/product/ui/prodict-list';

function ProductPage() {
  return (
    <Page>
      <Page.Body>
        <ProductList />
      </Page.Body>
    </Page>
  );
}

export const Route = createFileRoute('/(page)/_page/product')({
  component: ProductPage,
});
