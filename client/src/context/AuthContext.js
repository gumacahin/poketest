import React, { useState, useEffect } from "react";
import { useQuery } from "react-query";
import axios from "axios";

const AuthContext = React.createContext();

const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    try {
      setUser(JSON.parse(localStorage.getItem("user")));
    } catch (e) {
      setUser(null);
    }
  }, []);

  // const query = useQuery({
  //   queryKey: ["user"],
  //   queryFn: async () => {
  //     const res = await axios.get("/user", {
  //       headers: { Authorization: user.username },
  //     });
  //     return res.data;
  //   },
  //   options: { enabled: Boolean(user) },
  // });

  // if (query.data?.user) {
  //   setUser(query.data.user);
  // }

  const signIn = (user) => {
    localStorage.setItem("user", JSON.stringify(user));
    setUser(user);
  };

  const signOut = () => {
    setUser(null);
    localStorage.clear();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContextProvider, AuthContext };
