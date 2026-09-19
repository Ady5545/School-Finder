import React from 'react';
export function Card({children,className='',...p}:React.HTMLAttributes<HTMLDivElement>){return <div className={'rounded-2xl border bg-white shadow-sm '+className} {...p}>{children}</div>}
export const CardHeader=({children,className='',...p}:React.HTMLAttributes<HTMLDivElement>)=><div className={'p-5 '+className} {...p}>{children}</div>;
export const CardTitle=({children,className='',...p}:React.HTMLAttributes<HTMLHeadingElement>)=><h3 className={'text-lg font-bold '+className} {...p}>{children}</h3>;
export const CardDescription=({children,className='',...p}:React.HTMLAttributes<HTMLParagraphElement>)=><p className={'text-sm text-slate-500 '+className} {...p}>{children}</p>;
export const CardContent=({children,className='',...p}:React.HTMLAttributes<HTMLDivElement>)=><div className={'p-5 pt-0 '+className} {...p}>{children}</div>;
export const CardFooter=({children,className='',...p}:React.HTMLAttributes<HTMLDivElement>)=><div className={'p-5 pt-0 '+className} {...p}>{children}</div>;
export default Card;