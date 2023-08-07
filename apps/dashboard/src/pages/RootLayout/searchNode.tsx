import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useAuthTokenStore } from '@/store/auth';
import { useCustomerCombo } from '../Home/hooks';
import { useState } from 'react';
import { Command, CommandEmpty, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import router from '@/router';
import MiniOnlineIndicator from '../Dashboard/components/mini-online-indicator';
import { CheckIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

type ComboNode = {
  namaNodelink: string | null;
  serviceline: string | null;
  currentKitSerialNumber: string | null;
  isOnline: boolean;
};

const SearchNode = () => {
  const authTokenStore = useAuthTokenStore();
  const [open, setOpen] = useState(false);
  const [serviceLine, setServiceLine] = useState<string | null>(null);
  const [filteredCustomer, setFilteredCustomer] = useState<ComboNode[] | []>([]);

  const { data } = useCustomerCombo({
    uuid: authTokenStore.userUUID,
  });

  const onSearchChanged = (evt: React.ChangeEvent<HTMLInputElement>) => {
    if (evt.currentTarget.value.length > 2 && data && data.length > 0) {
      const filtered = data.filter(node => {
        const nameFilter = node.namaNodelink?.toLowerCase().includes(evt.currentTarget.value.toLowerCase());
        const kitFilter = node.currentKitSerialNumber?.toLowerCase().includes(evt.currentTarget.value.toLowerCase());
        const serviceLineFilter = node.serviceline?.toLowerCase().includes(evt.currentTarget.value.toLowerCase());
        return nameFilter || kitFilter || serviceLineFilter;
      });
      setFilteredCustomer(filtered);
    } else {
      setFilteredCustomer([]);
    }
  };

  return (
    <>
      data && (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" role="combobox" aria-expanded={open} className="w-full justify-between">
            {serviceLine && data ? data.find(node => node.serviceline === serviceLine)?.namaNodelink : 'Cari Node...'}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[600px] p-0">
          <Command shouldFilter={false}>
            <CommandInput placeholder="Search by name..." className="h-9" onChangeCapture={onSearchChanged} />
            <CommandList
              style={{
                maxHeight: '300px',
              }}
            >
              <CommandEmpty>No site found.</CommandEmpty>
              {filteredCustomer.map(data => (
                <CommandItem
                  key={data.serviceline}
                  onSelect={() => {
                    setServiceLine(data.serviceline);
                    setOpen(false);
                    router.navigate(`/dashboard/${data.serviceline}`);
                  }}
                >
                  {data.namaNodelink} - {data.currentKitSerialNumber}
                  <div className="ml-4">
                    <MiniOnlineIndicator isOnline={data.isOnline} />
                  </div>
                  <CheckIcon
                    className={cn('ml-auto h-4 w-4', serviceLine === data.serviceline ? 'opacity-100' : 'opacity-0')}
                  />
                </CommandItem>
              ))}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      )
    </>
  );
};

export default SearchNode;
