"use client";

import { useAuth } from "@/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const useRole = (allowedRoles) => {
  const { user } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkUserRole = async () => {
      try {
        // Wait until the user data is defined (not undefined and not an empty object)
        if (user === undefined || Object.keys(user).length === 0) {
          setIsLoading(true);
        } else if (user === null) {
          setIsLoading(false);
          router.push("/landing");
        } else {
          setIsLoading(false);
          if (user && !allowedRoles.includes(user.role)) {
            router.push("/landing");
          } else {
            console.log("User role allowed");
          }
        }
      } catch (error) {
        //console.error("Error checking user role:", error);
        setIsLoading(false);
        router.push("/landing");
      }
    };

    checkUserRole();
  }, [user]);

  if (isLoading) {
    return false; // Return false while loading
  }

  return user && allowedRoles.includes(user.role);
};

export default useRole;
