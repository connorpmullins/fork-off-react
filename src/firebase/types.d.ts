// Define interfaces
interface Fork {
  id: string;
  content: string;
}

interface RoomData {
  story: string[];
  forks: Fork[];
  votes: Record<string, number>;
  players: string[];
  host: string;
  status: string;
}
