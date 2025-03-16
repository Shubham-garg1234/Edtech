
import { Badge } from "@/components/ui/badge";

interface StreamStatusProps {
  status: "offline" | "ready" | "live" | "paused";
}

const StreamStatus = ({ status }: StreamStatusProps) => {
  const getStatusDetails = () => {
    switch (status) {
      case "live":
        return {
          label: "LIVE",
          className: "status-live",
          icon: (
            <svg className="animate-pulse" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/></svg>
          )
        };
      case "ready":
        return {
          label: "Ready",
          className: "status-ready",
          icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 2h10"/><path d="M5 6h14"/><rect width="18" height="12" x="3" y="10" rx="2"/></svg>
          )
        };
      case "paused":
        return {
          label: "Paused",
          className: "status-paused",
          icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="4" height="16" x="6" y="4"/><rect width="4" height="16" x="14" y="4"/></svg>
          )
        };
      case "offline":
      default:
        return {
          label: "Offline",
          className: "status-offline",
          icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18.36 6.64A9 9 0 0 1 20.77 15"/><path d="M6.16 6.16a9 9 0 1 0 12.68 12.68"/><path d="M12 2v2"/><path d="m2 2 20 20"/></svg>
          )
        };
    }
  };

  const { label, className, icon } = getStatusDetails();

  return (
    <Badge className={`text-md py-1 px-3 flex items-center gap-2 ${className}`}>
      {icon}
      {label}
    </Badge>
  );
};

export default StreamStatus;
