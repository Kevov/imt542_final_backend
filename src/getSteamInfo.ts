import { request } from "express";
import { GameModel } from "./GameModel";
import { UserModel } from "./UserModel";

const apiKey = process.env.STEAM_API_KEY;

export async function getSteamInfo(steamid: string): Promise<any> {
    if (!apiKey) {
        throw new Error("STEAM_API_KEY is not set in environment variables");
    }

    const url = `https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2/?key=${apiKey}&steamids=${steamid}`;
    
    try {
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

        const gameListUrl = `https://api.steampowered.com/IPlayerService/GetOwnedGames/v1/?key=${apiKey}&steamid=${steamid}&include_appinfo=true&format=json`;
        const gameListRes = await fetch(gameListUrl);
        if (!gameListRes.ok) {
            throw new Error(`HTTP error! status: ${gameListRes.status}`);
        }
        const gameList = await gameListRes.json();
        const gamePromiseArray: Promise<GameModel[]>[] = gameList.response.games.map(async (game: any) => {
            const appName = game.name || "Unknown Game";
            const boxArt = `https://cdn.akamai.steamstatic.com/steam/apps/${game.appid}/header.jpg`;
            const appDescription = await fetchGameDetails(game.appid);
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
        const games = await Promise.all(gamePromiseArray);
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

async function fetchGameDetails(appId: number): Promise<string> {
    if (!apiKey) {
        throw new Error("STEAM_API_KEY is not set in environment variables");
    }

    const url = `https://store.steampowered.com/api/appdetails?appids=${appId}`;
    
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        if (data[appId] && data[appId].success) {
            return data[appId].data.short_description || "No description available";
        } 

        return "No description available"; // Placeholder, as Steam API does not provide this in GetOwnedGames
    } catch (error) {
        console.error("Error fetching game details:", error);
        return "No description available (Steam API error)";
    }
}