import React from 'react';
import { useNavigationStore } from '../stores/navigationStore';

interface VideoPageProps {
  onNavigate: (page: string) => void;
  videoUrl?: string;
  title?: string;
  description?: string;
}

export const VideoPage: React.FC<VideoPageProps> = ({
  onNavigate,
  videoUrl = "https://ia803205.us.archive.org/30/items/sex-the-secret-gate-to-eden-2006-100-subtitles/SEX-The%20Secret%20Gate%20to%20Eden%20%282006%29%20%5B100%2BSubtitles%5D.mp4",
  title = "Sex - The Secret Gate to Eden",
  description = "Educational video on healthy sexuality from a gnostic perspective"
}) => {
  const { setIsNavigating } = useNavigationStore();

  return (
    <div className="video-page">
      <div className="page-header">
        <h1>{title}</h1>
        <button onClick={() => onNavigate('resources')} className="back-button">
          Back to Resources
        </button>
      </div>

      <div className="video-content">
        <div className="video-wrapper">
          <video
            width="100%"
            height="500"
            controls
            preload="metadata"
            style={{ maxWidth: '100%', height: 'auto' }}
          >
            <source src={videoUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>

        <div className="video-description">
          <h2>About this video</h2>
          <p>{description}</p>
        </div>
      </div>
    </div>
  );
};