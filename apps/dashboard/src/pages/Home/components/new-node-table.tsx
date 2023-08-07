import router from '@/router';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { format } from 'date-fns';
import { useCustomerTable } from '../hooks';
import { useAuthTokenStore } from '@/store/auth';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Spinner } from '@/components/ui/spinner';

type NewNode = {
  namaNodelink: string | null;
  lastUpdated: Date | null;
  layanan: string | null;
  serviceline: string | null;
  uptime: number | null;
  startDate: Date | null;
  currentKitSerialNumber: string | null;
  isOnline: boolean;
};

const columns: ColumnDef<NewNode>[] = [
  {
    accessorKey: 'namaNodelink',
    header: () => <h4 className="text-white">NAMA</h4>,
    accessorFn: row => row.namaNodelink,
    cell: ({ cell, row }) => (
      <div
        className=""
        onClick={() => {
          router.navigate(`/dashboard/${row.getValue<string>('serviceline')}`);
        }}
      >
        <p className="text-white">{cell.getValue<string>()}</p>
      </div>
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
    accessorKey: 'currentKitSerialNumber',

    header: () => <></>,
    accessorFn: row => row.currentKitSerialNumber,
    cell: () => <></>,
  },

  {
    accessorKey: 'startDate',
    header: () => (
      <div className="hidden lg:hidden">
        <h4 className="text-white">START DATE</h4>
      </div>
    ),
    accessorFn: row => row.startDate,
    cell: ({ cell }) => {
      if (cell.getValue<Date | null>() === null) return <p className="font-normal text-white">-</p>;
      const displayDate = format(cell.getValue<Date>(), 'dd/MM/yyyy');
      return (
        <div className="hidden lg:hidden">
          <p className="font-normal text-white ">{displayDate}</p>;
        </div>
      );
    },
  },
];

const NewNodeTable = () => {
  const authTokenStore = useAuthTokenStore();

  const { data } = useCustomerTable({
    uuid: authTokenStore.userUUID,
  });

  const table = useReactTable({
    data: data ?? [],
    columns,
    initialState: {
      sorting: [
        {
          id: 'startDate',
          desc: true,
        },
      ],
      pagination: {
        pageSize: 5,
      },
    },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="flex flex-col gap-4 lg:basis-1/2 w-full">
      <div className="flex flex-row justify-between items-center h-12">
        <h3 className="text-white">NEW NODELINK</h3>
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
  );
};

export default NewNodeTable;
