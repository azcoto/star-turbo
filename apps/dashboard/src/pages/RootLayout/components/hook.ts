import { AppError } from '@/lib/AppError';
import postChangePassword from '@/services/change-password';
import { useMutation } from '@tanstack/react-query';

type ChangePasswordHookParam = {
  onSuccess: () => void;
  onError: (err: AppError) => void;
};

export const useChangePassword = ({ onSuccess, onError }: ChangePasswordHookParam) => {
  const {
    mutate: doChangePassword,
    isLoading,
    isError,
  } = useMutation({
    mutationFn: postChangePassword,
    onSuccess,
    onError,
  });

  return [doChangePassword, { isLoading, isError }] as const;
};
