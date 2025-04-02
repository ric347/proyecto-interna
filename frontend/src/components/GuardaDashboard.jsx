import { useEffect, useState } from "react";
import NuevoAccesoForm from "./NuevoAccesoForm";

function GuardaDashboard() {
  const [accesos, setAccesos] = useState([]);
  const [residenteId, setResidenteId] = useState(null);


  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/user/", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Error ${res.status}: ${res.statusText}`);
        }
        return res.json();
      })
      .then((data) => setResidenteId(data.id))
      .catch((error) => console.error("Error obteniendo usuario:", error));
  }, []);
  

  // Obtener accesos desde la API
  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/accesos/", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setAccesos(data))
      .catch((error) => console.error("Error cargando accesos:", error));
  }, []);

  return (
    <div>
      <h2>Panel del Guarda</h2>
      {residenteId ? (
        <NuevoAccesoForm setAccesos={setAccesos} residenteId={residenteId} />
      ) : (
        <p>Cargando datos del usuario...</p>
      )}

      <h3>Accesos registrados</h3>
      <ul>
        {accesos.map((acceso) => (
          <li key={acceso.id}>
            {acceso.visitante} - {acceso.estado}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default GuardaDashboard;
