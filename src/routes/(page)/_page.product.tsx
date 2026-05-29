import { ProductList } from '@/features/product/ui/prodict-list';
import { Page } from '@/shared/ui';
import { createFileRoute } from '@tanstack/react-router';

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

