import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api/";

// Configurar axios con el token de autenticación
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  if (!token) {
    console.error("⚠️ No hay token en localStorage");
    return { headers: {} }; // Evitar enviar un token inválido
  }
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};


// Obtener datos del usuario autenticado
export const obtenerUsuario = async () => {
  try {
    const response = await axios.get(`${API_URL}user/`, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error("Error obteniendo datos del usuario:", error.response?.data || error.message);
    return null;
  }
};

// Obtener copropiedades
export const obtenerCopropiedades = async () => {
  try {
    const response = await axios.get(`${API_URL}copropiedades/`, getAuthHeaders());
    return response.data;
  } catch (error) {
    console.error("Error obteniendo copropiedades:", error.response?.data || error.message);
    return [];
  }
};
