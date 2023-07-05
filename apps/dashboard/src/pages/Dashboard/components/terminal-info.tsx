const TerminalInfo = () => {
  return (
    <div className="flex flex-row justify-between">
      <div className="flex flex-col w-1/2">
        <p className="text-xl text-muted-foreground">SERVICE LINE NUMBER</p>
        <p className="font-bold">AST-684089-84700-4</p>
        <br />
        <p className="text-xl text-muted-foreground">KIT SERIAL NUMBER</p>
        <p className="font-bold">KITP00019658</p>
        <br />
        <p className="text-xl text-muted-foreground">LAST UPDATED</p>
        <p className="font-bold">05/07/2023 09:14:42</p>
      </div>
      <div className="flex flex-col w-1/2">
        <p className="text-xl text-muted-foreground">SERVICE ADDRESS</p>
        <p className="font-bold">LAIS, KUNYIL, MELIAU, SANGGAU REGENCY, WEST KALIMANTAN 78571</p>
        <br />
        <p className="text-xl text-muted-foreground">UPTIME</p>
        <p className="font-bold">3 DAYS 11 HOURS 50 MINUTES</p>
      </div>
    </div>
  );
};

export default TerminalInfo;
