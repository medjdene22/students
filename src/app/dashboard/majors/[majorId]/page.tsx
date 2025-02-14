import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation'
import React from 'react'

interface Props {
  params: Promise<{
      majorId: string;
  }>
}
export default async function Page({ params }: Props) {

    const session = await auth.api.getSession({headers: await headers()})
    const user = session?.user
    if (!user) redirect('/login')                
    const { majorId } = await params
    
  return (
    <div>major id {majorId}</div>
  )
}
