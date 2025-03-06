import React from 'react';
import styles from './FormContainer.module.css';

interface FormContainerProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

const FormContainer: React.FC<FormContainerProps> = ({ children, title, subtitle }) => {
  return (
    <div className={styles.container}>
      <div className={styles.formCard}>
        <h1 className={styles.title}>{title}</h1>
        {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
        {children}
      </div>
    </div>
  );
};

export default FormContainer;