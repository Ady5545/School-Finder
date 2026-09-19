'use client';
import React,{createContext,useContext,useState} from 'react';
const C=createContext({showToast:(_m:string)=>{}});
export function ToastProvider({children}:{children:React.ReactNode}){const [m,setM]=useState<string[]>([]);const showToast=(x:string)=>{setM(v=>[...v,x]);setTimeout(()=>setM(v=>v.slice(1)),3000)};return <C.Provider value={{showToast}}>{children}<div className="fixed right-4 top-4 z-50">{m.map((x,i)=><div key={i} className="mb-2 rounded bg-slate-900 p-3 text-white">{x}</div>)}</div></C.Provider>}
export const useToast=()=>useContext(C);