import { request } from "express";
import { GameModel } from "./GameModel";
import { UserModel } from "./UserModel";

export async function getSteamInfo(steamid: string): Promise<any> {
    const apiKey = process.env.STEAM_API_KEY;
    if (!apiKey) {
        throw new Error("STEAM_API_KEY is not set in environment variables");
    }

    const url = `https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2/?key=${apiKey}&steamids=${steamid}`;
    console.log("Fetching Steam info from URL:", url);
    
    try {
        console.log("hello");
        const userSummaryRes = await fetch(url);
        if (!userSummaryRes.ok) {
            throw new Error(`HTTP error! status: ${userSummaryRes.status}`);
        }
        const userSummary = await userSummaryRes.json();
        const user: UserModel = new UserModel(
            userSummary.response.players[0].steamid,
            userSummary.response.players[0].personaname || "Unknown User",
            userSummary.response.players[0].avatar || "https://cdn.akamai.steamstatic.com/steamcommunity/public/images/avatars/noavatar.png"
        );

        console.log("Fetched user:", user);
        const gameListUrl = `https://api.steampowered.com/IPlayerService/GetOwnedGames/v1/?key=${apiKey}&steamid=${steamid}&include_appinfo=true&format=json`;
        console.log("Fetching owned games from URL:", gameListUrl);
        const gameListRes = await fetch(gameListUrl);
        if (!gameListRes.ok) {
            throw new Error(`HTTP error! status: ${gameListRes.status}`);
        }
        const gameList = await gameListRes.json();
        const games: GameModel[] = gameList.response.games.map((game: any) => {
            const appName = game.name || "Unknown Game";
            const boxArt = `https://cdn.akamai.steamstatic.com/steam/apps/${game.appid}/header.jpg`;
            const appDescription = "No description available"; // Placeholder, as Steam API does not provide this in GetOwnedGames
            const playerInfo = {
                playtime_forever: game.playtime_forever || 0,
                playtime_windows_forever: game.playtime_windows_forever || 0,
                playtime_mac_forever: game.playtime_mac_forever || 0,
                playtime_linux_forever: game.playtime_linux_forever || 0,
                playtime_deck_forever: game.playtime_deck_forever || 0,
                rtime_last_played: game.rtime_last_played || 0
            };
            return new GameModel(game.appid, appName, boxArt, appDescription, playerInfo);
        }
        );
        const bookcase = {
            user: user,
            booklist: games
        };

        return bookcase;

    } catch (error) {
        console.error("Error fetching Steam info:", error);
        throw error;
    }
}