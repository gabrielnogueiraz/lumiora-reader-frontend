import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import FormInput from '../FormInput/FormInput';
import FormButton from '../FormButton/FormButton';
import { useAuth } from '../../contexts/AuthContext';
import styles from './LoginForm.module.css';

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState('');

  const { signIn } = useAuth();

  const validate = () => {
    const newErrors: { email?: string; password?: string } = {};
    if (!email) newErrors.email = 'E-mail é obrigatório';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'E-mail inválido';
    
    if (!password) newErrors.password = 'Senha é obrigatória';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError('');
    
    if (!validate()) return;
    
    setIsSubmitting(true);
    try {
      await signIn(email, password);
    } catch (error: any) {
      setApiError(error.message || 'Falha ao fazer login. Por favor, verifique suas credenciais.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      {apiError && <div className={styles.errorMessage}>{apiError}</div>}
      
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
        placeholder="Sua senha"
        error={errors.password}
        disabled={isSubmitting}
      />
      
      <FormButton type="submit" fullWidth disabled={isSubmitting}>
        {isSubmitting ? 'Entrando...' : 'Entrar'}
      </FormButton>
      
      <p className={styles.registerLink}>
        Não tem uma conta?{' '}
        <Link to="/register" className={styles.link}>Cadastre-se</Link>
      </p>
    </form>
  );
};

export default LoginForm;