import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const LoginPage = () => {
  return (
    <main className="flex flex-col h-screen justify-center items-center bg-cover bg-[url('assets/bg-landing.jpg')]">
      <div className="flex flex-col bg-gradient-to-br from-[#439DC4] to-transparent rounded-lg w-1/3 h-1/2 py-4 px-12 justify-between">
        <div className="flex flex-col justify-center items-center ">
          <img src="src/assets/logo-starspace.png" alt="logo" className="h-16 w-64" />
          <h3 className="text-white font-normal">Dashboard</h3>
        </div>
        <div className="flex flex-col">
          <p className="text-white">Username</p>
          <Input placeholder="Username" />
          <p className="text-white">Password</p>
          <Input placeholder="Password" />
        </div>
        <div className="flex flex-col">
          <Button className="bg-[#046A96]">
            <p className="text-white">Login</p>
          </Button>
        </div>
      </div>
    </main>
  );
};

export default LoginPage;
