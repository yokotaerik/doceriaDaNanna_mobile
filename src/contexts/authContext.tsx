import React, { useState, createContext, ReactNode, useEffect } from "react";
import { api } from "../service/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

type AuthContextData = {
  user: UserProps;
  isAuthenticated: boolean;
  signIn: (loginInfo: SignInProps) => Promise<void>;
  loading: Boolean;
  loadingAuth: Boolean;
  signOut: () => Promise<void>;
};

type UserProps = {
  id: string;
  name: string;
  email: string;
  token: string;
};

type AuthProviderProps = {
  children: ReactNode;
};

type SignInProps = {
  email: string;
  password: string;
};

export const AuthContext = createContext({} as AuthContextData);

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<UserProps>({
    id: "",
    email: "",
    name: "",
    token: "",
  });

  const [loadingAuth, setLoadingAuth] = useState(false);
  const [loading, setLoading] = useState(false);

  const isAuthenticated = !!user.token;

  useEffect(() => {
    async function getUser() {
      const user = await AsyncStorage.getItem(`@daNanna`);

      let hasUser: UserProps = JSON.parse(user || `{}`);

      if (Object.keys(hasUser).length > 0) {
        api.defaults.headers.common[
          `Authorization`
        ] = `Bearer ${hasUser.token}`;

        setUser({
          id: hasUser.id,
          name: hasUser.name,
          email: hasUser.email,
          token: hasUser.token,
        });

        setLoading(false);
      }
    }

    getUser();
  }, []);

  async function signIn({ email, password }: SignInProps) {
    setLoadingAuth(true);

    try {
      const response = await api.post("/login", {
        email,
        password,
      });

      const { id, name, token } = response.data;

      const data = {
        ...response.data,
      };

      await AsyncStorage.setItem("@daNanna", JSON.stringify(data));

      api.defaults.headers.common[`Authorization`] = `Bearer ${token}`;

      setUser({
        id,
        name,
        email,
        token,
      });

      setLoadingAuth(false);
    } catch (err) {
      setLoadingAuth(false);
      console.log(err);
    }
  }

  async function signOut() {
    await AsyncStorage.clear()
      .then(() => {
        setUser({
          id: "",
          email: "",
          name: "",
          token: "",
        });
      })
      .catch((err) => console.log(err));
  }

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, signIn, loading, loadingAuth, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
}
