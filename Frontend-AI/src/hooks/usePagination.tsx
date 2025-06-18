import { useState } from "react";

interface PaginationHookProps<T> {
  data: T[];
  initialPage?: number;
  pageSize: number;
}

export const usePagination = <T,>({ data, initialPage = 1, pageSize }: PaginationHookProps<T>) => {
  const [currentPage, setCurrentPage] = useState(initialPage);

  const totalPages = Math.ceil(data.length / pageSize);
  const paginatedData = data.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return {
    currentPage,
    totalPages,
    paginatedData,
    handlePageChange
  };
};
