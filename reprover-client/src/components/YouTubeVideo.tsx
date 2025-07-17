import React from 'react';

interface YouTubeVideoProps {
  searchQuery: string;
  exerciseName: string;
}

export const YouTubeVideo: React.FC<YouTubeVideoProps> = ({ searchQuery, exerciseName }) => {
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

  // If we have a video, show it directly
  if (videoInfo) {
    return (
      <div className="mt-3 space-y-2">
        <div className="text-sm text-gray-400">Video Tutorial by {videoInfo.channel}:</div>
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

  // If no video, show search link
  return (
    <div className="mt-3">
      <a 
        href={`https://www.youtube.com/results?search_query=${encodeURIComponent(enhancedQuery)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 text-primary-400 hover:text-primary-300 transition-colors text-sm"
      >
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        Search YouTube for Tutorial
      </a>
    </div>
  );
};