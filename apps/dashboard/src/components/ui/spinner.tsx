import { cn } from '@/lib/utils';
import { RiLoader4Fill } from 'react-icons/ri';

export function Spinner({ className }: { className?: string }) {
  return <RiLoader4Fill className={cn('animate-spin opacity-80 fill-[#66D1FF]', className)} />;
}
