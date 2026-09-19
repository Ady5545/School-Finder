import React from 'react';
export type InputProps=React.InputHTMLAttributes<HTMLInputElement>&{label?:string;error?:string};
export function Input({label,error,id,className='',...props}:InputProps){return <div className="w-full">{label&&<label htmlFor={id} className="mb-1 block text-sm font-medium">{label}</label>}<input id={id} className={'w-full rounded-xl border px-3 py-2 '+className} {...props}/>{error&&<p className="mt-1 text-xs text-red-600">{error}</p>}</div>}
export default Input;