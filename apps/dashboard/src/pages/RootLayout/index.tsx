import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useAuthTokenStore } from '@/store/auth';
import { Outlet, useNavigate } from 'react-router-dom';
import LogoStarspace from '@/assets/logo-starspace.png';
import BackgroundImage from '@/assets/bg-landing.jpg';
import { getInitials } from '@/lib/utils';
import { ReactNode } from 'react';
import SearchNode from './searchNode';

type Props = {
  children: ReactNode;
};

function RootLayout(_props: Props) {
  const authTokenStore = useAuthTokenStore();

  const navigate = useNavigate();

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

      <div className="flex flex-col rounded-lg shadow-lg px-6 pb-8 ">
        <div className="flex flex-row  items-center py-4 mb-4">
          <div className="flex-grow basis-0">
            <img src={LogoStarspace} alt="logo" className="w-64 h-14 cursor-pointer" onClick={() => navigate('/')} />
          </div>
          {/*
           * TO DO: Refactor this to a component
           */}
          <div className="invisible flex-grow md:visible basis-0">
            <SearchNode />
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
