import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageCard from '../components/PageCard';
import { loginUser } from '../services/authService';
import { useAuth } from '../context/AuthContext';

function LoginPage() {
  const navigate = useNavigate();
  const { saveSession } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    setIsLoading(true);
    setErrorMessage('');

    try {
      const data = await loginUser({ email, password });
      saveSession({ user: data.user, token: data.token });
      navigate('/');
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'Unable to login right now.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageCard title="Login" description="Sign in to your account.">
      {errorMessage ? <p className="state-text error">{errorMessage}</p> : null}

      <form className="form" onSubmit={handleSubmit}>
        <div className="field">
          <label htmlFor="login-email">Email</label>
          <input
            id="login-email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </div>
        <div className="field">
          <label htmlFor="login-password">Password</label>
          <input
            id="login-password"
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </div>
        <button className="btn" type="submit" disabled={isLoading}>
          {isLoading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </PageCard>
  );
}

export default LoginPage;
