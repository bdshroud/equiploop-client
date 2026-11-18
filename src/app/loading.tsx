export default function RootLoading() {
  return (
    <div className="min-h-[calc(100vh-4rem-12rem)] flex flex-col items-center justify-center p-6 space-y-4">
      <div className="relative flex items-center justify-center">
        <div className="h-12 w-12 rounded-full border-4 border-muted border-t-amber animate-spin" />
        <div className="absolute h-6 w-6 rounded-full bg-amber/20 animate-ping" />
      </div>
      <div className="text-center space-y-1">
        <h3 className="font-bold text-sm text-foreground">EquipLoop Commercial Platform</h3>
        <p className="text-xs text-muted-foreground animate-pulse">
          Loading fleet data and operational assets...
        </p>
      </div>
    </div>
  );
}
