import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useAuthTokenStore } from '@/store/auth';
import { Outlet, useNavigate } from 'react-router-dom';
import LogoStarspace from '@/assets/logo-starspace.png';
import BackgroundImage from '@/assets/bg-landing.jpg';

type Props = {
  children: React.ReactNode; // 👈️ type children
};

function RootLayout(_props: Props) {
  const authTokenStore = useAuthTokenStore();
  // const { data } = useCustomer({
  //   uuid: authTokenStore.userUUID,
  // });

  const navigate = useNavigate();

  const logout = () => {
    authTokenStore.logout();
    navigate('/login');
  };
  console.log();
  return (
    <main className="px-8 pt-8 h-screen">
      {/* Image with opacity */}
      <div className="fixed inset-0 -z-10">
        <img src={BackgroundImage} alt="background" className="object-cover w-full h-full" />
        <div className="fixed inset-0 bg-black opacity-80"></div>
      </div>

      <div className="flex flex-col rounded-lg shadow-lg px-6 ">
        <div className="flex flex-row  items-center py-4 mb-4">
          {/* <Button
            variant="ghost"
            onClick={() => {
              navigate('/');
            }}
          >
            <h4 className="text-xl font-bold">Home</h4>
          </Button> */}
          <div className="flex-grow basis-0">
            <img src={LogoStarspace} alt="logo" className="w-64 h-14" />
          </div>
          <div className="flex-grow basis-0">
            <Input type="search" placeholder="Search Dashboard ..." />
          </div>
          <div className="flex-grow basis-0 flex flex-row justify-end">
            <Popover>
              <PopoverTrigger asChild>
                <Avatar>
                  <AvatarFallback>TS</AvatarFallback>
                </Avatar>
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
