import React, { useState, useEffect } from 'react';

interface YouTubeVideoProps {
  searchQuery: string;
  exerciseName: string;
}

export const YouTubeVideo: React.FC<YouTubeVideoProps> = ({ searchQuery, exerciseName }) => {
  const [videoId, setVideoId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // For now, we'll use a predefined mapping of common exercises to video IDs
    // In production, you'd want to use YouTube Data API
    const exerciseVideos: { [key: string]: string } = {
      'squat': 'SW_CjLGFKTk',
      'back squat': 'SW_CjLGFKTk',
      'deadlift': 'op9kVnSso6Q',
      'romanian deadlift': 'jEy_czb1J5M',
      'bench press': 'gRVjAtPip0Y',
      'push-up': 'IODxDxX7oi4',
      'pull-up': 'eGo4IYlbE5g',
      'plank': 'ASdvN_XEl_c',
      'row': 'xQNrFHEMhI4',
      'dumbbell press': '0xRvl66oL3k',
      'overhead press': '_RlRDWO2jfg',
      'curl': 'ykJmrZ5v0Oo',
      'bicep curl': 'ykJmrZ5v0Oo',
      'tricep extension': 'popGXI-qs98',
      'lateral raise': '3VcKaXpzqRo',
      'leg press': 'IZxyjW7MPJQ',
      'lunge': 'QOVaHwm-Q6U',
      'hip thrust': 'SEdqd1n0cvg',
      'calf raise': 'JbyjNymZOt0'
    };

    // Try to find a video for this exercise
    const lowerName = exerciseName.toLowerCase();
    let foundVideoId = null;

    // Check exact match first
    if (exerciseVideos[lowerName]) {
      foundVideoId = exerciseVideos[lowerName];
    } else {
      // Check if any key is contained in the exercise name
      for (const [key, id] of Object.entries(exerciseVideos)) {
        if (lowerName.includes(key)) {
          foundVideoId = id;
          break;
        }
      }
    }

    setVideoId(foundVideoId);
    setLoading(false);
  }, [exerciseName]);

  if (loading) {
    return <div className="text-gray-400 text-sm">Loading video...</div>;
  }

  if (!videoId) {
    return (
      <div className="mt-2">
        <a 
          href={`https://www.youtube.com/results?search_query=${encodeURIComponent(searchQuery)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-primary-400 hover:text-primary-300 transition-colors text-sm"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
          </svg>
          Search YouTube for Tutorial
        </a>
      </div>
    );
  }

  return (
    <div className="mt-3 aspect-video w-full max-w-md">
      <iframe
        className="w-full h-full rounded-lg"
        src={`https://www.youtube.com/embed/${videoId}?rel=0`}
        title={`${exerciseName} Tutorial`}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
};