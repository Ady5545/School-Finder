import React from 'react';
import Link from 'next/link';
export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: string; size?: string; leftIcon?: React.ReactNode; rightIcon?: React.ReactNode; href?: string };
export function Button({children,href,leftIcon,rightIcon,className='',...props}:ButtonProps){
 const cls='inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2 font-semibold transition-opacity hover:opacity-90 disabled:opacity-50 '+className;
 if(href) return <Link href={href} className={cls}>{leftIcon}{children}{rightIcon}</Link>;
 return <button className={cls} {...props}>{leftIcon}{children}{rightIcon}</button>;
}
export default Button;