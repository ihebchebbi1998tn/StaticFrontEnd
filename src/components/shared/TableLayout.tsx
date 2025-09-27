import React from 'react';
import { Table, TableHeader, TableBody, TableRow, TableCell, TableHead } from '@/components/ui/table';
import { PaginationControls } from './PaginationControls';

export type Column<T = any> = {
  key: string;
  title?: React.ReactNode;
  width?: string;
  headerClass?: string;
  cellClass?: string;
  render: (row: T) => React.ReactNode;
};

type Props<T = any> = {
  items: T[];
  columns: Column<T>[];
  onRowClick?: (row: T) => void;
  rowKey?: (row: T) => string | number;
  emptyState?: React.ReactNode;
  wrapperClassName?: string;
  tableClassName?: string;
  // Pagination props
  enablePagination?: boolean;
  itemsPerPage?: number;
  currentPage?: number;
  onPageChange?: (page: number) => void;
  totalItems?: number;
};

export function TableLayout<T = any>({
  items,
  columns,
  onRowClick,
  rowKey,
  emptyState,
  wrapperClassName,
  tableClassName = 'w-full table-fixed min-w-[800px]',
  enablePagination = false,
  itemsPerPage = 5,
  currentPage = 1,
  onPageChange,
  totalItems
}: Props<T>) {
  if (!items || items.length === 0) {
    return <>{emptyState ?? null}</>;
  }

  const totalPages = enablePagination && totalItems ? Math.ceil(totalItems / itemsPerPage) : 1;
  const hasNextPage = enablePagination ? currentPage < totalPages : false;
  const hasPreviousPage = enablePagination ? currentPage > 1 : false;

  const handlePageChange = (page: number) => {
    if (onPageChange) {
      onPageChange(page);
    }
  };

  const handleNextPage = () => {
    if (hasNextPage && onPageChange) {
      onPageChange(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (hasPreviousPage && onPageChange) {
      onPageChange(currentPage - 1);
    }
  };

  // Render Table directly. The Table component already wraps itself with a responsive container.
  return (
    <div className={wrapperClassName}>
      <Table className={tableClassName}>
        <TableHeader>
          <TableRow className="border-border hover:bg-transparent">
            {columns.map(col => (
              <TableHead key={col.key} className={`${col.width ?? ''} ${col.headerClass ?? ''}`}>
                {col.title}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map(item => (
            <TableRow
              key={rowKey ? String(rowKey(item)) : String((item as any).id ?? Math.random())}
              className="border-border hover:bg-muted/50 cursor-pointer group"
              onClick={() => onRowClick && onRowClick(item)}
            >
              {columns.map(col => (
                <TableCell key={col.key} className={col.cellClass ?? 'p-4'}>
                  {col.render(item)}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      
      {enablePagination && totalItems && totalItems > itemsPerPage && (
        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          hasNextPage={hasNextPage}
          hasPreviousPage={hasPreviousPage}
          onPageChange={handlePageChange}
          onNextPage={handleNextPage}
          onPreviousPage={handlePreviousPage}
          showPageNumbers={true}
        />
      )}
    </div>
  );
}

export default TableLayout;
