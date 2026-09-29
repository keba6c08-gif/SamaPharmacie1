import { LoginForm } from './login-form'

export default async function LoginPage({
  searchParams,
}: {
  searchParams?: Promise<{ role?: string; error?: string; message?: string }>
}) {
  const params = searchParams ? await searchParams : {}
  const errorMessage = params.error
  const infoMessage = params.message

  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-[#e9f7ef] px-4 py-10">
      <LoginForm errorMessage={errorMessage} infoMessage={infoMessage} />
    </div>
  )
}
