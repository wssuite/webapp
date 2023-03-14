import { UserInfo } from "../models/Credentials";

export const TOKEN_STRING = "token";
const IS_ADMIN_STRING = "isAdmin";
export const USERNAME_STRING = "username";

export class CacheUtils {

    public static getUserInfo(): UserInfo{
        const token = localStorage.getItem(TOKEN_STRING);
        const isAdmin = localStorage.getItem(IS_ADMIN_STRING);
        const username = localStorage.getItem(USERNAME_STRING);
        if(token === undefined || token === null || isAdmin === undefined || isAdmin === null ||
             username === undefined || username === null){
            throw new Error("User is not logged in");
        }
        return {
            token: token,
            isAdmin: isAdmin === "true"? true: false,
            username: username
        }
    }

    public static pushUserInfo(info: UserInfo) {
        localStorage.setItem(TOKEN_STRING, info.token);
        localStorage.setItem(IS_ADMIN_STRING, JSON.stringify(info.isAdmin));
        localStorage.setItem(USERNAME_STRING, info.username);
    }

    public static getUserToken(): string {
        const token = localStorage.getItem(TOKEN_STRING);
        if(token === undefined || token === null) {
            throw new Error("User is not logged in");
        }
        return token;
    }

    public static getIsAdmin(): boolean {
        const isAdmin = localStorage.getItem(IS_ADMIN_STRING);
        if(isAdmin === undefined || isAdmin === null){
            throw new Error("User is not logged in");
        }
        return isAdmin === "true"? true : false;
    }

    public static emptyCache() {
        localStorage.removeItem(TOKEN_STRING);
        localStorage.removeItem(IS_ADMIN_STRING);
        localStorage.removeItem(USERNAME_STRING);
        localStorage.removeItem("profile");
    }

    public static getUsername(): string{
        const username = localStorage.getItem(USERNAME_STRING);
        if(username === undefined || username === null){
            throw new Error("user not logged in");
        }
        return username;
    }

    public static setProfile(profileName: string): void{
        localStorage.setItem("profile", profileName);
    }

    public static getProfile(): string {
        const ret = localStorage.getItem("profile");
        if(ret === null || ret === undefined){
            throw new Error("");
        }
        return ret;
    }
}