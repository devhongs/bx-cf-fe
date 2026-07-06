import { useFetchProductList } from '@bx/shared';

export function ProductPage() {
  const { data: products, isLoading, isError, error } = useFetchProductList();

  return (
    <div className="h-full overflow-y-auto bg-background p-8 text-foreground">
      <h1 className="mb-6 text-2xl font-semibold">상품</h1>

      {isLoading && <p className="text-muted">불러오는 중...</p>}

      {isError && (
        <p className="text-red-400">
          상품을 불러오지 못했습니다. {error instanceof Error ? error.message : ''}
        </p>
      )}

      {!isLoading && !isError && (
        <ul className="flex flex-col gap-2">
          {products?.map((product) => (
            <li
              key={product.productId}
              className="rounded-lg border border-border bg-surface px-4 py-3"
            >
              <p className="text-sm font-medium text-foreground">{product.productNm}</p>
              {product.productDesc && (
                <p className="mt-1 text-xs text-muted">{product.productDesc}</p>
              )}
            </li>
          ))}
        </ul>
      )}

      {!isLoading && !isError && (products?.length ?? 0) === 0 && (
        <p className="text-muted">등록된 상품이 없습니다.</p>
      )}
    </div>
  );
}
