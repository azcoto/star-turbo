import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import postLogin from '@/services/login';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { useAuthTokenStore } from '@/store/auth';
import { useNavigate } from 'react-router-dom';

const formSchema = z.object({
  username: z.string().min(2, {
    message: 'Username must be at least 2 characters.',
  }),
  password: z.string().min(6, {
    message: 'Password must be at least 6 characters.',
  }),
});

type FormType = z.infer<typeof formSchema>;

const LoginPage = () => {
  const authTokenStore = useAuthTokenStore();
  const navigate = useNavigate();
  const form = useForm<FormType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  const { mutate: doLogin, isLoading } = useMutation({
    mutationFn: postLogin,
    onSuccess: data => {
      authTokenStore.setAccessToken(data.data.accessToken);
      //navigate to '/dashboard'
      navigate('/dashboard');
    },
  });

  const onSubmit = (values: FormType) => {
    doLogin(values);
  };
  return (
    <main className="flex flex-col h-screen justify-center items-center bg-cover bg-[url('assets/bg-landing.jpg')]">
      <div className="flex flex-col bg-gradient-to-br from-[#439DC4] to-transparent rounded-lg w-1/3 h-1/2 py-4 px-12 gap-4">
        <div className="flex flex-col justify-center items-center ">
          <img src="src/assets/logo-starspace.png" alt="logo" className="h-16 w-64" />
          <h3 className="text-white font-normal">Dashboard</h3>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="flex flex-col">
              <p className="text-white">Username</p>
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input autoFocus placeholder="username" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <p className="text-white">Password</p>
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="password" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <div className="flex flex-col">
              <Button type="submit" className="bg-[#046A96]" disabled={isLoading}>
                <div className="flex flex-row justify-center items-center">
                  {/* to-do add spinner loading */}
                  <p className="text-white">Login</p>
                </div>
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </main>
  );
};

export default LoginPage;
