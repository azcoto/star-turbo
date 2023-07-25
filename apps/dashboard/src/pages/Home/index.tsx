import { useAuthTokenStore } from '@/store/auth';
import { useCustomer, useCustomerTable } from './hooks';
import {
  ColumnDef,
  useReactTable,
  getCoreRowModel,
  flexRender,
  getPaginationRowModel,
  ColumnFiltersState,
  getFilteredRowModel,
} from '@tanstack/react-table';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { MdChevronLeft, MdChevronRight } from 'react-icons/md';
import router from '@/router';
import { intervalToDuration } from 'date-fns';
import { useState } from 'react';
import NewNodeTable from './components/new-node-table';
import OfflineNodeTable from './components/offline-node-table';

type Node = {
  namaNodelink: string | null;
  lastUpdated: Date | null;
  layanan: string | null;
  serviceline: string | null;
  uptime: number | null;
  currentKitSerialNumber: string | null;
  isOnline: boolean;
};
const columns: ColumnDef<Node>[] = [
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
    accessorKey: 'isOnline',
    header: () => <h4 className="text-white">STATUS</h4>,
    accessorFn: row => row.isOnline,
    size: 80,
    cell: ({ cell, row }) => {
      return (
        <div className="flex flex-row gap-x-4 items-center">
          <span className="relative flex h-3 w-3">
            <span
              className={`animate-ping absolute inline-flex h-full w-full rounded-full ${
                cell.getValue<boolean>() ? 'bg-green-400' : 'bg-red-400'
              } opacity-75`}
            />
            <span
              className={`relative inline-flex rounded-full h-3 w-3 ${
                cell.getValue<boolean>() ? 'bg-green-400' : 'bg-red-400'
              }`}
            />
          </span>
          <p className="text-white">{row.getValue<string>('currentKitSerialNumber')}</p>
        </div>
      );
    },
  },

  {
    accessorKey: 'layanan',
    header: () => <h4 className="text-white">LAYANAN</h4>,
    accessorFn: row => row.layanan,
    size: 80,
    cell: ({ cell }) => <p className="font-normal text-white">{cell.getValue<string>()}</p>,
  },
  {
    accessorKey: 'serviceline',
    header: () => <h4 className="text-white">SERVICE LINE</h4>,
    accessorFn: row => row.serviceline,
    size: 80,
    cell: ({ cell }) => <p className="font-normal text-white">{cell.getValue<string>()}</p>,
  },
  {
    accessorKey: 'currentKitSerialNumber',

    header: () => <></>,
    accessorFn: row => row.currentKitSerialNumber,
    cell: () => <></>,
  },
  {
    accessorKey: 'uptime',
    header: () => <h4 className="text-white">UPTIME</h4>,
    accessorFn: row => row.uptime,
    cell: ({ cell }) => {
      if (cell.getValue<number | null>() === null) return <p className="font-normal text-white">-</p>;
      const uptimeDuration = intervalToDuration({ start: 0, end: cell.getValue<number>() * 1000 });
      return (
        <p className="font-normal text-white">{`${uptimeDuration.days} DAYS ${uptimeDuration.hours} HOURS ${uptimeDuration.minutes} MINUTES`}</p>
      );
    },
  },
];

function Home() {
  const authTokenStore = useAuthTokenStore();
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const { data } = useCustomer({
    uuid: authTokenStore.userUUID,
  });

  const { data: dataTable, isLoading: customerIsLoading } = useCustomerTable({
    uuid: authTokenStore.userUUID,
  });
  const table = useReactTable({
    data: dataTable || [],
    columns,
    state: {
      columnFilters,
    },
    getFilteredRowModel: getFilteredRowModel(),
    enableFilters: true,
    enableColumnFilters: true,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="rounded-lg bg-opacity-20 bg-[#57B5DD] pb-8">
      <div className="flex flex-row gap-x-8 py-4 px-8 ">
        <NewNodeTable />
        <OfflineNodeTable />
      </div>
      <div className="flex flex-row justify-center gap-x-16 py-4 ">
        <div
          className="cursor-pointer flex flex-col justify-center items-center gap-y-4 bg-[#50C260] p-12 rounded-lg shadow-lg"
          onClick={() => {
            setColumnFilters(() => [{ id: 'isOnline', value: true }]);
          }}
        >
          {customerIsLoading && <Spinner className="w-16 h-16" />}
          {data && <h1 className="text-white">{data.nodes.up}</h1>}
          <h3 className="text-white">ONLINE</h3>
        </div>
        <div
          className="cursor-pointer flex flex-col justify-center items-center gap-y-4 bg-[#F63C30] p-12 rounded-lg shadow-lg"
          onClick={() => {
            setColumnFilters(() => [{ id: 'isOnline', value: false }]);
          }}
        >
          {customerIsLoading && <Spinner className="w-16 h-16" />}

          {data && <h1 className="text-white">{data.nodes.down}</h1>}
          <h3 className="text-white">OFFLINE</h3>
        </div>
        <div
          className="cursor-pointer flex flex-col justify-center items-center gap-y-4 bg-[#E4AD20] p-12 rounded-lg shadow-lg"
          onClick={() => {
            setColumnFilters(() => []);
          }}
        >
          {customerIsLoading && <Spinner className="w-16 h-16" />}

          {data && <h1 className="text-white">{data.nodes.up + data.nodes.down}</h1>}
          <h3 className="text-white">ACTIVE</h3>
        </div>
        <div
          className="cursor-pointer flex flex-col justify-center items-center gap-y-4 bg-[#6F6666] p-12 rounded-lg shadow-lg"
          onClick={() => {
            setColumnFilters(() => []);
          }}
        >
          {customerIsLoading && <Spinner className="w-16 h-16" />}

          {data && <h1 className="text-white">{data.nodes.inactive}</h1>}
          <h3 className="text-white">INACTIVE</h3>
        </div>
      </div>

      <div className="flex flex-col gap-2 px-8 py-4">
        <div className="flex flex-row items-center gap-2 h-12">
          <h3 className="text-white">NODELINK</h3>
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
        <div>
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
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map(row => (
                  <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                    {row.getVisibleCells().map(cell => (
                      <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
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
      </div>
    </div>
  );
}

export default Home;
