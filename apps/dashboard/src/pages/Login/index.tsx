import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { ErrorMessage } from '@hookform/error-message';
import { Eye, EyeOff } from 'lucide-react';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Toaster } from '@/components/ui/toaster';
import { useToast } from '@/components/ui/use-toast';
import { useLogin } from './hooks';
import { AppError } from '@/lib/AppError';
import LogoStarspace from '@/assets/logo-starspace.png';

const formSchema = z.object({
  username: z.string().nonempty('Username could not be empty').min(2, {
    message: 'Username must be at least 2 characters.',
  }),
  password: z.string().nonempty('Password could not be empty').min(6, {
    message: 'Password must be at least 6 characters.',
  }),
});

type FormType = z.infer<typeof formSchema>;

const LoginPage = () => {
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const form = useForm<FormType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  const passwordState = form.watch('password');

  const onLoginSuccess = () => {
    navigate('/');
  };

  const onLoginError = (err: AppError) => {
    toast({
      variant: 'destructive',
      title: err.title,
      description: err.description,
      duration: 3000,
    });
  };

  const [doLogin, { isLoading }] = useLogin({ onSuccess: onLoginSuccess, onError: onLoginError });

  const onSubmit = (values: FormType) => {
    doLogin(values);
  };

  return (
    <main className="flex flex-col h-screen justify-center items-center bg-cover bg-[url('assets/bg-landing.jpg')]">
      <Toaster />
      <div className="flex flex-col bg-gradient-to-br from-[#439DC4] to-transparent rounded-lg xl:w-3/12 py-4 px-12 gap-4">
        <div className="flex flex-col justify-center items-center ">
          <img src={LogoStarspace} alt="logo" className="h-16 w-64" />
          <h3 className="text-white font-normal">Dashboard</h3>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="flex flex-col gap-y-2">
              <p className="text-white">Username</p>
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input disabled={isLoading} autoFocus {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <ErrorMessage
                errors={form.formState.errors}
                name="username"
                render={({ message }) => <p className="text-rose-400 text-xs">{message}</p>}
              />
              <p className="text-white">Password</p>
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="relative flex items-center">
                        <Input disabled={isLoading} type={showPassword ? 'text' : 'password'} {...field} />
                        {passwordState.length !== 0 && (
                          <div
                            className="absolute right-0 top-0 bottom-0 flex items-center px-4 cursor-pointer"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? (
                              <Eye className="stroke-gray-500" />
                            ) : (
                              <EyeOff className="stroke-gray-500" />
                            )}
                          </div>
                        )}
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />
              <ErrorMessage
                errors={form.formState.errors}
                name="password"
                render={({ message }) => <p className="text-rose-400 text-xs">{message}</p>}
              />
            </div>
            <div className="flex flex-col">
              <Button type="submit" className="bg-[#046A96]" disabled={isLoading}>
                <div className="flex flex-row justify-center items-center">
                  {/* to-do add spinner loading */}
                  <p className="text-white">{isLoading ? 'Logging in ...' : 'Login'}</p>
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
