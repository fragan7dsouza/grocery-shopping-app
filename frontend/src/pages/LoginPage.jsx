import PageCard from '../components/PageCard';

function LoginPage() {
  return (
    <PageCard title="Login" description="Sign in to your account.">
      <form className="form" onSubmit={(event) => event.preventDefault()}>
        <div className="field">
          <label htmlFor="login-email">Email</label>
          <input id="login-email" type="email" placeholder="you@example.com" />
        </div>
        <div className="field">
          <label htmlFor="login-password">Password</label>
          <input id="login-password" type="password" placeholder="Enter password" />
        </div>
        <button className="btn" type="submit">
          Login
        </button>
      </form>
    </PageCard>
  );
}

export default LoginPage;
