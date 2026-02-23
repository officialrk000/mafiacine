import { movies } from '@/data/movies';
import { Hero } from '@/components/Hero';
import { MovieCard } from '@/components/MovieCard';

export function Home() {
  const featuredMovie = movies[0];
  const otherMovies = movies.slice(1);

  return (
    <div className="min-h-screen bg-black text-white">
      <Hero movie={featuredMovie} />
      
      <div className="container mx-auto px-4 py-12">
        <h2 className="text-xl font-bold mb-6">Trending Now</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {otherMovies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
          {/* Duplicate for demo grid */}
          {otherMovies.map((movie) => (
            <MovieCard key={`dup-${movie.id}`} movie={movie} />
          ))}
        </div>
      </div>
    </div>
  );
}
