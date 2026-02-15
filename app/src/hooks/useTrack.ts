import { useParams } from 'react-router';
import type { Track } from '@/content/shared/types';

export function useTrack(): { track: Track; isValidTrack: boolean } {
  const { track } = useParams<{ track: string }>();

  const isValidTrack = track === 'general' || track === 'developer';

  return {
    track: isValidTrack ? (track as Track) : 'general',
    isValidTrack,
  };
}
