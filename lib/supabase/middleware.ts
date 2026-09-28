import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet: Array<{ name: string; value: string; options?: CookieOptions }>) {
          cookiesToSet.forEach(({ name, value }) => {
            request.cookies.set(name, value)
          })
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) => {
            supabaseResponse.cookies.set(name, value, options)
          })
        },
      },
    }
  )

  // Appel obligatoire pour rafraîchir le token si besoin
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const pathname = request.nextUrl.pathname
  const isPatientRoute = pathname === '/patient' || pathname.startsWith('/patient/')
  const isPharmacyRoute = pathname === '/pharmacien' || pathname.startsWith('/pharmacien/')
  const isDashboardRoute = pathname === '/dashboard' || pathname.startsWith('/dashboard/')
  const accountRole = user?.user_metadata.role

  if (isPharmacyRoute && (!user || accountRole !== 'pharmacien')) {
    const url = request.nextUrl.clone()
    if (user && accountRole === 'patient') {
      url.pathname = '/patient'
      url.search = ''
    } else {
      url.pathname = '/login'
      url.search = '?role=pharmacien'
    }
    return NextResponse.redirect(url)
  }

  if (isPatientRoute && user && accountRole === 'pharmacien') {
    const url = request.nextUrl.clone()
    url.pathname = '/pharmacien'
    url.search = ''
    return NextResponse.redirect(url)
  }

  if (isDashboardRoute && !user) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    url.search = ''
    return NextResponse.redirect(url)
  }

  if (isDashboardRoute && user && (accountRole === 'patient' || accountRole === 'pharmacien')) {
    const url = request.nextUrl.clone()
    url.pathname = accountRole === 'patient' ? '/patient' : '/pharmacien'
    url.search = ''
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}
