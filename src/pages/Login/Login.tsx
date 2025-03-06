import React from 'react';
import { Navigate } from 'react-router-dom';
import FormContainer from '../../components/FormContainer/FormContainer';
import LoginForm from '../../components/LoginForm/LoginForm';
import { useAuth } from '../../contexts/AuthContext';

const Login: React.FC = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div>Carregando...</div>;
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <FormContainer 
      title="Bem-vindo ao Lumiora" 
      subtitle="Entre com sua conta para acessar o leitor de PDFs"
    >
      <LoginForm />
    </FormContainer>
  );
};

export default Login;