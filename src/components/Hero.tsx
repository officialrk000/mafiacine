import { Link } from 'react-router-dom';
import { Play, Info } from 'lucide-react';
import { Movie } from '@/data/movies';

interface HeroProps {
  movie: Movie;
}

export function Hero({ movie }: HeroProps) {
  return (
    <div className="relative h-[80vh] w-full overflow-hidden">
      {/* Background Image with Gradient Overlay */}
      <div className="absolute inset-0">
        <img 
          src={movie.thumbnail} 
          alt={movie.title} 
          className="h-full w-full object-cover object-top opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent" />
      </div>

      <div className="relative container mx-auto px-4 h-full flex items-center">
        <div className="max-w-2xl space-y-6">
          {movie.isLive && (
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-600 text-white text-xs font-bold uppercase tracking-wider rounded-full animate-pulse">
              <span className="w-2 h-2 bg-white rounded-full" />
              Live Now
            </div>
          )}
          
          <h1 className="text-3xl md:text-5xl font-bold text-white leading-tight tracking-tight">
            {movie.title}
          </h1>
          
          <div className="flex items-center gap-4 text-gray-300 text-[10px] md:text-xs">
            <span className="text-green-400 font-bold">98% Match</span>
            <span>{movie.year}</span>
            <span className="border border-gray-600 px-2 py-0.5 rounded text-[10px]">HD</span>
            <span>{movie.genre}</span>
          </div>
          
          <p className="text-sm text-gray-300 line-clamp-3 md:line-clamp-none">
            {movie.description}
          </p>
          
          <div className="flex items-center gap-4 pt-4">
            <Link 
              to={`/watch/${movie.id}`}
              className="flex items-center gap-2 bg-white text-black px-6 py-2 rounded-lg font-bold text-sm hover:bg-gray-200 transition-colors"
            >
              <Play className="w-4 h-4 fill-current" />
              Play
            </Link>
            <button className="flex items-center gap-2 bg-gray-600/60 backdrop-blur-sm text-white px-6 py-2 rounded-lg font-bold text-sm hover:bg-gray-600/80 transition-colors">
              <Info className="w-4 h-4" />
              More Info
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
