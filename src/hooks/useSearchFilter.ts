
import { useState, useMemo, useCallback } from "react";

export function useSearchFilter<T>(
  items: T[],
  filterFn: (item: T, query: string) => boolean
) {
  const [searchQuery, setSearchQuery] = useState<string>("");

  const filteredItems = useMemo(() => {
    const trimmedQuery = searchQuery.trim().toLowerCase();
    return trimmedQuery === "" 
      ? items 
      : items.filter(item => filterFn(item, trimmedQuery));
  }, [items, searchQuery, filterFn]);

  const resetSearch = useCallback(() => {
    setSearchQuery("");
  }, []);

  const isFiltered = searchQuery.trim() !== "";

  return { 
    searchQuery, 
    setSearchQuery, 
    filteredItems,
    isFiltered,
    resetSearch
  };
}
