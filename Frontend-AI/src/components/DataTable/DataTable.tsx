import "./data.table.css";

export interface ColumnConfig<T> {
  header: string;
  render: (item: T) => React.ReactNode;
}

interface DataTableProps<T> {
  data: T[];
  columns: ColumnConfig<T>[];
  onRowClick?: (item: T) => void;
    getRowKey?: (item: T, index: number) => React.Key;

}

const DataTable = <T,>({ data, columns, onRowClick, getRowKey }: DataTableProps<T>) => {
  return (
    <table className="table-objects">
      <thead>
        <tr>
          {columns.map((col, idx) => (
            <th key={idx}>{col.header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((item, rowIdx) => (
          <tr key={getRowKey ? getRowKey(item, rowIdx) : rowIdx} onClick={() => onRowClick?.(item)} className={onRowClick ? "clickable-row" : ""}>
            {columns.map((col, colIdx) => (
              <td key={colIdx}>{col.render(item)}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default DataTable;
