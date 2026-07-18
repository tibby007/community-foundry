import {createHash,randomUUID} from "node:crypto";
const pending=new Map<string,{hash:string;expires:number}>();
const hash=(action:string,payload:unknown)=>createHash("sha256").update(`${action}:${JSON.stringify(payload)}`).digest("hex");
export function prepareConfirmation(action:string,payload:unknown){const token=randomUUID();pending.set(token,{hash:hash(action,payload),expires:Date.now()+5*60_000});return token}
export function consumeConfirmation(token:string,action:string,payload:unknown){const item=pending.get(token);pending.delete(token);return Boolean(item&&item.expires>Date.now()&&item.hash===hash(action,payload))}
