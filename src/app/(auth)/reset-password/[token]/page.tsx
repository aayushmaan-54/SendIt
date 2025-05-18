import ResetPasswordForm from "./components/reset-password-form";


export default async function ResetPasswordPage({
  params,
  searchParams,
}: {
  params: Promise<{ token: string }>;
  searchParams: Promise<{ callbackURL: string }>;
}) {
  const { token } = await params;
  const { callbackURL } = await searchParams;

  return (
    <>
      <ResetPasswordForm
        token={token}
        callbackURL={callbackURL}
      />
    </>
  )
}
