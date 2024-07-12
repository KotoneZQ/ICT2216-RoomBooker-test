"use server";

const BACKEND_API_URL = process.env.BACKEND_API_URL;

const API_URL = `${BACKEND_API_URL}/api`; // Update this URL if needed

export const create_user = async (user) => {
  const userPayload = {
    username: user.username,
    email: user.email,
    password: user.password,
    verified: false,
    firstname: user.firstname,
    lastname: user.lastname,
    phone: user.phone,
  };

  console.log(API_URL);
  try {
    const response = await fetch(`${API_URL}/user`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userPayload),
    });
    if (!response.ok) {
      const errorData = await response.json();
      return { success: false, errors: errorData };
    }
    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error("Fetch error:", error);
    return { success: false, errors: { message: error.message } };
  }
};

export const getUsers = async () => {
  const response = await fetch(`${API_URL}/users`);
  if (!response.ok) {
    throw new Error("Network response was not ok\n" + response.statusText);
  }
  return response.json();
};

export const user_login = async (user) => {
  const userPayload = {
    email: user.email,
    password: user.password,
  };
  console.log(API_URL);
  try {
    const response = await fetch(`${API_URL}/user_login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userPayload),
    });
    if (!response.ok) {
      throw new Error("Network response was not ok\n" + response.statusText);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Fetch error:", error);
    throw error;
  }
};

export const verify_link = async (data) => {
  const userPayload = {
    email: data.email,
    get_verify_link: data.get_verify_link,
  };

  try {
    const response = await fetch(`${API_URL}/verify_link`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userPayload),
    });
    if (!response.ok) {
      throw new Error("Network response was not ok\n" + response.statusText);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Fetch error:", error);
    throw error;
  }
};

export const verify_otp = async (data) => {
  const userPayload = {
    email: data.email,
    otp: data.otp,
    otp_purpose: data.otp_purpose,
  };

  try {
    const response = await fetch(`${API_URL}/verify_otp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userPayload),
    });
    if (!response.ok) {
      throw new Error("Network response was not ok\n" + response.statusText);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Fetch error:", error);
    throw error;
  }
};

export const forgot_password = async (data) => {
  const userPayload = {
    email: data.email,
  };

  try {
    const response = await fetch(`${API_URL}/forgot_password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userPayload),
    });
    if (!response.ok) {
      throw new Error("Network response was not ok\n" + response.statusText);
    }

    return response.json();
  } catch (error) {
    console.error("Fetch error:", error);
    throw error;
  }
};

export const change_password = async (data) => {
  const userPayload = {
    email: data.email,
    password: data.password,
  };

  console.log(
    "UserPayload: " + userPayload.email + ", " + userPayload.password
  );
  console.log("UserPayload:: " + JSON.stringify(userPayload));
  try {
    const response = await fetch(`${API_URL}/change_password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userPayload),
    });

    if (!response.ok) {
      throw new Error("Network response was not ok\n" + response.statusText);
    }
    console.log("ResetPassword response: " + response);
    return await response.json();
  } catch (error) {
    console.error("Fetch error:", error);
    throw error;
  }
};

export const toggle_2fa = async (data) => {
  const userPayload = {
    email: data.email,
    login_req_2fa: data.login_req_2fa,
  };

  try {
    console.log("Toggle Payload: ", userPayload);
    const response = await fetch(`${API_URL}/toggle_2fa`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userPayload),
    });

    if (!response.ok) {
      throw new Error("Network response was not ok\n" + response.statusText);
    }

    return response.json();
  } catch (error) {
    console.error("Fetch error:", error);
    throw error;
  }
};

export const retrieve_profile = async (data) => {
  try {
    const response = await fetch(`${API_URL}/user/${data}`);
    return await response.json();
  } catch (error) {
    console.error("Fetch error:", error);
    throw error;
  }
};

export const update_profile = async (data) => {
  console.log("Updating Profile: " + data);
  try {
    const response = await fetch(`${API_URL}/update_profile`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Network response was not ok\n" + response.statusText);
    }
    return await response.json();
  } catch (error) {
    console.error("Fetch error:", error);
    throw error;
  }
};

export const get_all_users = async () => {
  try {
    const response = await fetch(`${API_URL}/users`, {
      method: 'GET',
      headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store',
      },
      cache: 'no-store',
      });
  
      if (!response.ok) {
          const errorData = await response.json();
          throw new Error("Reservations data fetching response not ok: " + errorData.detail || 'Failed to get reservation data');
      }
      return response.json();
  } catch (error) {
    throw error;
  }
}

export const delete_user = async (userId) => {
  try {
    const response = await fetch(`${API_URL}/users/${userId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || "Failed to delete user");
    }
    return response.json();
  } catch (error) {
    throw error;
  }
};