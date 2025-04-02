import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { obtenerUsuario } from "../services/api"; // Importamos la función desde api.js
import "./Login.css"; // Importamos los estilos

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState(""); // 🔹 Corregido setEmail → setUsername
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // Para evitar múltiples clics

  const handleLogin = async () => {
    setError("");
    setLoading(true);
  
    try {
      const response = await fetch("http://127.0.0.1:8000/api/token/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: username.trim(), password: password.trim() }),
      });
  
      if (!response.ok) {
        throw new Error("Usuario o contraseña incorrectos");
      }
  
      const data = await response.json();
      console.log("🔍 Respuesta de la API:", data); // Verificar nuevamente
  
      if (data.token) {  // 💡 Cambia "access" por "token"
        localStorage.setItem("token", data.token);
        localStorage.setItem("refresh", data.refresh);
      } else {
        throw new Error("No se recibió un token válido");
      }
  
      const userData = await obtenerUsuario();
      if (!userData) {
        throw new Error("No se pudo obtener la información del usuario.");
      }
  
      localStorage.setItem("user", JSON.stringify(userData));
  
      if (userData.rol === "guarda" && userData.copropiedad) {
        localStorage.setItem("copropiedad_id", userData.copropiedad.id);
      }
  
      if (userData.rol === "residente" && !userData.residencia) {
        throw new Error("No tienes una residencia asignada. Contacta con administración.");
      }
  
      navigate(userData.rol === "guarda" ? "/guarda" : "/residente");
  
    } catch (error) {
      setError(error.message);
      console.error("⚠️ Error en login:", error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="login-container">
      <div className="login-box">
        <h1>¡Bienvenid@ a Interna!</h1>
        <p>Controla el acceso de tus visitas y más</p>
        {error && <p className="error-message">{error}</p>}
        <input
          type="text"
          placeholder="Usuario"
          value={username} // 🔹 Corregido email → username
          onChange={(e) => setUsername(e.target.value)} // 🔹 Corregido setEmail → setUsername
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={handleLogin} disabled={loading}>
          {loading ? "Cargando..." : "Iniciar sesión"}
        </button>
      </div>
    </div>
  );
};

export default Login;
