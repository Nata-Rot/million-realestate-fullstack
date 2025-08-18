'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';

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

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5168';

export default function HomePage() {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<Property[]>([]);

  const fetchData = async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (name) params.set('name', name);
    if (address) params.set('address', address);
    if (minPrice) params.set('minPrice', minPrice);
    if (maxPrice) params.set('maxPrice', maxPrice);
    params.set('page', '1');
    params.set('pageSize', '24');

    const res = await fetch(`${API_URL}/api/properties?${params.toString()}`);
    const json: ApiResponse = await res.json();
    setItems(json.data);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Propiedades</h1>
      <div className="card grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <input className="input" placeholder="Nombre" value={name} onChange={e=>setName(e.target.value)} />
        <input className="input" placeholder="Dirección" value={address} onChange={e=>setAddress(e.target.value)} />
        <input className="input" placeholder="Precio mínimo" value={minPrice} onChange={e=>setMinPrice(e.target.value)} />
        <input className="input" placeholder="Precio máximo" value={maxPrice} onChange={e=>setMaxPrice(e.target.value)} />
        <button onClick={fetchData} className="btn col-span-full sm:col-span-1">Buscar</button>
      </div>

      {loading ? <p>Cargando...</p> : (
        <div className="grid-cards">
          {items.map(p => (
            <a key={p.id} href={`/property/${p.id}`} className="card hover:bg-slate-800/80">
              <div className="relative h-40 w-full mb-3">
                <Image src={p.imageUrl} alt={p.name} fill className="object-cover rounded-xl" />
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
