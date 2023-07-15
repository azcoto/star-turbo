import { useAuthTokenStore } from '@/store/auth';
import { useCustomer, useCustomerTable } from './hooks';
import { ColumnDef, useReactTable, getCoreRowModel, flexRender, getPaginationRowModel } from '@tanstack/react-table';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { MdChevronLeft, MdChevronRight } from 'react-icons/md';
import router from '@/router';
import { differenceInMinutes, intervalToDuration } from 'date-fns';

type Node = {
  namaNodelink: string | null;
  lastUpdated: Date | null;
  layanan: string | null;
  serviceline: string | null;
  uptime: number | null;
  currentKitSerialNumber: string | null;
};
const columns: ColumnDef<Node>[] = [
  {
    accessorKey: 'namaNodelink',
    header: () => <h3 className="text-white">NAMA</h3>,
    accessorFn: row => row.namaNodelink,
    cell: ({ cell, row }) => (
      <Button
        className="px-0 hover:bg-transparent"
        variant="ghost"
        onClick={() => {
          router.navigate(`/dashboard/${row.getValue<string>('serviceline')}`);
        }}
      >
        <h4 className="text-white">{cell.getValue<string>()}</h4>
      </Button>
    ),
    size: 80,
  },
  {
    accessorKey: 'lastUpdated',
    header: () => <h3 className="text-white">ONLINE</h3>,
    accessorFn: row => row.lastUpdated,
    size: 80,
    cell: ({ cell, row }) => {
      const isOnline = differenceInMinutes(new Date(), cell.getValue<Date>()) <= 15;
      return (
        <div className="flex flex-row gap-x-4 items-center">
          <span className="relative flex h-3 w-3">
            <span
              className={`animate-ping absolute inline-flex h-full w-full rounded-full ${
                isOnline ? 'bg-green-400' : 'bg-red-400'
              } opacity-75`}
            />
            <span className={`relative inline-flex rounded-full h-3 w-3 ${isOnline ? 'bg-green-400' : 'bg-red-400'}`} />
          </span>
          <h4 className="text-white">{row.getValue<string>('currentKitSerialNumber')}</h4>
        </div>
      );
    },
  },

  {
    accessorKey: 'layanan',
    header: () => <h3 className="text-white">LAYANAN</h3>,
    accessorFn: row => row.layanan,
    size: 80,
    cell: ({ cell }) => <h4 className="font-normal text-white">{cell.getValue<string>()}</h4>,
  },
  {
    accessorKey: 'serviceline',
    header: () => <h3 className="text-white">SERVICE LINE</h3>,
    accessorFn: row => row.serviceline,
    size: 80,
    cell: ({ cell }) => <h4 className="font-normal text-white">{cell.getValue<string>()}</h4>,
  },
  {
    accessorKey: 'currentKitSerialNumber',

    header: () => <></>,
    accessorFn: row => row.currentKitSerialNumber,
    cell: () => <></>,
  },
  {
    accessorKey: 'uptime',
    header: () => <h3 className="text-white">UPTIME</h3>,
    accessorFn: row => row.uptime,
    cell: ({ cell }) => {
      if (cell.getValue<number | null>() === null) return <h4 className="font-normal">-</h4>;
      const uptimeDuration = intervalToDuration({ start: 0, end: cell.getValue<number>() * 1000 });
      return (
        <h4 className="font-normal text-white">{`${uptimeDuration.days} DAYS ${uptimeDuration.hours} HOURS ${uptimeDuration.minutes} MINUTES`}</h4>
      );
    },
  },
];

function Home() {
  const authTokenStore = useAuthTokenStore();

  const { data } = useCustomer({
    uuid: authTokenStore.userUUID,
  });

  const { data: dataTable, isLoading: customerIsLoading } = useCustomerTable({
    uuid: authTokenStore.userUUID,
  });

  const table = useReactTable({
    data: dataTable || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className=" rounded-lg bg-opacity-20 bg-[#57B5DD]">
      <div className="flex flex-row justify-center gap-x-8 py-4 ">
        <div className="flex flex-col justify-center items-center gap-y-4 bg-[#50C260] p-12 rounded-lg shadow-lg">
          {customerIsLoading && <Spinner className="w-16 h-16" />}
          {data && <h1 className="text-white">{data.nodes.up}</h1>}
          <h3 className="text-white">ONLINE</h3>
        </div>
        <div className="flex flex-col justify-center items-center gap-y-4 bg-[#F63C30] p-12 rounded-lg shadow-lg">
          {customerIsLoading && <Spinner className="w-16 h-16" />}

          {data && <h1 className="text-white">{data.nodes.down}</h1>}
          <h3 className="text-white">OFFLINE</h3>
        </div>
        <div className="flex flex-col justify-center items-center gap-y-4 bg-[#E4AD20] p-12 rounded-lg shadow-lg">
          {customerIsLoading && <Spinner className="w-16 h-16" />}

          {data && <h1 className="text-white">{data.nodes.inactive}</h1>}
          <h3 className="text-white">INACTIVE</h3>
        </div>
      </div>

      <div className="flex flex-col gap-2 p-4">
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
                      <h3>Loading...</h3>
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
