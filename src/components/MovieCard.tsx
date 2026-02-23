import { Link } from 'react-router-dom';
import { Play, Eye } from 'lucide-react';
import { Movie } from '@/data/movies';
import { cn } from '@/lib/utils';

interface MovieCardProps {
  movie: Movie;
  className?: string;
}

export function MovieCard({ movie, className }: MovieCardProps) {
  return (
    <Link 
      to={`/watch/${movie.id}`}
      className={cn(
        "group relative block aspect-[2/3] overflow-hidden rounded-xl bg-gray-900 shadow-lg transition-all hover:scale-105 hover:shadow-2xl hover:z-10",
        className
      )}
    >
      <img 
        src={movie.thumbnail} 
        alt={movie.title} 
        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
      />
      
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
        <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
          <h3 className="text-sm font-bold text-white mb-1 line-clamp-1">{movie.title}</h3>
          <div className="flex items-center gap-2 text-[9px] text-gray-300 mb-3">
            <span className="bg-white/10 px-2 py-0.5 rounded">{movie.genre}</span>
            <span>{movie.year}</span>
            {movie.isLive && (
              <span className="text-red-500 font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"/> LIVE
              </span>
            )}
          </div>
          
          <div className="flex items-center justify-between text-[9px] text-gray-400">
            <div className="flex items-center gap-1">
              <Play className="w-3 h-3 fill-current" />
              Watch Now
            </div>
            {movie.viewers && (
              <div className="flex items-center gap-1">
                <Eye className="w-3 h-3" />
                {movie.viewers.toLocaleString()}
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
