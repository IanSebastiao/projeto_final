import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getFornecedores } from '../services/fornecedorService';
import './LoginPage.css';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [fornecedoresCount, setFornecedoresCount] = useState(0);
  const { login, user, isAdmin } = useAuth();
  const navigate = useNavigate();

  // Carregar quantidade de fornecedores quando admin está logado
  useEffect(() => {
    if (user && isAdmin) {
      (async () => {
        try {
          const fornecedores = await getFornecedores();
          setFornecedoresCount(fornecedores?.length || 0);
        } catch (error) {
          console.error('Erro ao carregar fornecedores:', error);
          setFornecedoresCount(0);
        }
      })();
    }
  }, [user, isAdmin]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/');
    } catch (error) {
      setError('Email ou senha incorretos');
      console.error('Erro no login:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-header">
          <h1>Entrar</h1>
          <p>Senac Estoque - Controle de Estoque</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="seu@exemplo.com"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Senha</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Digite sua senha"
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            className="auth-button"
            disabled={loading}
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        {user && isAdmin && (
          <div className="admin-info">
            <p>🏢 Total de fornecedores: <strong>{fornecedoresCount}</strong></p>
          </div>
        )}

        <div className="auth-links">
          <p>
            Não tem uma conta?{' '}
            <Link to="/register" className="auth-link">
              Registrar-se
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
