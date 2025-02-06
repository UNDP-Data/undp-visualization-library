import { useEffect, useState } from 'react';
import {
  PaginationUnit,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from './pagination';

interface PaginationProps {
  defaultPage?: number;
  total: number;
  pageSize: number;
  onChange: (page: number) => void;
  mode?: 'dark' | 'light';
  pageNo: number;
}

const getPageNumbers = (currentPageNo: number, totalPages: number) => {
  const pages: (number | 'ellipsis')[] = [];

  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  // Always show first page
  pages.push(1);

  if (currentPageNo <= 3) {
    pages.push(2, 3, 4, 'ellipsis');
  } else if (currentPageNo >= totalPages - 2) {
    pages.push('ellipsis', totalPages - 3, totalPages - 2, totalPages - 1);
  } else {
    pages.push(
      'ellipsis',
      currentPageNo - 1,
      currentPageNo,
      currentPageNo + 1,
      'ellipsis',
    );
  }

  // Always show last page
  pages.push(totalPages);

  return pages;
};

function Pagination(props: PaginationProps) {
  const {
    defaultPage = 1,
    total,
    pageSize,
    pageNo,
    onChange,
    mode = 'light',
  } = props;
  const totalPages = Math.ceil(total / pageSize);
  const [currentPage, setCurrentPage] = useState(pageNo || defaultPage);
  const [pageNumbers, setPageNumbers] = useState<(number | 'ellipsis')[]>(
    getPageNumbers(defaultPage, totalPages),
  );

  useEffect(() => {
    setCurrentPage(pageNo);
  });
  useEffect(() => {
    setPageNumbers(getPageNumbers(currentPage, totalPages));
  }, [currentPage, totalPages]);
  return (
    <PaginationUnit style={{ userSelect: 'none' }}>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            onClick={() => {
              if (currentPage > 1) {
                onChange(currentPage - 1);
                setCurrentPage(currentPage - 1);
              }
            }}
            mode={mode}
            style={{
              opacity: currentPage <= 1 ? 0.25 : 1,
              cursor: currentPage <= 1 ? 'not-allowed' : 'pointer',
              pointerEvents: currentPage <= 1 ? 'none' : 'auto',
              padding: '0.5rem',
              borderRadius: '999px',
              backgroundColor: mode === 'light' ? '#232E3D' : '#FFF',
            }}
          />
        </PaginationItem>

        {pageNumbers.map((page, index) => (
          <PaginationItem key={index}>
            {page === 'ellipsis' ? (
              <PaginationEllipsis mode={mode} />
            ) : (
              <PaginationLink
                onClick={() => {
                  setCurrentPage(page);
                  onChange(page);
                }}
                className={`${
                  mode === 'dark'
                    ? 'undp-pagination-link dark-mode'
                    : 'undp-pagination-link'
                }${page === currentPage ? ' selected' : ''}`}
              >
                {page}
              </PaginationLink>
            )}
          </PaginationItem>
        ))}

        <PaginationItem>
          <PaginationNext
            onClick={() => {
              if (currentPage < totalPages) {
                onChange(currentPage + 1);
                setCurrentPage(currentPage + 1);
              }
            }}
            mode={mode}
            style={{
              opacity: currentPage >= totalPages ? 0.25 : 1,
              cursor: currentPage >= totalPages ? 'not-allowed' : 'pointer',
              pointerEvents: currentPage >= totalPages ? 'none' : 'auto',
              padding: '0.5rem',
              borderRadius: '999px',
              backgroundColor: mode === 'light' ? '#232E3D' : '#FFF',
            }}
          />
        </PaginationItem>
      </PaginationContent>
    </PaginationUnit>
  );
}

export { Pagination };
