const OnlineIndicator = (props: { isOnline: boolean }) => {
  const { isOnline } = props;

  return (
    <div className="flex flex-row gap-x-4 items-center">
      <span className="relative flex h-3 w-3">
        <span
          className={`animate-ping absolute inline-flex h-full w-full rounded-full ${
            isOnline ? 'bg-green-400' : 'bg-red-400'
          } opacity-75`}
        />
        <span className={`relative inline-flex rounded-full h-3 w-3 ${isOnline ? 'bg-green-400' : 'bg-red-400'}`} />
      </span>
      <h4>{isOnline ? 'ONLINE' : 'OFFLINE'}</h4>
    </div>
  );
};

export default OnlineIndicator;
