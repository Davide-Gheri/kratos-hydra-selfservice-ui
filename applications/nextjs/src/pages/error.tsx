import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { kratosPublic } from '../kratos';

export default function ErrorPage() {
  const router = useRouter();
  useEffect(() => {
    if (!router.isReady) {
      return;
    }
    const error: string = router.query.error as string;
    if (error) {
      kratosPublic.getSelfServiceError(error)
        .then(({ data }) => console.log(data))
        .catch(console.log);
    }

  }, [router]);
  return (
    <div>Error</div>
  )
}
