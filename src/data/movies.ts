export interface Movie {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  videoUrl: string;
  duration: string;
  genre: string;
  year: number;
  isLive?: boolean;
  viewers?: number;
}

export const movies: Movie[] = [
  {
    id: "1",
    title: "Big Buck Bunny",
    description: "A large and lovable rabbit deals with three tiny bullies, led by a flying squirrel, who are determined to squelch his happiness.",
    thumbnail: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Big_buck_bunny_poster_big.jpg/800px-Big_buck_bunny_poster_big.jpg",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    duration: "9:56",
    genre: "Animation",
    year: 2008,
    isLive: true,
    viewers: 12453
  },
  {
    id: "2",
    title: "Elephant's Dream",
    description: "The first open movie from Blender Foundation. Two people explore a machine that seems to have a life of its own.",
    thumbnail: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/Elephants_Dream_poster.jpg/800px-Elephants_Dream_poster.jpg",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    duration: "10:53",
    genre: "Sci-Fi",
    year: 2006,
    isLive: false
  },
  {
    id: "3",
    title: "Sintel",
    description: "A lonely young woman, Sintel, helps and befriends a dragon, whom she calls Scales. But when he is kidnapped by an adult dragon, Sintel decides to embark on a dangerous quest to find her lost friend.",
    thumbnail: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/Sintel_poster.jpg/800px-Sintel_poster.jpg",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
    duration: "14:48",
    genre: "Fantasy",
    year: 2010,
    isLive: true,
    viewers: 8932
  },
  {
    id: "4",
    title: "Tears of Steel",
    description: "In a dystopian future, a group of warriors and scientists gather at the 'Oude Kerk' in Amsterdam to stage a crucial event from the past in a desperate attempt to rescue the world from destructive robots.",
    thumbnail: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/Tears_of_Steel_poster.jpg/800px-Tears_of_Steel_poster.jpg",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
    duration: "12:14",
    genre: "Sci-Fi",
    year: 2012,
    isLive: false
  }
];
