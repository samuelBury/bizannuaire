export default function Header() {
  const scrollTo = (e, id) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header className="header">
      <div className="header-inner">
        <a href="/" className="logo" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <div className="logo-icon">B</div>
          <div className="logo-text">Biz<span>Annuaire</span></div>
        </a>
        <nav className="header-nav">
          <a href="#sponsoring" onClick={(e) => scrollTo(e, 'sponsoring')}>Sponsoring</a>
          <a href="#contact" onClick={(e) => scrollTo(e, 'contact')}>Contact</a>
        </nav>
      </div>
    </header>
  );
}
