import { Table } from "@tanstack/react-table";
import Input from "../form/input/InputField";
import Button from "../ui/button/Button";
import { DownloadIcon, CopyIcon, FileIcon, GridIcon } from "../../icons/index"; // Adjust import path

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  searchKey?: string;
}

export function DataTableToolbar<TData>({
  table,
  searchKey,
}: DataTableToolbarProps<TData>) {
  
    const handleExportExcel = () => {
    // Excel export logic
    console.log("Export to Excel");
  };

  const handleExportCSV = () => {
    // CSV export logic
    const headers = table.getAllColumns()
      .filter(column => column.getIsVisible())
      .map(column => column.columnDef.header as string);
    
    const data = table.getRowModel().rows.map(row => 
      table.getAllColumns()
        .filter(column => column.getIsVisible())
        .map(column => row.getValue(column.id))
    );
    
    const csvContent = [
      headers.join(','),
      ...data.map(row => row.join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'data.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleExportPDF = () => {
    // PDF export logic
    console.log("Export to PDF");
  };

  const handleCopy = () => {
    // Copy to clipboard logic
    const headers = table.getAllColumns()
      .filter(column => column.getIsVisible())
      .map(column => column.columnDef.header as string);
    
    const data = table.getRowModel().rows.map(row => 
      table.getAllColumns()
        .filter(column => column.getIsVisible())
        .map(column => row.getValue(column.id))
    );
    
    const textContent = [
      headers.join('\t'),
      ...data.map(row => row.join('\t'))
    ].join('\n');
    
    navigator.clipboard.writeText(textContent)
      .then(() => {
        console.log("Copied to clipboard");
        // You can add a toast notification here
      })
      .catch(err => {
        console.error("Failed to copy: ", err);
      });
  };

  return (
    <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
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
      
      {/* Export Buttons with Icons */}
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handleCopy}
          className="h-10 border-stroke bg-white px-3 text-sm font-medium hover:bg-gray-50 dark:border-strokedark dark:bg-boxdark dark:hover:bg-gray-800"
        >
          <CopyIcon className="" />
          Copy
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={handleExportCSV}
          className="h-10 border-stroke bg-white px-3 text-sm font-medium hover:bg-gray-50 dark:border-strokedark dark:bg-boxdark dark:hover:bg-gray-800"
        >
          <FileIcon className="" />
          CSV
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={handleExportExcel}
          className="h-10 border-stroke bg-white px-3 text-sm font-medium hover:bg-gray-50 dark:border-strokedark dark:bg-boxdark dark:hover:bg-gray-800"
        >
          <GridIcon className="" />
          Excel
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={handleExportPDF}
          className="h-10 border-stroke bg-white px-3 text-sm font-medium hover:bg-gray-50 dark:border-strokedark dark:bg-boxdark dark:hover:bg-gray-800"
        >
          <DownloadIcon className="" />
          PDF
        </Button>
      </div>
    </div>
  );
}