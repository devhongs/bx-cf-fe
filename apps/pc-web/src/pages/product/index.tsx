import { useFetchProductList } from '@bx/shared';

export function ProductPage() {
  const { data: products, isLoading, isError, error } = useFetchProductList();

  return (
    <div className="h-full overflow-y-auto bg-[#131314] p-8 text-[#e3e3e3]">
      <h1 className="mb-6 text-2xl font-semibold">상품</h1>

      {isLoading && <p className="text-[#9aa0a6]">불러오는 중...</p>}

      {isError && (
        <p className="text-red-400">
          상품을 불러오지 못했습니다. {error instanceof Error ? error.message : ''}
        </p>
      )}

      {!isLoading && !isError && (
        <ul className="flex flex-col gap-2">
          {products?.map((product) => (
            <li
              key={product.id}
              className="rounded-lg border border-[#2a2a2c] bg-[#1e1f21] px-4 py-3"
            >
              <p className="text-sm font-medium text-[#e3e3e3]">{product.name}</p>
              {product.description && (
                <p className="mt-1 text-xs text-[#9aa0a6]">{product.description}</p>
              )}
            </li>
          ))}
        </ul>
      )}

      {!isLoading && !isError && (products?.length ?? 0) === 0 && (
        <p className="text-[#9aa0a6]">등록된 상품이 없습니다.</p>
      )}
    </div>
  );
}
