import Head from 'next/head';
import { useAuth } from '../contexts/auth.context';
import { AuthenticatedLayout } from '../components/layout/authenticated';
import { useEffect } from 'react';

export default function Home() {
  const { user, fetchUser } = useAuth();

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return (
    <AuthenticatedLayout>
      <Head>
        <title>Kratos example</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        Wela
        {user && (
          <code>
            <pre>
              {JSON.stringify(user || {}, null, 2)}
            </pre>
          </code>
        )}
      </main>
    </AuthenticatedLayout>
  )
}
