
import { useState, useEffect } from "react";
import { 
  Dialog,
  DialogContent, 
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Settings } from "lucide-react";

interface DeviceSelectorProps {
  onSelectAudioDevice: (deviceId: string) => void;
  onSelectVideoDevice: (deviceId: string) => void;
}

interface MediaDevice {
  deviceId: string;
  label: string;
}

const DeviceSelector = ({ onSelectAudioDevice, onSelectVideoDevice }: DeviceSelectorProps) => {
  const [audioDevices, setAudioDevices] = useState<MediaDevice[]>([]);
  const [videoDevices, setVideoDevices] = useState<MediaDevice[]>([]);
  const [selectedAudioDevice, setSelectedAudioDevice] = useState<string>("");
  const [selectedVideoDevice, setSelectedVideoDevice] = useState<string>("");
  const [isOpen, setIsOpen] = useState(false);

  const getDevices = async () => {
    try {
      // Request permission to access media devices
      await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
      
      const devices = await navigator.mediaDevices.enumerateDevices();
      
      const audioInputs = devices.filter(device => device.kind === "audioinput").map(device => ({
        deviceId: device.deviceId,
        label: device.label || `Microphone ${device.deviceId.slice(0, 5)}...`
      }));
      
      const videoInputs = devices.filter(device => device.kind === "videoinput").map(device => ({
        deviceId: device.deviceId,
        label: device.label || `Camera ${device.deviceId.slice(0, 5)}...`
      }));
      
      setAudioDevices(audioInputs);
      setVideoDevices(videoInputs);
      
      // Set default selections if devices are available
      if (audioInputs.length > 0 && !selectedAudioDevice) {
        setSelectedAudioDevice(audioInputs[0].deviceId);
        onSelectAudioDevice(audioInputs[0].deviceId);
      }
      
      if (videoInputs.length > 0 && !selectedVideoDevice) {
        setSelectedVideoDevice(videoInputs[0].deviceId);
        onSelectVideoDevice(videoInputs[0].deviceId);
      }
    } catch (err) {
      console.error("Error accessing media devices:", err);
    }
  };

  useEffect(() => {
    if (isOpen) {
      getDevices();
    }
  }, [isOpen]);

  const handleAudioDeviceChange = (deviceId: string) => {
    setSelectedAudioDevice(deviceId);
    onSelectAudioDevice(deviceId);
  };

  const handleVideoDeviceChange = (deviceId: string) => {
    setSelectedVideoDevice(deviceId);
    onSelectVideoDevice(deviceId);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" className="bg-white/10 backdrop-blur-sm">
          <Settings className="h-4 w-4" />
          <span className="sr-only">Settings</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Media Device Settings</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <label htmlFor="video-device" className="text-sm font-medium">
              Camera
            </label>
            <Select
              value={selectedVideoDevice}
              onValueChange={handleVideoDeviceChange}
            >
              <SelectTrigger id="video-device">
                <SelectValue placeholder="Select camera" />
              </SelectTrigger>
              <SelectContent>
                {videoDevices.map((device) => (
                  <SelectItem key={device.deviceId} value={device.deviceId}>
                    {device.label}
                  </SelectItem>
                ))}
                {videoDevices.length === 0 && (
                  <SelectItem value="no-devices" disabled>
                    No cameras found
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <label htmlFor="audio-device" className="text-sm font-medium">
              Microphone
            </label>
            <Select
              value={selectedAudioDevice}
              onValueChange={handleAudioDeviceChange}
            >
              <SelectTrigger id="audio-device">
                <SelectValue placeholder="Select microphone" />
              </SelectTrigger>
              <SelectContent>
                {audioDevices.map((device) => (
                  <SelectItem key={device.deviceId} value={device.deviceId}>
                    {device.label}
                  </SelectItem>
                ))}
                {audioDevices.length === 0 && (
                  <SelectItem value="no-devices" disabled>
                    No microphones found
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DeviceSelector;
