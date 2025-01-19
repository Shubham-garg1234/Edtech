interface VideoPlayerProps {
    isLive?: boolean;
    lesson?: {
      title: string;
      type: string;
    };
  }
  
  export const VideoPlayer = ({ isLive, lesson }: VideoPlayerProps) => {
    return (
      <div className="relative bg-black rounded-lg overflow-hidden aspect-video">
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-white text-lg">
            {isLive ? "Live Session in Progress" : `Playing: ${lesson?.title}`}
          </p>
        </div>
      </div>
    );
  };