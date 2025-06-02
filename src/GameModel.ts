export class GameModel {
    private app_id: number;
    private app_name: string;
    private box_art: string;
    private app_description: string;
    private player_information: {
        playtime_forever: number,
        playtime_windows_forever: number,
        playtime_mac_forever: number,
        playtime_linux_forever: number,
        playtime_deck_forever: number,
        rtime_last_played: number
    }

    constructor(app_id: number, app_name: string, box_art: string, app_description: string, player_info: {
        playtime_forever: number, playtime_windows_forever: number, playtime_mac_forever: number, playtime_linux_forever: number, playtime_deck_forever: number, rtime_last_played: number
    }) {
        this.app_id = app_id;
        this.app_name = app_name;
        this.box_art = box_art;
        this.app_description = app_description;
        this.player_information = player_info;
    }
}