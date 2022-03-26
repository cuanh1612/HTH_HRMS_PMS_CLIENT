import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useCallback,
  useState,
} from "react";
import JWTManager from "../utils/jwt";

interface IAuthContext {
  isAuthenticated: boolean;
  setIsAuthenticated: Dispatch<SetStateAction<boolean>>;
  checkAuth: () => Promise<void>;
  logoutClient: () => void;
}

const defaultIsAuthenticated = false;

export const AuthContext = createContext<IAuthContext>({
  isAuthenticated: defaultIsAuthenticated,
  setIsAuthenticated: () => {},
  checkAuth: () => Promise.resolve(),
  logoutClient: () => {},
});

const AuthContextProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    defaultIsAuthenticated
  );

  const logoutClient = () => {
    JWTManager.deleteToken();
    setIsAuthenticated(false);
  };

  const checkAuth = useCallback(async () => {
    const token = JWTManager.getToken();
    if (token) setIsAuthenticated(true);
    else {
      const success = await JWTManager.getRefreshToken();
      if (success) setIsAuthenticated(true);
    }
  }, []);

  const authContextData = {
    isAuthenticated,
    checkAuth,
    setIsAuthenticated,
    logoutClient,
  };

  return (
    <AuthContext.Provider value={authContextData}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;
