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

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5242';

export default function PropertyPage({ params }: { params: { id: string } }) {
  const [item, setItem] = useState<Property | null>(null);

  useEffect(() => {
    fetch(`${API_URL}/api/properties/${params.id}`).then(r => r.json()).then(setItem);
  }, [params.id]);

  if (!item) return <p>Cargando...</p>;

  return (
    <div className="card">
      <div className="relative w-full h-64 mb-4">
        <Image src={item.imageUrl} alt={item.name} fill className="object-cover rounded-xl" />
      </div>
      <h1 className="text-xl font-semibold mb-2">{item.name}</h1>
      <p className="text-slate-300 mb-2">{item.addressProperty}</p>
      <p className="text-indigo-300 font-semibold">$ {item.priceProperty.toLocaleString('es-CO')}</p>
      <p className="text-sm text-slate-400 mt-4">Propietario: {item.idOwner}</p>
    </div>
  );
}
