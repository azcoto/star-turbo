import { AppError } from '@/lib/AppError';
import postLogin from '@/services/login';
import { useMutation } from '@tanstack/react-query';

type LoginHookParam = {
  onSuccess: () => void;
  onError: (err: AppError) => void;
};

export const useLogin = ({ onSuccess, onError }: LoginHookParam) => {
  const {
    mutate: doLogin,
    isLoading,
    isError,
  } = useMutation({
    mutationFn: postLogin,
    onSuccess,
    onError,
  });

  return [doLogin, { isLoading, isError }] as const;
};
