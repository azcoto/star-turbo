import { useAuthTokenStore } from '@/store/auth';
import { useCustomer, useCustomerTable } from './hooks';
import { ColumnDef, useReactTable, getCoreRowModel, flexRender } from '@tanstack/react-table';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import router from '@/router';

type Node = {
  namaNodelink: string | null;
  layanan: string | null;
  serviceline: string | null;
  uptime: number | null;
  currentKitSerialNumber: string | null;
  lastUpdated: Date | null;
};
const columns: ColumnDef<Node>[] = [
  {
    accessorKey: 'namaNodelink',
    header: 'Nama',
    accessorFn: row => row.namaNodelink,
    cell: ({ cell, row }) => (
      <Button
        variant="ghost"
        onClick={() => {
          router.navigate(`/dashboard/${row.getValue<string>('serviceline')}`);
        }}
      >
        {cell.getValue<string>()}
      </Button>
    ),
  },
  {
    accessorKey: 'layanan',
    header: 'Layanan',
    accessorFn: row => row.layanan,
  },
  {
    accessorKey: 'serviceline',
    header: 'Service Line',
    accessorFn: row => row.serviceline,
  },
  {
    accessorKey: 'currentKitSerialNumber',
    header: 'Serial Number',
    accessorFn: row => row.currentKitSerialNumber,
  },
  {
    accessorKey: 'uptime',
    header: 'Uptime',
    accessorFn: row => row.uptime,
  },
  {
    accessorKey: 'lastUpdated',
    header: 'Last Updated',
    accessorFn: row => row.lastUpdated,
  },
];

function Home() {
  const authTokenStore = useAuthTokenStore();

  const { data } = useCustomer({
    uuid: authTokenStore.userUUID,
  });

  const { data: dataTable } = useCustomerTable({
    uuid: authTokenStore.userUUID,
  });

  const table = useReactTable({
    data: dataTable || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <>
      {data && (
        <div className="flex flex-row justify-center gap-x-8 py-4">
          <div className="flex flex-col justify-center items-center gap-y-4 bg-emerald-500 p-12 rounded-lg shadow-lg">
            <h1>{data.nodes.up}</h1>
            <h3>ONLINE</h3>
          </div>
          <div className="flex flex-col justify-center items-center gap-y-4 bg-rose-400 p-12 rounded-lg shadow-lg">
            <h1>{data.nodes.down}</h1>
            <h3>OFFLINE</h3>
          </div>
          <div className="flex flex-col justify-center items-center gap-y-4 bg-zinc-400 p-12 rounded-lg shadow-lg">
            <h1>{data.nodes.inactive}</h1>
            <h3>INACTIVE</h3>
          </div>
        </div>
      )}

      {dataTable && (
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
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      )}
    </>
  );
}

export default Home;
