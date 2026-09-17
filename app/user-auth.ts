import {headers} from "next/headers";
import {env} from "cloudflare:workers";
import {getChatGPTUser} from "./chatgpt-auth";
import {database} from "@/db/store";
export const authConfig=()=>{const e=env as unknown as Record<string,string|undefined>;return {client:e.GOOGLE_CLIENT_ID,secret:e.GOOGLE_CLIENT_SECRET,origin:e.APP_ORIGIN};};
export function googleReady(){const c=authConfig();return !!(c.client&&c.secret&&c.origin);}
export const randomToken=()=>Array.from(crypto.getRandomValues(new Uint8Array(32)),x=>x.toString(16).padStart(2,"0")).join("");
export async function hash(value:string){return Array.from(new Uint8Array(await crypto.subtle.digest("SHA-256",new TextEncoder().encode(value))),x=>x.toString(16).padStart(2,"0")).join("");}
export function cookieValue(raw:string|null,name:string){return raw?.split(";").map(x=>x.trim()).find(x=>x.startsWith(name+"="))?.slice(name.length+1)||"";}
export function authCookie(name:string,value:string,age:number,origin:string){return `${name}=${value}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${age}${origin.startsWith("https:")?"; Secure":""}`;}
export async function getUser(){const h=await headers();const token=cookieValue(h.get("cookie"),"orbit_session");if(token){const row=await database().prepare("SELECT a.user_id AS userId,a.email,a.name AS fullName FROM auth_sessions s JOIN google_accounts a ON a.user_id=s.user_id WHERE s.token_hash=? AND s.expires_at>?").bind(await hash(token),Date.now()).first<{userId:string;email:string;fullName:string}>();return row?{...row,displayName:row.fullName,provider:"google"}:null;}const user=await getChatGPTUser();return user?{...user,provider:"chatgpt"}:null;}
