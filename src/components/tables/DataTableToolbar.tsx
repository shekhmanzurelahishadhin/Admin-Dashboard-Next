import { Table } from "@tanstack/react-table";
import Input from "../form/input/InputField";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  searchKey?: string;
}

export function DataTableToolbar<TData>({
  table,
  searchKey,
}: DataTableToolbarProps<TData>) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        {searchKey && (
          <Input
            placeholder={`Search...`}
            value={
              (table.getColumn(searchKey)?.getFilterValue() as string) ?? ""
            }
            onChange={(event) =>
              table.getColumn(searchKey)?.setFilterValue(event.target.value)
            }
            className="h-10 w-[250px] lg:w-[300px] border-stroke bg-white dark:border-strokedark dark:bg-boxdark"
          />
        )}
      </div>
    </div>
  );
}