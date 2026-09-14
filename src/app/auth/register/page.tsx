import React from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../../../components/ui/Card';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
import { GraduationCap } from 'lucide-react';
import { buildPageMetadata } from '../../../lib/seo';

export const metadata = buildPageMetadata('Parent Registration', 'Create an Admission Pitara parent account to track admissions and fees.', '/auth/register');

export default function RegisterPage() {
  return (
    <div className="max-w-md mx-auto px-4 py-16 w-full flex flex-col items-center justify-center flex-1">
      <div className="flex items-center gap-2.5 mb-6 select-none">
        <div className="w-10 h-10 rounded-xl bg-[var(--color-primary)] text-white flex items-center justify-center shadow-xs">
          <GraduationCap className="w-5 h-5" />
        </div>
        <span className="text-xl font-extrabold tracking-tight text-[var(--color-content)]">
          Admission Pitara
        </span>
      </div>

      <Card className="w-full">
        <CardHeader>
          <CardTitle>Create Parent Account</CardTitle>
          <CardDescription>Join parents researching schools in Greater Noida West</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input label="Full Name" type="text" placeholder="Parent Name" />
          <Input label="Email address" type="email" placeholder="name@example.com" />
          <Input label="Create Password" type="password" placeholder="••••••••" />
          <Button variant="primary" size="md" className="w-full">
            Register Account
          </Button>
        </CardContent>
        <CardFooter className="justify-center text-xs text-[var(--color-content-muted)]">
          Already registered?{' '}
          <Link href="/auth/login" className="font-semibold text-[var(--color-primary)] ml-1 hover:underline">
            Sign in here
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
