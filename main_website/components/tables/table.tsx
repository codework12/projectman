import React from "react";

interface TableProps {
  columns: { header: string; key: string; className?: string }[];
  renderRow: (item: any) => React.ReactNode;
  data: any[];
  tableClassName?: string;
  headerClassName?: string;
  rowClassName?: string;
}

export const Table = ({
  columns,
  renderRow,
  data,
  tableClassName,
  headerClassName,
  rowClassName,
}: TableProps) => {
  return (
    <table className={
      (tableClassName ? tableClassName + " " : "") +
      "w-full mt-4 bg-card rounded-2xl shadow-lg border border-border overflow-hidden"
    }>
      <thead>
        <tr className={
          (headerClassName ? headerClassName + " " : "") +
          "bg-muted text-foreground text-base font-bold"
        }>
          {columns.map(({ header, key, className }) => (
            <th key={key} className={"py-4 px-4 " + (className || "")}>{header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data?.length < 1 && (
          <tr>
            <td className="text-muted-foreground text-base py-10 text-center" colSpan={columns.length}>
              No Data Found
            </td>
          </tr>
        )}
        {data?.length > 0 &&
          data?.map((item, id) => {
            const row = renderRow({ ...item, index: id });
            if (React.isValidElement(row) && row.type === 'tr' && rowClassName) {
              const existingClass = typeof row.props === 'object' && row.props && 'className' in row.props ? (row.props as any).className : '';
              const propsToPass = typeof row.props === 'object' && row.props ? { ...row.props, className: rowClassName + ' ' + existingClass } : { className: rowClassName };
              return React.cloneElement(row, propsToPass);
            }
            return row;
          })}
      </tbody>
    </table>
  );
};