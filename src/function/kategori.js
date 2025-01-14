// src/function/kategori.js
export const fetchKategori = async () => {
  const res = await fetch("/api/kategori");
  if (!res.ok) {
    throw new Error("Network response was not ok");
  }
  return res.json();
};

export const addKategori = async (kategoriData) => {
  const res = await fetch('/api/kategori', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(kategoriData),
  });

  if (!res.ok) {
    throw new Error('Failed to add kategori');
  }
  return res.json();
};

export const updateKategori = async (kategoriData) => {
  const res = await fetch('/api/kategori', {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(kategoriData),
  });

  if (!res.ok) {
    throw new Error('Failed to update kategori');
  }
  return res.json();
};

export const deleteKategori = async (id) => {
  try {
    const response = await fetch(`/api/kategori?id=${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Failed to delete kategori");
    }

    const result = await response.json();
    console.log(result.message);
  } catch (error) {
    console.error(error.message);
  }
};