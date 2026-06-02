import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function AuthPage() {
  const { login, register } = useAuth();
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '' });
  const [error, setError] = useState('');

  const submit = async (event) => {
    event.preventDefault();
    setError('');

    try {
      if (mode === 'login') {
        await login(form.email, form.password);
      } else {
        await register(form);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'No se pudo autenticar');
    }
  };

  return (
    <main className="auth-shell">
      <div className="auth-card">
        <h1>TaskFlow Boards</h1>
        <p>Gestion colaborativa estilo Trello con realtime y prioridades.</p>

        <div className="auth-switch">
          <button className={mode === 'login' ? 'active' : ''} type="button" onClick={() => setMode('login')}>
            Iniciar sesion
          </button>
          <button className={mode === 'register' ? 'active' : ''} type="button" onClick={() => setMode('register')}>
            Registrarse
          </button>
        </div>

        <form onSubmit={submit} className="auth-form">
          {mode === 'register' ? (
            <>
              <input
                placeholder="Nombre"
                value={form.name}
                onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                required
              />
              <input
                placeholder="Telefono WhatsApp"
                value={form.phone}
                onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))}
              />
            </>
          ) : null}
          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
            required
          />
          {error ? <p className="error-text">{error}</p> : null}
          <button type="submit">{mode === 'login' ? 'Entrar' : 'Crear cuenta'}</button>
        </form>
      </div>
    </main>
  );
}
