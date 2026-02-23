import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { movies } from '@/data/movies';
import { VideoPlayer } from '@/components/VideoPlayer';

export function Watch() {
  const { id } = useParams();
  const movie = movies.find((m) => m.id === id);

  if (!movie) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Movie Not Found</h1>
          <Link to="/" className="text-red-500 hover:underline">Go Home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white relative">
      <Link 
        to="/" 
        className="absolute top-6 left-6 z-50 bg-black/50 p-2 rounded-full hover:bg-black/80 transition-colors"
      >
        <ArrowLeft className="w-6 h-6 text-white" />
      </Link>
      
      <div className="w-full flex flex-col">
        <div className="w-full h-[60vh] md:h-[80vh] bg-black flex items-center justify-center">
          <VideoPlayer 
            src={movie.videoUrl} 
            poster={movie.thumbnail} 
            autoPlay 
            title={movie.title}
            isLive={movie.isLive}
          />
        </div>

        <div className="container mx-auto px-4 py-8">
          <h1 className="text-2xl font-bold mb-4">{movie.title}</h1>
          
          <div className="flex items-center gap-4 text-gray-400 mb-6 text-xs">
            <span className="bg-white/10 px-2 py-1 rounded text-[10px]">{movie.genre}</span>
            <span>{movie.year}</span>
            <span>{movie.duration}</span>
            {movie.isLive && (
              <span className="text-red-500 font-bold flex items-center gap-2">
                <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                LIVE
              </span>
            )}
            {movie.viewers && (
              <span className="text-gray-400">
                {movie.viewers.toLocaleString()} watching
              </span>
            )}
          </div>

          <p className="text-sm text-gray-300 max-w-4xl leading-relaxed">
            {movie.description}
          </p>
        </div>
      </div>
    </div>
  );
}
