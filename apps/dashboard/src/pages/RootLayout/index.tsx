import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useAuthTokenStore } from '@/store/auth';
import { Outlet, useNavigate } from 'react-router-dom';
import LogoStarspace from '@/assets/logo-starspace.png';
import BackgroundImage from '@/assets/bg-landing.jpg';
import { cn, getInitials } from '@/lib/utils';
import { ReactNode, useState } from 'react';
import { useCustomerCombo } from '../Home/hooks';
import { Command, CommandInput, CommandItem, CommandEmpty } from '@/components/ui/command';
import { CheckIcon } from 'lucide-react';
import { CommandList } from 'cmdk';
import router from '@/router';
import MiniOnlineIndicator from '../Dashboard/components/mini-online-indicator';

type Props = {
  children: ReactNode;
};

function RootLayout(_props: Props) {
  const authTokenStore = useAuthTokenStore();
  const [open, setOpen] = useState(false);
  const [serviceLine, setServiceLine] = useState<string | null>(null);

  const navigate = useNavigate();

  const { data } = useCustomerCombo({
    uuid: authTokenStore.userUUID,
  });

  const logout = () => {
    authTokenStore.logout();
    navigate('/login');
  };

  return (
    <main className="px-8 pt-8 h-screen">
      {/* Image with opacity */}
      <div className="fixed inset-0 -z-10">
        <img src={BackgroundImage} alt="background" className="object-cover w-full h-full" />
        <div className="fixed inset-0 bg-black opacity-80"></div>
      </div>

      <div className="flex flex-col rounded-lg shadow-lg px-6 ">
        <div className="flex flex-row  items-center py-4 mb-4">
          <div className="flex-grow basis-0">
            <img src={LogoStarspace} alt="logo" className="w-64 h-14 cursor-pointer" onClick={() => navigate('/')} />
          </div>
          <div className="flex-grow basis-0">
            {data && (
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button variant="outline" role="combobox" aria-expanded={open} className="w-full justify-between">
                    {serviceLine ? data.find(node => node.serviceline === serviceLine)?.namaNodelink : 'Cari Node...'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[600px] p-0">
                  {/* <Command shouldFilter={serviceLine && serviceLine.length > 2 ? true : false}> */}
                  <Command>
                    <CommandInput placeholder="Search by name..." className="h-9" />
                    <CommandList
                      style={{
                        maxHeight: '300px',
                      }}
                    >
                      <CommandEmpty>No site found.</CommandEmpty>
                      {/* <CommandGroup> */}
                      {data.map(data => (
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
                            className={cn(
                              'ml-auto h-4 w-4',
                              serviceLine === data.serviceline ? 'opacity-100' : 'opacity-0'
                            )}
                          />
                        </CommandItem>
                      ))}
                      {/* </CommandGroup> */}
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            )}
          </div>
          <div className="flex-grow basis-0 flex flex-row justify-end items-center">
            <Popover>
              <PopoverTrigger asChild>
                <div className="flex flex-row items-center gap-x-2 cursor-pointer">
                  <p className="uppercase text-white ">{authTokenStore.fullname}</p>
                  <Avatar className="items-center">
                    <AvatarFallback className="w-8 h-8">{getInitials(authTokenStore.fullname)}</AvatarFallback>
                  </Avatar>
                </div>
              </PopoverTrigger>
              <PopoverContent side="bottom" className="w-32">
                <div className="flex flex-col gap-y-2 bg-white">
                  <Button variant="ghost" onClick={logout}>
                    Log Out
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
        <Outlet />
      </div>
    </main>
  );
}

export default RootLayout;
