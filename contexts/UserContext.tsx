import React, { createContext, useContext, useState, ReactNode } from "react";

type UserContextType = {
  isProUser: boolean;
  setIsProUser: (value: boolean) => void;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [isProUser, setIsProUser] = useState(false);

  return (
    <UserContext.Provider value={{ isProUser, setIsProUser }}>
      {children}
    </UserContext.Provider>
  );
};

export function useUser() {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser must be used within UserProvider");
  return context;
}