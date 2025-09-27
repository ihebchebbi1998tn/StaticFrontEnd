import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { FixedSizeList as List } from 'react-window';

interface VirtualTableProps {
  data: any[];
  columns: Array<{
    key: string;
    label: string;
    width?: number;
    render?: (value: any, row: any) => React.ReactNode;
  }>;
  rowHeight?: number;
  height?: number;
  onRowClick?: (row: any, index: number) => void;
  className?: string;
}

interface RowProps {
  index: number;
  style: React.CSSProperties;
}

export function VirtualTable({
  data,
  columns,
  rowHeight = 50,
  height = 400,
  onRowClick,
  className = ''
}: VirtualTableProps) {
  const [containerWidth, setContainerWidth] = useState(0);
  const containerRef = useCallback((node: HTMLDivElement | null) => {
    if (node) {
      setContainerWidth(node.offsetWidth);
    }
  }, []);

  // Calculate column widths
  const columnWidths = useMemo(() => {
    const totalFixedWidth = columns
      .filter(col => col.width)
      .reduce((sum, col) => sum + (col.width || 0), 0);
    
    const flexColumns = columns.filter(col => !col.width);
    const availableWidth = Math.max(containerWidth - totalFixedWidth, 0);
    const flexWidth = flexColumns.length > 0 ? availableWidth / flexColumns.length : 0;
    
    return columns.map(col => col.width || flexWidth);
  }, [columns, containerWidth]);

  // Header component
  const Header = useMemo(() => (
    <div 
      className="flex border-b border-border bg-muted/60 sticky top-0 z-10"
      style={{ height: Math.max(rowHeight, 40) }}
    >
      {columns.map((column, index) => (
        <div
          key={column.key}
          className="flex items-center px-3 font-medium text-sm text-foreground/80 border-r border-border last:border-r-0"
          style={{ width: columnWidths[index] }}
        >
          <span className="truncate">{column.label}</span>
        </div>
      ))}
    </div>
  ), [columns, columnWidths, rowHeight]);

  // Row component
  const Row = useCallback(({ index, style }: RowProps) => {
    const row = data[index];
    const isError = row._status === 'error' || row._status === 'invalid';
    
    return (
      <div
        style={style}
        className={`flex border-b border-border hover:bg-muted/40 cursor-pointer transition-colors ${
          index % 2 === 0 ? 'bg-background' : 'bg-muted/10'
        } ${isError ? 'bg-red-50 hover:bg-red-100' : ''}`}
        onClick={() => onRowClick?.(row, index)}
      >
        {columns.map((column, colIndex) => (
          <div
            key={column.key}
            className="flex items-center px-3 text-sm border-r border-border last:border-r-0"
            style={{ width: columnWidths[colIndex] }}
          >
            {column.render ? 
              column.render(row[column.key], row) : 
              <div className="truncate w-full" title={row[column.key]?.toString() || ''}>
                {row[column.key]?.toString() || '-'}
              </div>
            }
          </div>
        ))}
      </div>
    );
  }, [data, columns, columnWidths, onRowClick]);

  if (data.length === 0) {
    return (
      <div className={`border rounded-lg ${className}`}>
        {Header}
        <div className="flex items-center justify-center p-8 text-muted-foreground">
          No data available
        </div>
      </div>
    );
  }

  return (
    <div className={`border rounded-lg overflow-hidden ${className}`} ref={containerRef}>
      {Header}
      <List
        height={height}
        itemCount={data.length}
        itemSize={rowHeight}
        width="100%"
      >
        {Row}
      </List>
    </div>
  );
}