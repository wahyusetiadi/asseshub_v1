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
      <div className="p-10 text-center text-sm font-medium text-slate-500">
        <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
        Loading...
      </div>
    );
  }

  if (!data.length) {
    return <div className="p-10 text-center text-sm font-medium text-slate-500">{emptyMessage}</div>;
  }

  return (
    <div className="max-w-full overflow-x-auto">
      <table className="w-full text-left">
        <thead className="border-b border-slate-200 bg-slate-50 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">
          <tr>
            {columns.map((col) => (
              <th
                key={String(col.key)}
                className={`truncate whitespace-nowrap px-5 py-4 sm:px-6 ${
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

        <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
          {data.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className="transition hover:bg-indigo-50/40"
            >
              {columns.map((col) => (
                <td
                  key={String(col.key)}
                  className={`overflow-hidden truncate whitespace-nowrap px-5 py-4 sm:px-6 ${
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
