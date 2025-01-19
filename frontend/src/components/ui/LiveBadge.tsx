export const LiveBadge = () => {
    return (
      <div className="inline-flex items-center px-3 py-1 rounded-full text-white bg-red-500 mb-4">
        <span className="w-2 h-2 bg-white rounded-full animate-pulse mr-2"></span>
        <span className="text-sm font-medium">LIVE NOW</span>
      </div>
    );
  };