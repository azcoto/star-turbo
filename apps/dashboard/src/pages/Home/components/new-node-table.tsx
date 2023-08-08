import router from '@/router';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  ExpandedState,
  getExpandedRowModel,
} from '@tanstack/react-table';
import { format } from 'date-fns';
import { useCustomerTable } from '../hooks';
import { useAuthTokenStore } from '@/store/auth';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Spinner } from '@/components/ui/spinner';
import { Fragment, useEffect, useState } from 'react';
import { ChevronRight, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useMediaQuery } from '@/pages/hooks/useMediaQuery';

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
    accessorFn: row => row.serviceline,
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
    accessorFn: row => row.currentKitSerialNumber,
  },

  {
    accessorKey: 'startDate',
    header: () => (
      <div className="md:block">
        <h4 className="text-white">START DATE</h4>
      </div>
    ),
    accessorFn: row => row.startDate,
    cell: ({ cell }) => {
      if (cell.getValue<Date | null>() === null) return <p className="font-normal text-white">-</p>;
      const displayDate = format(cell.getValue<Date>(), 'dd/MM/yyyy');
      return (
        <div className="md:block flex flex-row items-center">
          <p className="font-normal text-white ">{displayDate}</p>
        </div>
      );
    },
  },
  {
    accessorKey: 'expandIcon',
    header: () => <></>,
    cell: ({ row }) => (
      <Button
        variant="ghost"
        className="rounded-full p-1 md:hidden"
        onClick={() => {
          row.toggleExpanded();
        }}
      >
        {row.getIsExpanded() ? (
          <ChevronDown size={18} className="stroke-white" />
        ) : (
          <ChevronRight size={18} className="stroke-white" />
        )}
      </Button>
    ),
  },
];

const NewNodeTable = () => {
  const mqMobile = useMediaQuery('(max-width: 768px)');

  const [columnVisibility, setColumnVisibility] = useState<Record<string, boolean>>({
    startDate: true,
    serviceline: false,
    currentKitSerialNumber: false,
  });

  const authTokenStore = useAuthTokenStore();
  const [expanded, setExpanded] = useState<ExpandedState>({});
  const { data } = useCustomerTable({
    uuid: authTokenStore.userUUID,
  });
  const formattedDateEl = (sDate: Date | null) => {
    if (!sDate) return '-';
    const displayDate = format(sDate, 'dd/MM/yyyy');
    return displayDate;
  };

  useEffect(() => {
    console.log(mqMobile);
    if (mqMobile)
      setColumnVisibility({
        startDate: false,
        serviceline: false,
        currentKitSerialNumber: false,
      });
  }, [mqMobile]);

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
    state: {
      expanded,
      columnVisibility,
    },
    onColumnVisibilityChange: setColumnVisibility,
    onExpandedChange: setExpanded,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
  });

  return (
    <div className="flex flex-col gap-4 w-full">
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
              <Fragment key={row.id}>
                <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                  {row.getVisibleCells().map(cell => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
                {row.getIsExpanded() && (
                  <TableRow key={1000 + row.id}>
                    <td key={2000 + row.id} colSpan={3} className="px-2">
                      <div className="flex flex-col gap-2">
                        <p className="text-white">START DATE : {formattedDateEl(row.original.startDate)}</p>
                      </div>
                    </td>
                  </TableRow>
                )}
              </Fragment>
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
