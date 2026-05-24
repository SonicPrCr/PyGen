"use client";

interface Column<T> {
  key: string;
  label: string;
  render?: (row: T) => React.ReactNode;
}

interface AdminDataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  isLoading: boolean;
  filterValue?: string;
  onFilterChange?: (v: string) => void;
  filterPlaceholder?: string;
  emptyText?: string;
}

export function AdminDataTable<T extends { id: number }>({
  columns,
  data,
  isLoading,
  filterValue,
  onFilterChange,
  filterPlaceholder,
  emptyText,
}: AdminDataTableProps<T>) {
  return (
    <div className="space-y-4">
      {onFilterChange && (
        <input
          value={filterValue ?? ""}
          onChange={(e) => onFilterChange(e.target.value)}
          placeholder={filterPlaceholder ?? "Фильтр..."}
          className="w-full sm:w-72 px-4 py-2 rounded-lg text-sm text-white outline-none"
          style={{
            backgroundColor: "var(--color-bg-tertiary)",
            border: "1px solid var(--color-border)",
          }}
        />
      )}

      <div
        className="overflow-x-auto rounded-xl"
        style={{ border: "1px solid var(--color-border)" }}
      >
        <table className="w-full text-sm">
          <thead>
            <tr
              style={{
                backgroundColor: "var(--color-bg-tertiary)",
                borderBottom: "1px solid var(--color-border)",
              }}
            >
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="text-left px-4 py-3 font-semibold whitespace-nowrap"
                  style={{ color: "var(--color-text-muted)" }}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i}>
                  {columns.map((col) => (
                    <td key={col.key} className="px-4 py-3">
                      <div
                        className="h-4 rounded animate-pulse"
                        style={{ backgroundColor: "rgba(255,255,255,0.05)" }}
                      />
                    </td>
                  ))}
                </tr>
              ))
            ) : data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-4 py-12 text-center"
                  style={{ color: "var(--color-text-muted)" }}
                >
                  {emptyText ?? "Нет данных"}
                </td>
              </tr>
            ) : (
              data.map((row) => (
                <tr
                  key={row.id}
                  style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className="px-4 py-3"
                      style={{ color: "var(--color-text-secondary)" }}
                    >
                      {col.render
                        ? col.render(row)
                        : String((row as Record<string, unknown>)[col.key] ?? "—")}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
