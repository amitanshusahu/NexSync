import { flexRender, type Table } from "@tanstack/react-table";
import { Pagination } from "./Pagination";

interface TanstackTableProps<T> {
  table: Table<T>;
  paginatedRows: ReturnType<Table<T>["getRowModel"]>["rows"];
  pageIndex: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  height?: string; // e.g. 'calc(100vh - 300px)'
  className?: string;
  isLoading?: boolean;
  isError?: boolean;
  isEmpty?: boolean;
}

export function TanstackTable<T>({
  table,
  paginatedRows,
  pageIndex,
  pageSize,
  onPageChange,
  onPageSizeChange,
  height = "calc(100vh - 320px)",
  className = "",
  isLoading,
  isError,
  isEmpty = false,
}: TanstackTableProps<T>) {
  return (
    <div className={`overflow-x-auto ${className}`}>
      <div
        className="overflow-y-auto no-scrollbar"
        style={{ maxHeight: height }}
      >
        {
          isEmpty ? (
            <div className="w-full h-full mt-12 flex flex-col gap-4 items-center justify-center">
              <img src="/empty.png" alt="No data" className="mx-auto mb-2 h-[300px]" />
              <span className="text-gray-500 text-sm">Looks Like There Noting Today!!</span>
            </div>
          )
            : (
              <table className="w-full border-collapse">
                <thead className="sticky top-0 z-10 bg-secondary-light">
                  {table.getHeaderGroups().map(headerGroup => (
                    <tr key={headerGroup.id} >
                      {headerGroup.headers.map(header => (
                        <th
                          key={header.id}
                          className="py-3 px-4 text-primary-light text-xs text-left"
                        >
                          {flexRender(header.column.columnDef.header, header.getContext())}
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                {
                  (
                    <tbody>
                      {isLoading ? (
                        <>
                          {Array.from({ length: 5 }).map((_, idx) => (
                            <tr key={`loading-row-${idx}`}>
                              <td colSpan={table.getAllColumns().length} className="pt-2 text-center">
                                <div className="animate-pulse">
                                  <div className={`h-8 bg-secondary-light/40 rounded w-full mx-auto`}></div>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </>
                      ) : null}

                      {
                        isError ? (
                          <tr>
                            <td colSpan={table.getAllColumns().length} className="py-4 px-6 text-center text-red-600">
                              Error loading data
                            </td>
                          </tr>
                        ) : null
                      }

                      {paginatedRows.map((row, i) => (
                        <tr key={row.id} className={`${i % 2 === 0 ? "bg-white" : "bg-gray-50"}`}>
                          {row.getVisibleCells().map(cell => (
                            <td key={cell.id} className="p-4 text-xs text-left">
                              {flexRender(cell.column.columnDef.cell, cell.getContext())}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  )
                }
              </table>
            )
        }
      </div >

      {
        isLoading || isError || isEmpty ? null : (
          <div className="mt-4">
            <Pagination
              currentPage={pageIndex}
              totalItems={table.getFilteredRowModel().rows.length}
              pageSize={pageSize}
              onPageChange={onPageChange}
              onPageSizeChange={onPageSizeChange}
            />
          </div>
        )
      }
    </div >
  );
}
