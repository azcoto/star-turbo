import { Button } from '@/components/ui/button';
import router from '@/router';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useCustomerTableOfflineFiltered } from '../hooks';
import { useAuthTokenStore } from '@/store/auth';
import { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Spinner } from '@/components/ui/spinner';
import { format, getYear } from 'date-fns';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { MdChevronLeft, MdChevronRight } from 'react-icons/md';

type NewNode = {
  namaNodelink: string | null;
  layanan: string | null;
  serviceline: string | null;
  uptime: number | null;
  currentKitSerialNumber: string | null;
  lastUpdated: Date;
  startDate: Date;
};

const columns: ColumnDef<NewNode>[] = [
  {
    accessorKey: 'namaNodelink',
    header: () => <h4 className="text-white">NAMA</h4>,
    accessorFn: row => row.namaNodelink,
    cell: ({ cell, row }) => (
      <Button
        className="px-0 hover:bg-transparent"
        variant="ghost"
        onClick={() => {
          router.navigate(`/dashboard/${row.getValue<string>('serviceline')}`);
        }}
      >
        <p className="text-white">{cell.getValue<string>()}</p>
      </Button>
    ),
    size: 80,
  },
  {
    accessorKey: 'serviceline',

    header: () => <></>,
    accessorFn: row => row.serviceline,
    cell: () => <></>,
  },
  {
    accessorKey: 'currentKitSerialNumber',
    header: () => <></>,
    accessorFn: row => row.currentKitSerialNumber,
    cell: () => <></>,
  },
  {
    accessorKey: 'lastUpdated',
    accessorFn: row => row.lastUpdated,
    header: () => <h4 className="text-white">LAST UPDATED</h4>,
    cell: ({ cell }) => {
      if (cell.getValue<Date | null>() === null) return <p className="font-normal text-white">-</p>;
      const displayDate =
        getYear(cell.getValue<Date>()) !== 1970 ? format(cell.getValue<Date>(), 'dd/MM/yyyy HH:mm:ss') : '-';
      return <p className="font-normal text-white">{displayDate}</p>;
    },
    sortDescFirst: true,
    enableSorting: true,
  },
];

type OfflineFileterMinute = {
  startMinute: number;
  endMinute: number;
};

const OfflineNodeTable = () => {
  const authTokenStore = useAuthTokenStore();
  const [offlineFilterMinute, setOfflineFilterMinute] = useState<OfflineFileterMinute>({
    startMinute: 15,
    endMinute: 60,
  });

  const selectFilterOnChange = (value: string) => {
    switch (value) {
      case '15 Minutes':
        setOfflineFilterMinute({ startMinute: 15, endMinute: 60 });
        return;
      case '1 Hours':
        setOfflineFilterMinute({ startMinute: 60, endMinute: 360 });
        return;
      case '6 Hours':
        setOfflineFilterMinute({ startMinute: 360, endMinute: 1440 });
        return;
      case '1 Days':
        setOfflineFilterMinute({ startMinute: 1440, endMinute: Infinity });
        return;
    }
  };

  const { data, isLoading } = useCustomerTableOfflineFiltered({
    uuid: authTokenStore.userUUID,
    ...offlineFilterMinute,
  });

  const table = useReactTable({
    data: data ?? [],
    columns,
    initialState: {
      pagination: {
        pageSize: 5,
      },
      sorting: [
        {
          id: 'lastUpdated',
          desc: true,
        },
      ],
    },
    enableSorting: true,
    sortDescFirst: true,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="flex flex-col gap-4 lg:basis-1/2 w-full">
      <div className="flex flex-row justify-between items-center h-12">
        <div className="flex flex-row gap-4 items-center basis-4/6">
          <h3 className="text-white">OFFLINE NODELINK</h3>
          <div className="flex flex-row gap-2">
            <Button
              variant="ghost"
              className="hover:bg-white hover:bg-opacity-10 p-0"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <MdChevronLeft className="w-8 h-8 fill-white" />
              {/* <h4 className="text-white">{'<'}</h4> */}
            </Button>
            <span className="flex items-center gap-1">
              <p className="text-white">Page</p>
              <strong className="text-white">
                {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
              </strong>
            </span>
            <Button
              variant="ghost"
              className="hover:bg-white hover:bg-opacity-10 p-0"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <MdChevronRight className="w-8 h-8 fill-white" />
            </Button>
          </div>
        </div>
        <div className="basis-2/6">
          <Select defaultValue="15 Minutes" onValueChange={value => selectFilterOnChange(value)}>
            <SelectTrigger className=" text-white">
              <SelectValue placeholder="Offline For" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>OFFLINE OVER </SelectLabel>
                <SelectItem value="15 Minutes">
                  <p>15 Minutes</p>
                </SelectItem>
                <SelectItem value="1 Hours">
                  <p>1 Hours</p>
                </SelectItem>
                <SelectItem value="6 Hours">
                  <p>6 Hours</p>
                </SelectItem>
                <SelectItem value="1 Days">
                  <p>1 Days</p>
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map(headerGroup => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map(header => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {data &&
            data.length !== 0 &&
            table.getRowModel().rows.map(row => (
              <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                {row.getVisibleCells().map(cell => (
                  <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                ))}
              </TableRow>
            ))}
          {data && data.length === 0 && (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                <div className="flex flex-col gap-4 justify-center items-center">
                  <h3 className="text-white">NO DATA</h3>
                </div>
              </TableCell>
            </TableRow>
          )}
          {isLoading && (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                <div className="flex flex-col gap-4 justify-center items-center">
                  <Spinner className="w-16 h-16" />
                  <h3 className="text-white">Loading...</h3>
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default OfflineNodeTable;
