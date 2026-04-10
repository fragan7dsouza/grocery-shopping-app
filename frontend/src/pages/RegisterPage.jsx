import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageCard from '../components/PageCard';
import { registerUser } from '../services/authService';

function RegisterPage() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    setIsLoading(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      await registerUser({ name, email, password, role: 'customer' });
      setSuccessMessage('Registration successful. Please login to continue.');
      setName('');
      setEmail('');
      setPassword('');

      setTimeout(() => {
        navigate('/login');
      }, 700);
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || 'Unable to register right now.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageCard title="Register" description="Create a new customer account.">
      {errorMessage ? <p className="state-text error">{errorMessage}</p> : null}
      {successMessage ? <p className="state-text">{successMessage}</p> : null}

      <form className="form" onSubmit={handleSubmit}>
        <div className="field">
          <label htmlFor="register-name">Name</label>
          <input
            id="register-name"
            type="text"
            placeholder="Your full name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
          />
        </div>
        <div className="field">
          <label htmlFor="register-email">Email</label>
          <input
            id="register-email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </div>
        <div className="field">
          <label htmlFor="register-password">Password</label>
          <input
            id="register-password"
            type="password"
            placeholder="Choose a password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </div>
        <button className="btn" type="submit" disabled={isLoading}>
          {isLoading ? 'Registering...' : 'Register'}
        </button>
      </form>
    </PageCard>
  );
}

export default RegisterPage;
