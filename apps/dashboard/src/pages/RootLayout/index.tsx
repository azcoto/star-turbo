import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useAuthTokenStore } from '@/store/auth';
import { Outlet, useNavigate } from 'react-router-dom';
import { useCustomer } from '../Home/hooks';
import { useLocation } from 'react-router-dom';
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

  return (
    <main className="px-8 pt-8">
      <div className="flex flex-col border rounded-lg shadow-lg px-6">
        <div className="flex flex-row justify-between items-center py-4 border-b">
          <Button
            variant="ghost"
            onClick={() => {
              navigate('/');
            }}
          >
            <h4 className="text-xl font-bold">Home</h4>
          </Button>
          <Input type="search" placeholder="Search Dashboard ..." className="w-2/6" />
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
        <Outlet />
      </div>
    </main>
  );
}

export default RootLayout;
