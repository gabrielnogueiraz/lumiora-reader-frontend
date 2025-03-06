import React from 'react';
import styles from './FormInput.module.css';

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

const FormInput: React.FC<FormInputProps> = ({ 
  label, 
  error, 
  id, 
  ...props 
}) => {
  return (
    <div className={styles.inputContainer}>
      <label htmlFor={id} className={styles.label}>
        {label}
      </label>
      <input 
        id={id} 
        className={`${styles.input} ${error ? styles.error : ''}`} 
        {...props} 
      />
      {error && <p className={styles.errorMessage}>{error}</p>}
    </div>
  );
};

export default FormInput;