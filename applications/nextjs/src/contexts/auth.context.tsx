import { createContext, FC, useCallback, useContext, useMemo, useState } from 'react';
import { kratosPublic } from '../kratos';
import { AxiosError } from 'axios';

export type User = any;

const AuthContext = createContext<{
  user: User | null,
  fetchUser: () => Promise<User>;
}>({
  user: null,
  fetchUser: () => Promise.resolve(),
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: FC<{ onError: (err: AxiosError) => void }> = ({ children, onError }) => {
  const [user, setUser] = useState<any>(null);

  const fetchUser = useCallback(() => {
    return kratosPublic.whoami()
    .then(({ data }) => {
      setUser(data);
      return data;
    })
    .catch(onError);
  }, [onError, setUser]);

  const value = useMemo(() => ({
    user, fetchUser,
  }), [user, fetchUser]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
