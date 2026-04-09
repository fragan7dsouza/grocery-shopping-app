import PageCard from '../components/PageCard';

function RegisterPage() {
  return (
    <PageCard title="Register" description="Create a new customer account.">
      <form className="form" onSubmit={(event) => event.preventDefault()}>
        <div className="field">
          <label htmlFor="register-name">Name</label>
          <input id="register-name" type="text" placeholder="Your full name" />
        </div>
        <div className="field">
          <label htmlFor="register-email">Email</label>
          <input id="register-email" type="email" placeholder="you@example.com" />
        </div>
        <div className="field">
          <label htmlFor="register-password">Password</label>
          <input
            id="register-password"
            type="password"
            placeholder="Choose a password"
          />
        </div>
        <button className="btn" type="submit">
          Register
        </button>
      </form>
    </PageCard>
  );
}

export default RegisterPage;
