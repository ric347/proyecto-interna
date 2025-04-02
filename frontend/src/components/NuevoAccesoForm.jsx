import { useState, useEffect } from "react";

function NuevoAccesoForm({ setAccesos }) {
  const [visitante, setVisitante] = useState("");
  const [documento, setDocumento] = useState("");
  const [residencia, setResidencia] = useState("");
  const [residencias, setResidencias] = useState([]);
  const [residentes, setResidentes] = useState({});
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    setCargando(true);
  
    const copropiedadId = localStorage.getItem("copropiedad_id");
    if (!copropiedadId) {
      console.error("No se encontró el ID de la copropiedad en localStorage");
      setCargando(false);
      return;
    }
  
    fetch(`http://127.0.0.1:8000/api/residencias_por_copropiedad/?copropiedad_id=${copropiedadId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Datos recibidos del backend:", data); // 🔹 NUEVO LOG
  
        if (!Array.isArray(data)) {
          console.error("La respuesta del servidor no es una lista de residencias:", data);
          throw new Error("Formato inesperado en la respuesta del backend");
        }
  
        setResidencias(data);
  
        // Mapeo de residencias a residentes
        const residentesMap = {};
        data.forEach((res) => {
          if (res.residente) {
            residentesMap[res.id] = res.residente.id;
          }
        });
        setResidentes(residentesMap);
      })
      .catch((error) => console.error("Error cargando residencias:", error))
      .finally(() => setCargando(false));
  }, []);
  

  const handleSubmit = async (e) => {
    e.preventDefault();

/*    if (!residencia || !residentes[residencia]) {
      alert("Debe seleccionar una residencia válida.");
      return;
    }
*/
    if (!residencia) {
      alert("Debe seleccionar una residencia válida.");
      return;
    }
    
    const nuevoAcceso = {
      visitante_nombre: visitante,
      documento: documento,
      estado: "pendiente",
      residente: residentes[residencia], // 🔹 ID del residente
      residencia: residencia, // 🔹 ID de la residencia
    };

    const response = await fetch("http://127.0.0.1:8000/api/accesos/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(nuevoAcceso),
    });

    if (response.ok) {
      const data = await response.json();
      setAccesos((prev) => [...prev, data]);
      setVisitante("");
      setDocumento("");
      setResidencia("");
    } else {
      console.error("Error al registrar acceso");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Nombre del visitante"
        value={visitante}
        onChange={(e) => setVisitante(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Documento de identidad"
        value={documento}
        onChange={(e) => setDocumento(e.target.value)}
        required
      />

      {/* Selector de residencias */}
      {cargando ? (
        <p>Cargando residencias...</p>
      ) : residencias.length === 0 ? (
        <p>No hay residencias registradas para esta copropiedad.</p>
      ) : (
        <select value={residencia} onChange={(e) => setResidencia(e.target.value)} required>
          <option value="">Seleccione residencia</option>
          {residencias.map((res) => (
            <option key={res.id} value={res.id}>
              {res.nombre ? `Residencia ${res.nombre}` : "Sin número"} - {" "}
              {res.residente ? res.residente : "Sin residente"}
            </option>
          ))}
        </select>
      )}

      <button type="submit" disabled={residencias.length === 0}>
        Registrar Acceso
      </button>
    </form>
  );
}

export default NuevoAccesoForm;
