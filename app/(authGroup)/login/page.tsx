
// app/(authGroup)/login/page.tsx
import { LoginForm } from '../_components/LoginForm';

export default function LoginPage() {
  return (
    <div className="flex min-h-[80vh] items-center justify-center p-6">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-semibold">Welcome back</h1>
          <p className="mt-1 text-sm text-muted-foreground">Log in to your GearUp account.</p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}