import { useMemo, useState } from "react";

export function usePagination<T>(items: T[], pageSize = 10) {
  const [requestedPage, setPage] = useState(1);

  const pageCount = Math.max(1, Math.ceil(items.length / pageSize));
  const page = Math.min(requestedPage, pageCount);

  const pageItems = useMemo(
    () => items.slice((page - 1) * pageSize, page * pageSize),
    [items, page, pageSize],
  );

  return {
    page,
    setPage,
    pageCount,
    pageItems,
    total: items.length,
    pageSize,
  };
}
