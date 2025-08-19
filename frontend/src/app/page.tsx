'use client';

import Image from 'next/image';
import { useEffect, useState, useCallback } from 'react';
import { FaImage } from 'react-icons/fa';

type Property = {
  id: string;
  idOwner: string;
  name: string;
  addressProperty: string;
  priceProperty: number;
  imageUrl: string;
};

type ApiResponse = {
  total: number;
  page: number;
  pageSize: number;
  data: Property[];
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5242';

export default function HomePage() {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<Property[]>([]);
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());

  const handleImageError = (propertyId: string) => {
    setImageErrors(prev => new Set([...prev, propertyId]));
  };

  const fetchData = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (name) params.set('name', name);
    if (address) params.set('address', address);
    if (minPrice) params.set('minPrice', minPrice);
    if (maxPrice) params.set('maxPrice', maxPrice);
    params.set('page', '1');
    params.set('pageSize', '24');

    try {
      const res = await fetch(`${API_URL}/api/properties?${params.toString()}`);
      if (!res.ok) throw new Error(`Error: ${res.status}`);
      const json: ApiResponse = await res.json();
      setItems(json.data);
      // Reset image errors when new data loads
      setImageErrors(new Set());
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  }, [name, address, minPrice, maxPrice]);

  useEffect(() => { 
    fetchData(); 
  }, [fetchData]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Propiedades</h1>

      <div className="card grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <input 
          className="input" 
          placeholder="Nombre" 
          value={name} 
          onChange={e => setName(e.target.value)} 
        />
        <input 
          className="input" 
          placeholder="Dirección" 
          value={address} 
          onChange={e => setAddress(e.target.value)} 
        />
        <input 
          className="input" 
          placeholder="Precio mínimo" 
          value={minPrice} 
          onChange={e => setMinPrice(e.target.value)} 
        />
        <input 
          className="input" 
          placeholder="Precio máximo" 
          value={maxPrice} 
          onChange={e => setMaxPrice(e.target.value)} 
        />
        <button 
          onClick={fetchData} 
          className="btn col-span-full sm:col-span-1"
          disabled={loading}
        >
          {loading ? 'Buscando...' : 'Buscar'}
        </button>
      </div>

      {loading ? (
        <p>Cargando...</p>
      ) : (
        <div className="grid-cards">
          {items.map(p => (
            <a key={p.id} href={`/property/${p.id}`} className="card hover:bg-slate-800/80">
              <div className="relative h-40 w-full mb-3 bg-gray-800 rounded-xl overflow-hidden">
                {!imageErrors.has(p.id) ? (
                  <Image
                    src={p.imageUrl}
                    alt={p.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    onError={() => handleImageError(p.id)}
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <FaImage className="text-gray-400 text-3xl" />
                  </div>
                )}
              </div>
              <div className="space-y-1">
                <h3 className="font-medium">{p.name}</h3>
                <p className="text-sm text-slate-300">{p.addressProperty}</p>
                <p className="text-sm text-indigo-300 font-semibold">$ {p.priceProperty.toLocaleString('es-CO')}</p>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}