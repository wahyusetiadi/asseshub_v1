"use client";
import React from "react";

export interface Column<T> {
  key: keyof T | string;
  label: string;
  render?: (row: T, index: number) => React.ReactNode;
  align?: "left" | "center" | "right";
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  isLoading?: boolean;
  emptyMessage?: string;
}

export default function DataTable<T>({
  columns,
  data,
  isLoading,
  emptyMessage = "Tidak ada data",
}: DataTableProps<T>) {
  if (isLoading) {
    return (
      <div className="p-8 text-center text-gray-500">
        <div className="mx-auto mb-2 h-8 w-8 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
        Loading...
      </div>
    );
  }

  if (!data.length) {
    return <div className="p-8 text-center text-gray-500">{emptyMessage}</div>;
  }

  return (
    <div className="max-w-full overflow-x-auto">
      <table className="w-full text-left">
        <thead className="bg-gray-50 border-b border-slate-300 text-gray-600 uppercase text-[11px] font-bold tracking-widest">
          <tr>
            {columns.map((col) => (
              <th
                key={String(col.key)}
                className={`px-6 py-4 truncate whitespace-nowrap ${
                  col.align === "center"
                    ? "text-center"
                    : col.align === "right"
                    ? "text-right"
                    : "text-left"
                }`}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-200 text-sm text-gray-700">
          {data.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className="hover:bg-blue-50/50 transition"
            >
              {columns.map((col) => (
                <td
                  key={String(col.key)}
                  className={`px-6 py-4 truncate whitespace-nowrap overflow-hidden ${
                    col.align === "center"
                      ? "text-center"
                      : col.align === "right"
                      ? "text-right"
                      : "text-left"
                  }`}
                >
                  {col.render
                    ? col.render(row, rowIndex)
                    : // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      (row as any)[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
