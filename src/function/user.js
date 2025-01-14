export const fetchUser = async () => {
  const res = await fetch('/api/user');
  if (!res.ok) {
    throw new Error('Failed to fetch user');
  }
  return res.json();
};

export const addUser = async (userData) => {
  const res = await fetch('/api/user', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });

  if (!res.ok) {
    throw new Error('Failed to add user');
  }

  return res.json();
};

export const updateUser = async (userData) => {
  const res = await fetch('/api/user', {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });

  if (!res.ok) {
    throw new Error('Failed to update user');
  }

  return res.json();
};

export const deleteUser = async (id) => {
  try {
    const response = await fetch(`/api/user?id=${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Failed to delete user");
    }

    const result = await response.json();
    console.log(result.message);
  } catch (error) {
    console.error(error.message);
  }
};