import {getUser as getChatGPTUser} from "../../user-auth";
import {database} from "@/db/store";
import {lessons,readings,speakingPrompts,typingTexts,words} from "../../learning-data";
import {z} from "zod";
import {listeningLessons,writingPrompts,dialogueScenarios} from "../../extended-data";
const attemptId=z.string().regex(/^[a-zA-Z0-9-]{10,80}$/);
const payloadSchema=z.union([z.object({action:z.literal("draft"),id:attemptId,promptId:z.string().max(50),text:z.string().max(12000),updatedAt:z.number().int().positive()}),z.object({action:z.literal("bookmark"),id:attemptId,bookId:z.enum(["alice","oz","sherlock"]),page:z.number().int().min(0).max(500)}),z.object({action:z.literal("review"),id:attemptId,wordId:z.string(),known:z.boolean()}),z.object({id:attemptId,kind:z.enum(["grammar","reading","speaking","typing","vocabulary","listening","writing","dialogue"]),itemId:z.string().max(80),score:z.number().int().min(0).max(100),total:z.number().int().min(1).max(100),seconds:z.number().int().min(0).max(7200),day:z.string().regex(/^\d{4}-\d{2}-\d{2}$/)})]);
export async function GET(){
 const user=await getChatGPTUser();if(!user)return Response.json({error:"Войдите, чтобы сохранять прогресс.",auth:true},{status:401});
 try{
 const db=database();const [history,reviews,drafts,bookmarks]=await Promise.all([db.prepare("SELECT id, kind, item_id AS itemId, title, score, total, seconds, day, created_at AS createdAt FROM sessions WHERE user_id = ? ORDER BY created_at DESC LIMIT 1000").bind(user.userId).all(),db.prepare("SELECT word_id AS wordId, stage, due FROM reviews WHERE user_id = ?").bind(user.userId).all(),db.prepare("SELECT prompt_id AS promptId,text,updated_at AS updatedAt FROM drafts WHERE user_id = ?").bind(user.userId).all(),db.prepare("SELECT book_id AS bookId,page,updated_at AS updatedAt FROM bookmarks WHERE user_id = ?").bind(user.userId).all()]);
 return Response.json({sessions:history.results,reviews:reviews.results,drafts:drafts.results,bookmarks:bookmarks.results,name:user.fullName||"Your journey"});
 }catch(e){console.error("Progress read failed",e);return Response.json({error:"Не удалось загрузить прогресс. Повторите попытку."},{status:503});}
}
export async function POST(request:Request){
 const user=await getChatGPTUser();if(!user)return Response.json({error:"Войдите, чтобы сохранять прогресс.",auth:true},{status:401});
 if(request.headers.get("origin")&&new URL(request.url).origin!==request.headers.get("origin"))return Response.json({error:"Недопустимый запрос"},{status:403});
 try{
 const parsed=payloadSchema.safeParse(await request.json());if(!parsed.success)return Response.json({error:"Некорректный запрос"},{status:400});
 const b=parsed.data;const db=database();
 if(typeof b.id!=="string"||! /^[a-zA-Z0-9-]{10,80}$/.test(b.id))return Response.json({error:"Некорректный идентификатор"},{status:400});
 if("action" in b){
 if(b.action==="draft"){if(!writingPrompts.some(p=>p.id===b.promptId)||b.updatedAt>Date.now()+300000)return Response.json({error:"Некорректный черновик"},{status:400});await db.prepare("INSERT INTO drafts (user_id,prompt_id,text,updated_at) VALUES (?,?,?,?) ON CONFLICT(user_id,prompt_id) DO UPDATE SET text=excluded.text,updated_at=excluded.updated_at WHERE excluded.updated_at >= drafts.updated_at").bind(user.userId,b.promptId,b.text,b.updatedAt).run();return Response.json({ok:true});}
 if(b.action==="bookmark"){const counts={alice:74,oz:106,sherlock:265};if(b.page>=counts[b.bookId])return Response.json({error:"Фрагмент не найден"},{status:400});await db.prepare("INSERT INTO bookmarks (user_id,book_id,page,updated_at) VALUES (?,?,?,?) ON CONFLICT(user_id,book_id) DO UPDATE SET page=excluded.page,updated_at=excluded.updated_at").bind(user.userId,b.bookId,b.page,Date.now()).run();return Response.json({ok:true});}
 if(!words.some(w=>w.id===b.wordId)||typeof b.known!=="boolean")return Response.json({error:"Некорректная карточка"},{status:400});
 const old=await db.prepare("SELECT stage, due, last_attempt FROM reviews WHERE user_id = ? AND word_id = ?").bind(user.userId,b.wordId).first<{stage:number;due:number;last_attempt:string}>();
 if(old?.last_attempt===b.id)return Response.json({ok:true});
 const stage=b.known?Math.min((old?.stage||0)+1,6):0;const days=[0,1,3,7,14,30,60];
 const due=Date.now()+(b.known?days[stage]*86400000:600000);
 await db.prepare("INSERT INTO reviews (user_id,word_id,stage,due,last_attempt) VALUES (?,?,?,?,?) ON CONFLICT(user_id,word_id) DO UPDATE SET stage=excluded.stage,due=excluded.due,last_attempt=excluded.last_attempt").bind(user.userId,b.wordId,stage,due,b.id).run();
 return Response.json({ok:true});
 }
 const catalog:Record<string,{id:string;name?:string;title?:string}[]>={grammar:lessons,reading:readings,speaking:speakingPrompts,typing:typingTexts.map((x,i)=>({...x,id:String(i)})),vocabulary:[{id:"cards",title:"Словарные карточки"}],listening:listeningLessons,writing:writingPrompts,dialogue:dialogueScenarios};
 const item=catalog[b.kind]?.find(i=>i.id===b.itemId);
 if(!item||!Number.isInteger(b.score)||!Number.isInteger(b.total)||b.total<1||b.total>100||b.score<0||b.score>b.total||!Number.isInteger(b.seconds)||b.seconds<0||b.seconds>7200||typeof b.day!=="string"||!/^\d{4}-\d{2}-\d{2}$/.test(b.day))return Response.json({error:"Некорректный результат"},{status:400});
 await db.prepare("INSERT INTO sessions (user_id,id,kind,item_id,title,score,total,seconds,day,created_at) VALUES (?,?,?,?,?,?,?,?,?,?) ON CONFLICT(user_id,id) DO NOTHING").bind(user.userId,b.id,b.kind,b.itemId,item.name||item.title||b.kind,b.score,b.total,b.seconds,b.day,Date.now()).run();
 return Response.json({ok:true});
 }catch(e){console.error("Progress save failed",e);return Response.json({error:"Не удалось сохранить. Результат остаётся на экране — попробуйте ещё раз."},{status:503});}
}
