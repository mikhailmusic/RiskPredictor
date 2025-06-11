import { useState } from "react";

interface PaginationHookProps {
  initialPage: number;
  pageSize: number;
  totalItems: number;
}

export const usePagination = <T,>({ initialPage, pageSize, totalItems }: PaginationHookProps) => {
  const [currentPage, setCurrentPage] = useState(initialPage);

  const totalPages = Math.ceil(totalItems / pageSize);

  const paginatedData = (data: T[]): T[] => {
    return data.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  };

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
