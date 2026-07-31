// Renders <LoginForm/>, reads ?redirectTo= set by proxy.ts so post-login redirect returns the user where they were headed

export default function AuthgroupLoginPage() {
  return (
    <div className="p-6">
      <h1 className="text-lg font-semibold">authGroup / login — page</h1>
      <p className="text-sm text-muted-foreground">
        Placeholder — see the comment above this component for what belongs here.
      </p>
    </div>
  );
}
