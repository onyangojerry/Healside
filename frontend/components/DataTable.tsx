import React from 'react';

export type DataColumn<T> = {
  key: string;
  label: string;
  render?: (row: T) => React.ReactNode;
};

interface DataTableProps<T> {
  columns: DataColumn<T>[];
  data: T[];
  onRowClick?: (row: T) => void;
  emptyMessage?: string;
}

const DataTable = <T extends { id?: string }>({ columns, data, onRowClick, emptyMessage }: DataTableProps<T>) => {
  return (
    <div className="table-wrapper">
      <table className="data-table">
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key}>{col.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="empty-cell">
                {emptyMessage || 'No results found.'}
              </td>
            </tr>
          ) : (
            data.map((row) => (
              <tr
                key={row.id || JSON.stringify(row)}
                onClick={() => onRowClick?.(row)}
                className={onRowClick ? 'clickable' : undefined}
                tabIndex={onRowClick ? 0 : -1}
                onKeyDown={(event) => {
                  if (!onRowClick) return;
                  if (event.key === 'Enter' || event.key === ' ') {
                    onRowClick(row);
                  }
                }}
              >
                {columns.map((col) => (
                  <td key={col.key}>{col.render ? col.render(row) : (row as any)[col.key]}</td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
