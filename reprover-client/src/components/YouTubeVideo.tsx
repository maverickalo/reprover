import React, { useState } from 'react';

interface YouTubeVideoProps {
  searchQuery: string;
  exerciseName: string;
}

export const YouTubeVideo: React.FC<YouTubeVideoProps> = ({ searchQuery, exerciseName }) => {
  const [showVideo, setShowVideo] = useState(false);
  
  // Create a well-formed search query
  const enhancedQuery = `${searchQuery} proper form technique tutorial`;
  
  // Use a reliable exercise video channel as fallback
  const reliableVideos: { [key: string]: { id: string, channel: string } } = {
    'squat': { id: 'ultWZbUMPL8', channel: 'Jeff Nippard' },
    'back squat': { id: 'ultWZbUMPL8', channel: 'Jeff Nippard' },
    'deadlift': { id: 'wYREQkVtvEc', channel: 'Mark Rippetoe' },
    'romanian deadlift': { id: '7HyDqFKMkjw', channel: 'Jeff Cavaliere' },
    'bench press': { id: 'vcBig73ojpE', channel: 'Jeff Nippard' },
    'push-up': { id: 'IODxDxX7oi4', channel: 'Calisthenic Movement' },
    'pull-up': { id: 'eGo4IYlbE5g', channel: 'Calisthenic Movement' },
    'plank': { id: 'pSHjTRCQxIw', channel: 'Athlean-X' },
    'dumbbell row': { id: 'roCP6wCXPqo', channel: 'Jeff Cavaliere' },
    'overhead press': { id: '2yjwXTZQDDI', channel: 'Starting Strength' },
    'barbell curl': { id: 'kwG2ipFRgfo', channel: 'Jeff Cavaliere' },
    'lateral raise': { id: 'geenhiHju-o', channel: 'Jeff Cavaliere' },
  };

  // Find a matching video
  const lowerName = exerciseName.toLowerCase();
  let videoInfo = null;
  
  for (const [key, info] of Object.entries(reliableVideos)) {
    if (lowerName.includes(key) || key.includes(lowerName)) {
      videoInfo = info;
      break;
    }
  }

  if (showVideo && videoInfo) {
    return (
      <div className="mt-3 space-y-2">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-400">Video Tutorial by {videoInfo.channel}:</div>
          <button
            onClick={() => setShowVideo(false)}
            className="text-xs text-gray-500 hover:text-gray-300"
          >
            Hide
          </button>
        </div>
        <div className="aspect-video w-full max-w-md bg-gray-900 rounded-lg overflow-hidden">
          <iframe
            className="w-full h-full"
            src={`https://www.youtube.com/embed/${videoInfo.id}?rel=0`}
            title={`${exerciseName} Tutorial`}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>
    );
  }

  return (
    <div className="mt-3">
      <div className="flex items-center gap-2">
        {videoInfo && (
          <button
            onClick={() => setShowVideo(true)}
            className="inline-flex items-center gap-2 text-primary-400 hover:text-primary-300 transition-colors text-sm"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
            </svg>
            Watch Tutorial
          </button>
        )}
        <a 
          href={`https://www.youtube.com/results?search_query=${encodeURIComponent(enhancedQuery)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-primary-400 hover:text-primary-300 transition-colors text-sm"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Search YouTube
        </a>
      </div>
    </div>
  );
};