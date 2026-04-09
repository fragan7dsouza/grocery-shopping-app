function PageCard({ title, description, children }) {
  return (
    <section className="page-card">
      <h2>{title}</h2>
      {description ? <p>{description}</p> : null}
      {children}
    </section>
  );
}

export default PageCard;
