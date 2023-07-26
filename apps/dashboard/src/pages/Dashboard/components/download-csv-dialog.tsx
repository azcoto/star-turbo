import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { getRawData } from '@/services';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

type Props = {
  serviceLine: string;
  setCsvOpen: (open: boolean) => void;
};

const DownloadCSVDialog = (prop: Props) => {
  const { serviceLine, setCsvOpen } = prop;
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [selectedMonth, setSelectedMonth] = useState<string>((new Date().getMonth() + 1).toString());
  const [selectedYear, setSelectedYear] = useState<string>(new Date().getFullYear().toString());

  const downloadCSV = async () => {
    if (serviceLine === '') return;
    setIsLoading(true);
    await getRawData({ serviceLine: serviceLine, month: Number(selectedMonth), year: Number(selectedYear) });
    setIsLoading(false);
    setCsvOpen(false);
  };

  return (
    <div className="flex flex-col px-4 py-4 gap-2">
      <div className="flex flex-row gap-2 items-center justify-start">
        <Select defaultValue={selectedMonth} onValueChange={value => setSelectedMonth(value)}>
          <SelectTrigger className="w-[60px]">
            <SelectValue placeholder="Select Month" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Month</SelectLabel>
              {Array.from({ length: 12 })
                .map((_, i) => i + 1)
                .map(month => (
                  <SelectItem key={month} value={month.toString()}>
                    {month}
                  </SelectItem>
                ))}
            </SelectGroup>
          </SelectContent>
        </Select>

        <Select defaultValue={selectedYear} onValueChange={value => setSelectedYear(value)}>
          <SelectTrigger className="w-[80px]">
            <SelectValue placeholder="Select Month" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Year</SelectLabel>
              {Array.from({ length: 10 })
                .map((_, i) => i + 2023)
                .map(year => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <Button className="rounded-md bg-sky-400 px-4 py-4" onClick={downloadCSV} disabled={isLoading}>
        Download
      </Button>
    </div>
  );
};

export default DownloadCSVDialog;
