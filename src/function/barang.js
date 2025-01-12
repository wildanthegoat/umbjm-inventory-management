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
  
export const fetchBarangById = async (id) => {
    const response = await fetch(`/api/barang/${id}`);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Failed to fetch barang data:', response.status, errorText);
      throw new Error(`Failed to fetch barang data: ${response.status} ${errorText}`);
    }
    
    const data = await response.json();
    return data;
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