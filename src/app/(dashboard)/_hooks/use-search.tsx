"use client";
import { PAGINATION } from "@/config/constants";
import { useEffect, useState } from "react";

interface UseSearchProps<T extends { search: string; page: number }> {
  params: T;
  setParams: (params: T) => void;
  debounceMs?: number;
}

export function useSearch<T extends { search: string; page: number }>({
  params,
  setParams,
  debounceMs = 300,
}: UseSearchProps<T>) {
  const [search, setSearch] = useState(params.search);
  useEffect(() => {
    if (search === "" && params.search !== "") {
      setParams({ ...params, search: "", page: PAGINATION.DEFAULT_PAGE });
      return;
    }
    const timer = setTimeout(() => {
      if (search !== params.search) {
        setParams({ ...params, search, page: PAGINATION.DEFAULT_PAGE });
      }
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [search, params, setParams, debounceMs]);
  useEffect(() => {
    setSearch(params.search);
  }, [params.search]);

  return {
    search,
    setSearch,
  };
}
