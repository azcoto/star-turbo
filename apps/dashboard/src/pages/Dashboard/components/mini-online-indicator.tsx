const MiniOnlineIndicator = (props: { isOnline: boolean }) => {
  const { isOnline } = props;

  return (
    <div className="flex flex-row gap-x-4 items-center">
      <span className="relative flex h-2 w-2">
        <span
          className={`animate-ping absolute inline-flex h-full w-full rounded-full ${
            isOnline ? 'bg-green-400' : 'bg-red-400'
          } opacity-75`}
        />
        <span className={`relative inline-flex rounded-full h-2 w-2 ${isOnline ? 'bg-green-400' : 'bg-red-400'}`} />
      </span>
      <p className="text-xs">{isOnline ? 'ONLINE' : 'OFFLINE'}</p>
    </div>
  );
};

export default MiniOnlineIndicator;
