import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { formatMatricula, unmaskMatricula } from "../utils/formatters";

export const useLoginLogic = () => {
  const [nome, setNome] = useState("");
  const [matricula, setMatricula] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleMatriculaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setMatricula(formatMatricula(value));
  };

  const handleNomeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNome(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const unmaskedMatriculaValue = unmaskMatricula(matricula);

    try {
      const success = await login(nome, unmaskedMatriculaValue);
      if (success) {
        setSuccess("Autenticação Validada com sucesso");
        setNome("");
        setMatricula("");
        setTimeout(() => {
          navigate("/");
        }, 2000);
      } else {
        setError("Login falhou. Verifique suas credenciais.");
        setNome("");
        setMatricula("");
      }
    } catch (err) {
      setError("Erro ao tentar fazer login.");
      setNome("");
      setMatricula("");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return {
    nome,
    matricula,
    loading,
    error,
    success,
    handleNomeChange,
    handleMatriculaChange,
    handleSubmit,
  };
};
