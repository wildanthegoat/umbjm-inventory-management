// src/function/barang.js
import { prisma } from '@/lib/prisma';

export const fetchBarang = async () => {
    const res = await fetch('/api/barang');
    if (!res.ok) {
      throw new Error('Failed to fetch barang');
    }
    return res.json();
  };
  
export const addBarang = async (barangData) => {
    const res = await fetch('/api/barang', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: "include",
      body: JSON.stringify(barangData),
    });
  
    if (!res.ok) {
      throw new Error('Failed to add Barang');
    }
  
    return res.json();
  };

  export const updateBarang = async (barangData) => {
    const res = await fetch('/api/barang', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(barangData),
    });
  
    if (!res.ok) {
      throw new Error('Failed to update barang');
    }
    return res.json();
  };

  export const deleteBarang = async (id) => {
    try {
      const response = await fetch(`/api/barang?id=${id}`, {
        method: "DELETE",
      });
  
      if (!response.ok) {
        throw new Error("Failed to delete barang");
      }
  
      const result = await response.json();
      console.log(result.message);
    } catch (error) {
      console.error(error.message);
    }
  };