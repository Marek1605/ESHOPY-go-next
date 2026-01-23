import { redirect } from 'next/navigation';

export default function Home() {
  // Skip template selection - go directly to admin
  redirect('/admin');
}
