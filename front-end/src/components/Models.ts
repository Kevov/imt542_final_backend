export interface PlayerInformation {
  playtime_forever: number,
  playtime_windows_forever: number,
  playtime_mac_forever: number,
  playtime_linux_forever: number,
  playtime_deck_forever: number,
  rtime_last_played: number
}

export interface GameModel {
  app_id: number;
  app_name: string;
  box_art: string;
  app_description: string;
  player_information: PlayerInformation;
}

export interface UserModel {
  id: number;
  name: string;
  avatar: string;
}

export interface Bookcase {
  user: UserModel;
  booklist: GameModel[];
}