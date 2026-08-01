// app/(authGroup)/register/page.tsx
import { RegisterForm } from '../_components/RegisterForm';

export default function RegisterPage() {
  return (
    <div className="flex min-h-[80vh] items-center justify-center p-6">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-semibold">Create your account</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Rent gear as a customer, or list your own as a provider.
          </p>
        </div>
        <RegisterForm />
      </div>
    </div>
  );
}