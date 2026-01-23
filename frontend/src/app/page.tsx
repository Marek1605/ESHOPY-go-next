'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  useEffect(() => {
    router.push('/admin');
  }, [router]);
  
  return (
    <div className="min-h-screen aurora-bg flex items-center justify-center">
      <div className="animate-spin h-12 w-12 border-4 border-blue-500 border-t-transparent rounded-full" />
    </div>
  );
}
