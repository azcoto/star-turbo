import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff } from 'lucide-react';
import { Dispatch, SetStateAction, useState } from 'react';
import { FieldErrors, useForm } from 'react-hook-form';
import { z } from 'zod';

const formSchema = z.object({
  oldPassword: z.string().nonempty('Old password cannot be empty').min(6, 'Password must be at least 6 characters'),
  newPassword: z
    .string()
    .nonempty('New password cannot be empty')
    .min(6, 'Password must be at least 6 characters')
    .regex(/^(?=.*[A-Z])(?=.*[0-9])/, 'Password must include at least one capital letter, and one numeric digit'),
  repeatPassword: z
    .string()
    .nonempty('New password cannot be empty')
    .min(6, 'Password must be at least 6 characters')
    .regex(/^(?=.*[A-Z])(?=.*[0-9])/, 'Password must include at least one capital letter, and one numeric digit'),
});

type FormType = z.infer<typeof formSchema>;

type Props = {
  open: boolean;
  closed: Dispatch<SetStateAction<boolean>>;
};

export const ChangePasswordDialog = (props: Props) => {
  const { open, closed } = props;
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showRepeatPassword, setShowRepeatPassword] = useState(false);

  const form = useForm<FormType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      oldPassword: '',
      newPassword: '',
      repeatPassword: '',
    },
  });

  const onSubmit = (values: FormType) => {
    console.log(values);
  };

  const onInvalid = (errors: FieldErrors) => {
    console.log(errors);
  };

  const oldPasswordState = form.watch('oldPassword');
  const newPasswordState = form.watch('newPassword');
  const repeatPasswordState = form.watch('repeatPassword');

  return (
    <Dialog
      open={open}
      onOpenChange={open => {
        if (!open) {
          closed(false);
        }
      }}
    >
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Change Password</DialogTitle>
          <DialogDescription>
            The password must be a minimum of 6 characters and must include at least one capital letter, and one numeric
            digit.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit, onInvalid)}>
            <div className="grid gap-4 py-4">
              <FormField
                control={form.control}
                name="oldPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="grid grid-cols-5 items-center gap-4">
                        <Label htmlFor="oldpassword" className="text-right col-span-2">
                          Old Password
                        </Label>
                        <div className="relative flex items-center col-span-3">
                          <Input
                            id="oldpassword"
                            type={showOldPassword ? 'text' : 'password'}
                            className="col-span-3"
                            {...field}
                          />
                        </div>
                        {oldPasswordState.length > 3 && (
                          <div
                            className="absolute right-4 flex items-center px-4 cursor-pointer"
                            onClick={() => setShowOldPassword(!showOldPassword)}
                          >
                            {showOldPassword ? (
                              <Eye className="stroke-gray-500"></Eye>
                            ) : (
                              <EyeOff className="stroke-gray-500" />
                            )}
                          </div>
                        )}
                      </div>
                    </FormControl>
                    <div className="grid grid-cols-5 items-center gap-4">
                      <div className="col-span-2" />
                      <div className="col-span-3">
                        <FormMessage />
                      </div>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="grid grid-cols-5 items-center gap-4">
                        <Label htmlFor="newpassword" className="text-right col-span-2">
                          New Password
                        </Label>
                        <div className="relative flex items-center col-span-3">
                          <Input
                            id="newpassword"
                            type={showNewPassword ? 'text' : 'password'}
                            className="col-span-3"
                            {...field}
                          />
                        </div>
                        {newPasswordState.length > 3 && (
                          <div
                            className="absolute right-4 flex items-center px-4 cursor-pointer"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                          >
                            {showNewPassword ? (
                              <Eye className="stroke-gray-500"></Eye>
                            ) : (
                              <EyeOff className="stroke-gray-500" />
                            )}
                          </div>
                        )}
                      </div>
                    </FormControl>
                    <div className="grid grid-cols-5 items-center gap-4">
                      <div className="col-span-2" />
                      <div className="col-span-3">
                        <FormMessage />
                      </div>
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="repeatPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="grid grid-cols-5 items-center gap-4">
                        <Label htmlFor="repeatpassword" className="text-right col-span-2">
                          Repeat Password
                        </Label>
                        <div className="relative flex items-center col-span-3">
                          <Input
                            id="repeatpassword"
                            type={showRepeatPassword ? 'text' : 'password'}
                            className="col-span-3"
                            {...field}
                          />
                        </div>
                        {repeatPasswordState.length > 3 && (
                          <div
                            className="absolute right-4 flex items-center px-4 cursor-pointer"
                            onClick={() => setShowRepeatPassword(!showRepeatPassword)}
                          >
                            {showRepeatPassword ? (
                              <Eye className="stroke-gray-500"></Eye>
                            ) : (
                              <EyeOff className="stroke-gray-500" />
                            )}
                          </div>
                        )}
                      </div>
                    </FormControl>
                    <div className="grid grid-cols-5 items-center gap-4">
                      <div className="col-span-2" />
                      <div className="col-span-3">
                        <FormMessage />
                      </div>
                    </div>
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              <Button type="submit">Save changes</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
