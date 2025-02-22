export interface StoryNode {
  id: string;
  content: string;
  children: StoryNode[];
  parentId: string | null;
  summary: string | null; // summary of the story up to this node, doesn't exist for the root node
}

type OneToTen = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
type RoomStatus = "WAITING" | "IN_PROGRESS" | "FINISHED";
type NarrativeTone =
  | "FUNNY"
  | "SERIOUS"
  | "SPOOKY"
  | "SURREAL"
  | "SCI-FI"
  | "FANTASY";

export interface RoomSettings {
  maxPlayers: number;
  forkRandomness: OneToTen;
  narrativeTone: NarrativeTone;
  roundDuration: number; // in seconds
}

export interface Player {
  id: string;
  nickname: string;
  avatarUrl?: string;
}

export interface RoomData {
  id: string;
  story: StoryNode | undefined;
  players: Player[];
  host: string;
  status: RoomStatus;
  roomSettings?: RoomSettings;
}
