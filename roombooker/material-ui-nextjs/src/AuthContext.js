"use client";
import React, { createContext, useState, useContext, useEffect } from "react";
import Cookies from "js-cookie";

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState({});

  const login = (userData) => {
    setUser(userData);
    const tenMinutes = new Date(new Date().getTime() + 10 * 60 * 1000);

    Cookies.set("user", JSON.stringify(userData), {
      expires: tenMinutes,
      sameSite: "strict",
    });
  };

  const logout = () => {
    setUser(null);
    Cookies.remove("user");
    window.location.href = "/landing";
  };

  useEffect(() => {
    const storedUser = Cookies.get("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      setUser(null); // Explicitly set null if no stored user
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
