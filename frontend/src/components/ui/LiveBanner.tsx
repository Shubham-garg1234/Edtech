import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";

export function LiveBanner() {
  return (
    <Alert className="bg-red-50 border-red-200 mb-4">
      <AlertCircle className="h-4 w-4 text-red-500" />
      <AlertTitle className="text-red-500">Live Session in Progress!</AlertTitle>
      <AlertDescription>
        Your instructor is currently live. Join the session now!
      </AlertDescription>
    </Alert>
  );
}