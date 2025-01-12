export const fetchLokasi = async () => {
  const res = await fetch('/api/lokasi');
  if (!res.ok) {
    throw new Error('Failed to fetch lokasi');
  }
  return res.json();
};

export const addLokasi = async (lokasiData) => {
  const res = await fetch('/api/lokasi', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(lokasiData),
  });

  if (!res.ok) {
    throw new Error('Failed to add lokasi');
  }

  return res.json();
};
export const updateLokasi = async (lokasiData) => {
  const res = await fetch('/api/lokasi', {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(lokasiData),
  });

  if (!res.ok) {
    throw new Error('Failed to update lokasi');
  }
  return res.json();
};


