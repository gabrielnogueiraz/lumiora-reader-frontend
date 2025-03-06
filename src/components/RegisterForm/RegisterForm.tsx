import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import FormInput from '../FormInput/FormInput';
import FormButton from '../FormButton/FormButton';
import { useAuth } from '../../contexts/AuthContext';
import styles from './RegisterForm.module.css';

const RegisterForm: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState('');

  const { signUp } = useAuth();

  const validate = () => {
    const newErrors: {
      name?: string;
      email?: string;
      password?: string;
      confirmPassword?: string;
    } = {};

    if (!name.trim()) newErrors.name = 'Nome é obrigatório';
    
    if (!email) newErrors.email = 'E-mail é obrigatório';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'E-mail inválido';
    
    if (!password) newErrors.password = 'Senha é obrigatória';
    else if (password.length < 6) newErrors.password = 'A senha deve ter pelo menos 6 caracteres';
    
    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'As senhas não coincidem';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError('');
    
    if (!validate()) return;
    
    setIsSubmitting(true);
    try {
      await signUp(name, email, password);
    } catch (error: any) {
      setApiError(error.message || 'Falha ao criar conta. Por favor, tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      {apiError && <div className={styles.errorMessage}>{apiError}</div>}
      
      <FormInput
        label="Nome"
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Seu nome completo"
        error={errors.name}
        disabled={isSubmitting}
      />
      
      <FormInput
        label="E-mail"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Seu e-mail"
        error={errors.email}
        disabled={isSubmitting}
      />
      
      <FormInput
        label="Senha"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Crie uma senha"
        error={errors.password}
        disabled={isSubmitting}
      />
      
      <FormInput
        label="Confirmar Senha"
        type="password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        placeholder="Confirme sua senha"
        error={errors.confirmPassword}
        disabled={isSubmitting}
      />
      
      <FormButton type="submit" fullWidth disabled={isSubmitting}>
        {isSubmitting ? 'Criando conta...' : 'Criar conta'}
      </FormButton>
      
      <p className={styles.loginLink}>
        Já tem uma conta?{' '}
        <Link to="/login" className={styles.link}>Entrar</Link>
      </p>
    </form>
  );
};

export default RegisterForm;