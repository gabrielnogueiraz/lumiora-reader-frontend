import React from 'react';
import { Navigate } from 'react-router-dom';
import FormContainer from '../../components/FormContainer/FormContainer';
import RegisterForm from '../../components/RegisterForm/RegisterForm';
import { useAuth } from '../../contexts/AuthContext';

const Register: React.FC = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div>Carregando...</div>;
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <FormContainer 
      title="Crie sua conta no Lumiora" 
      subtitle="Registre-se para acessar nosso leitor inteligente de PDFs"
    >
      <RegisterForm />
    </FormContainer>
  );
};

export default Register;