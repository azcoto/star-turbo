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
  ColumnFilter,
  ExpandedState,
} from '@tanstack/react-table';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import {
  MdChevronLeft,
  MdChevronRight,
  MdClose,
  MdFileDownload as DownloadIcon,
  MdLoop as SpinnerIcon,
} from 'react-icons/md';
import router from '@/router';
import { Fragment, useEffect, useState } from 'react';
import NewNodeTable from './components/new-node-table';
import OfflineNodeTable from './components/offline-node-table';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandGroup, CommandItem } from '@/components/ui/command';
import { getCustomerCSV } from '@/services';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { ChevronDown, ChevronRight } from 'lucide-react';

type Node = {
  namaNodelink: string | null;
  lastUpdated: Date | null;
  layanan: string | null;
  serviceline: string | null;
  currentKitSerialNumber: string | null;
  isOnline: boolean;
  active: boolean | null;
};

const columns: ColumnDef<Node>[] = [
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
    header: () => <h4 className="hidden md:block text-white">LAYANAN</h4>,
    accessorFn: row => row.layanan,
    size: 80,
    cell: ({ cell }) => <p className="hidden md:block font-normal text-white">{cell.getValue<string>()}</p>,
  },
  {
    accessorKey: 'serviceline',
    header: () => <h4 className="hidden md:block text-white">SERVICE LINE</h4>,
    accessorFn: row => row.serviceline,
    size: 80,
    cell: ({ cell }) => <p className="hidden md:block font-normal text-white">{cell.getValue<string>()}</p>,
  },
  {
    accessorKey: 'active',

    header: () => <></>,
    accessorFn: row => row.active,
    cell: () => <></>,
  },
  {
    accessorKey: 'currentKitSerialNumber',

    header: () => <></>,
    accessorFn: row => row.currentKitSerialNumber,
    cell: () => <></>,
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

type NodeFilter = {
  value: string;
  label: string;
  columnFilter: ColumnFilter;
};

const nodelinkFilters: NodeFilter[] = [
  {
    value: 'online',
    columnFilter: {
      id: 'isOnline',
      value: true,
    },
    label: 'Online',
  },
  {
    value: 'offline',
    columnFilter: {
      id: 'isOnline',
      value: false,
    },
    label: 'Offline',
  },
  {
    value: 'active',
    columnFilter: {
      id: 'active',
      value: true,
    },
    label: 'Active',
  },
  {
    value: 'inactive',
    columnFilter: {
      id: 'active',
      value: false,
    },
    label: 'Inactive',
  },
];

function Home() {
  const mqMobile = useMediaQuery('(max-width: 768px)');
  const [expanded, setExpanded] = useState<ExpandedState>({});
  const authTokenStore = useAuthTokenStore();
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [nodeFilter, setNodeFilter] = useState<NodeFilter | null>(null);
  const [filterOpen, setFilterOpen] = useState<boolean>(false);
  const [CSVLoading, setCSVLoading] = useState<boolean>(false);
  const { data } = useCustomer({
    uuid: authTokenStore.userUUID,
  });

  const [columnVisibility, setColumnVisibility] = useState<Record<string, boolean>>({
    namaNodelink: true,
    isOnline: true,
    layanan: true,
    serviceline: true,
  });

  useEffect(() => {
    console.log(mqMobile);
    if (mqMobile)
      setColumnVisibility({
        namaNodelink: true,
        isOnline: true,
        layanan: false,
        serviceline: false,
      });
  }, [mqMobile]);

  const downloadCSV = async () => {
    setCSVLoading(true);
    await getCustomerCSV(authTokenStore.userUUID);
    setCSVLoading(false);
  };

  const { data: dataTable, isLoading: customerIsLoading } = useCustomerTable({
    uuid: authTokenStore.userUUID,
  });
  const table = useReactTable({
    data: dataTable || [],
    columns,
    state: {
      columnFilters: columnFilters,
      expanded,
      columnVisibility,
    },
    onColumnVisibilityChange: setColumnVisibility,
    onExpandedChange: setExpanded,
    getFilteredRowModel: getFilteredRowModel(),
    enableFilters: true,
    enableColumnFilters: true,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="rounded-lg bg-opacity-20 bg-[#57B5DD] pb-8">
      <div className="flex flex-row gap-x-8 gap-y-8 lg:py-4 py-2 lg:px-8 px-2 flex-wrap lg:flex-nowrap ">
        <NewNodeTable />
        <OfflineNodeTable />
      </div>
      <div className="flex flex-row justify-between md:justify-center px-4 gap-x-4 lg:gap-x-16 py-4 ">
        <div className="flex flex-col justify-center items-center gap-y-1 bg-[#50C260] p-2 lg:p-12 rounded-lg shadow-lg">
          {customerIsLoading && <Spinner className="w-16 h-16" />}
          {data && (
            <p className="text-white text-lg md:text-4xl">
              <strong>{data.nodes.up}</strong>
            </p>
          )}
          <p className="text-white text-sm md:text-3xl">ONLINE</p>
        </div>
        <div className="flex flex-col justify-center items-center gap-y-1 bg-[#F63C30] p-2 lg:p-12 rounded-lg shadow-lg">
          {customerIsLoading && <Spinner className="w-16 h-16" />}

          {data && (
            <p className="text-white text-lg md:text-4xl">
              <strong>{data.nodes.down}</strong>
            </p>
          )}
          <p className="text-white text-sm md:text-3xl">OFFLINE</p>
        </div>
        <div className="flex flex-col justify-center items-center gap-y-1 bg-[#E4AD20] p-2 lg:p-12 rounded-lg shadow-lg">
          {customerIsLoading && <Spinner className="w-16 h-16" />}

          {data && (
            <p className="text-white text-lg md:text-4xl">
              <strong>{data.nodes.up + data.nodes.down}</strong>
            </p>
          )}
          <p className="text-white text-sm md:text-3xl">ACTIVE</p>
        </div>
        <div className="flex flex-col justify-center items-center gap-y-1 bg-[#6F6666] p-2 lg:p-12 rounded-lg shadow-lg">
          {customerIsLoading && <Spinner className="w-16 h-16" />}

          {data && (
            <p className="text-white text-lg md:text-4xl">
              <strong>{data.nodes.inactive}</strong>
            </p>
          )}
          <p className="text-white text-sm md:text-3xl">INACTIVE</p>
        </div>
      </div>

      <div className="flex flex-col gap-2 px-4 lg:px-8 py-4">
        <div className="flex flex-row flex-wrap justify-between items-center">
          <h3 className="text-white">NODELINK</h3>
          <div className="flex flex-row items-center gap-2 h-12">
            <Button
              variant="ghost"
              className="hover:bg-white hover:bg-opacity-10 p-0"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <MdChevronLeft className="w-8 h-8 fill-white" />
              {/* <h4 className="text-white">{'<'}</h4> */}
            </Button>
            <div className="flex items-center gap-1">
              <p className="text-white">
                Page{' '}
                <strong>
                  {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
                </strong>
              </p>
            </div>
            <Button
              variant="ghost"
              className="hover:bg-white hover:bg-opacity-10 p-0"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <MdChevronRight className="w-8 h-8 fill-white" />
            </Button>
            <Popover open={filterOpen} onOpenChange={setFilterOpen}>
              <PopoverTrigger asChild>
                <Button
                  role="combobox"
                  variant="ghost"
                  className="bg-transparent hover:bg-white hover:bg-opacity-10 px-2"
                >
                  <p className="text-white text-md">Filter : {nodeFilter ? nodeFilter.label : 'None'}</p>
                </Button>
              </PopoverTrigger>
              <PopoverContent>
                <Command>
                  <CommandGroup>
                    {nodelinkFilters.map(filter => (
                      <CommandItem
                        key={filter.value}
                        onSelect={value => {
                          const f = nodelinkFilters.find(f => f.value === value);
                          setNodeFilter(f || null);
                          setFilterOpen(false);
                          setColumnFilters(f ? [f.columnFilter] : []);
                        }}
                      >
                        {filter.label}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>
            {nodeFilter && (
              <Button
                variant="ghost"
                className="p-0 hover:bg-transparent"
                onClick={() => {
                  setNodeFilter(null);
                  setColumnFilters([]);
                }}
              >
                <MdClose className="h-6 w-6 fill-white"></MdClose>
              </Button>
            )}
          </div>
          <div className="flex flex-row items-center">
            <Button variant="outline" disabled={CSVLoading} onClick={() => downloadCSV()}>
              DOWNLOAD CSV
              {CSVLoading ? <SpinnerIcon className="h-4 w-4 animate-spin" /> : <DownloadIcon className="h-4 w-4" />}
            </Button>
          </div>
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
              {!customerIsLoading && table.getRowModel().rows?.length ? (
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
                            <p className="text-white">LAYANAN : {row.original.layanan}</p>
                            <p className="text-white">SERVICE LINE : {row.original.serviceline}</p>
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
      </div>
    </div>
  );
}

export default Home;
