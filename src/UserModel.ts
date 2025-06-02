export class UserModel {
    private id: number;
    private name: string;
    private avatar: string;

    constructor(id: number, name: string, avatar: string) {
        this.id = id;
        this.name = name;
        this.avatar = avatar;
    }
}