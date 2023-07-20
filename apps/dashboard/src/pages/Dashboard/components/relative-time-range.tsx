import { Toggle } from '@/components/ui/toggle';
import { RelativeTimeRange } from '..';

const relativeTimeRange = [
  {
    id: 1,
    label: '15m',
    value: 15 * 60,
  },
  {
    id: 2,
    label: '1h',
    value: 60 * 60,
  },
  {
    id: 3,
    label: '3h',
    value: 3 * 60 * 60,
  },
  {
    id: 4,
    label: '12h',
    value: 12 * 60 * 60,
  },
  {
    id: 5,
    label: '24h',
    value: 24 * 60 * 60,
  },
];

type Props = {
  onToggleChange: (tr: RelativeTimeRange) => void;
  relTimeRange: RelativeTimeRange;
  isRelTimeRange: boolean;
};

const RelativeTimeRangeSelector = (props: Props) => {
  const { onToggleChange, relTimeRange, isRelTimeRange } = props;
  const relativeTimeRangeEl = relativeTimeRange.map((range, index) => {
    return (
      <Toggle
        key={index}
        defaultPressed={relTimeRange.id === relativeTimeRange[index].id}
        pressed={isRelTimeRange && relTimeRange.id === relativeTimeRange[index].id}
        className="hover:bg-[#66D1FF] data-[state=on]:bg-[#66D1FF] "
        onPressedChange={() => {
          onToggleChange(relativeTimeRange[index]);
        }}
      >
        <p className="text-white">{range.label}</p>
      </Toggle>
    );
  });

  return <div className="flex flex-row gap-x-2">{relativeTimeRangeEl}</div>;
};

export default RelativeTimeRangeSelector;
