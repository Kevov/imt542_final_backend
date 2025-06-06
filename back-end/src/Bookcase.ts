import { GameModel } from "./GameModel";
import { UserModel } from "./UserModel";

export class Bookcase {
    private user: UserModel;
    private games: GameModel[];

    constructor(user: UserModel, games: GameModel[]) {
        this.user = user;
        this.games = games;
    }
}