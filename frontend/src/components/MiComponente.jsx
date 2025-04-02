import { useEffect, useState } from 'react';
import { obtenerCopropiedades } from '../services/api'; // Importa la función de API

const MiComponente = () => {
  const [copropiedades, setCopropiedades] = useState([]);

  useEffect(() => {
    obtenerCopropiedades().then(data => {
      console.log("Copropiedades:", data);
      setCopropiedades(data);
    });
  }, []);

  return (
    <div>
      <h2>Lista de Copropiedades</h2>
      <ul>
        {copropiedades.length > 0 ? (
          copropiedades.map((cop) => <li key={cop.id}>{cop.nombre}</li>)
        ) : (
          <p>No hay copropiedades disponibles</p>
        )}
      </ul>
    </div>
  );
};

export default MiComponente;
