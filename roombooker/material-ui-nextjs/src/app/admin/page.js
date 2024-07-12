"use client";

import React, { useState, useEffect } from "react";
import useRole from "@/hooks/useRole";
import { CircularProgress } from "@mui/material";
import { get_all_users, delete_user } from "@/repository/用户Repo";

const AdminPage = () => {
  const isAdmin = useRole(["admin"]);
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAllUsers = async () => {
      if (isAdmin === null) {
        // Still loading user data, do nothing
        return;
      }
      if (isAdmin) {
        setIsLoading(false);
        // Fetch all users
        const data = await get_all_users();
        setUsers(data);
      } else if (isAdmin === false) {
        setIsLoading(false);
      }
    };
    fetchAllUsers();
  }, [isAdmin]);

  const handleDeleteUser = async (userId) => {
    try {
      await delete_user(userId);
      setUsers(users.filter((user) => user.user_id !== userId));
    } catch (error) {
      console.error("Failed to delete user:", error);
    }
  };

  if (isLoading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "80vh" }}>
        <CircularProgress />
      </div>
    );
  }

  if (!isAdmin) {
    return <div>Access denied. You do not have permission to view this page.</div>;
  }

  return (
    <div>
      <h1>Admin Page</h1>
      <ul>
        {users.map((user) => (
          <li key={user.user_id}>
            {user.username} ({user.email}){" "}
            <button onClick={() => handleDeleteUser(user.user_id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminPage;
