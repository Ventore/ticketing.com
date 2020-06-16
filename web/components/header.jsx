import Link from 'next/link';

export default ({ user }) => {
  const links = [
    !user && { label: 'Sign up', href: '/auth/signup' },
    !user && { label: 'Sign in', href: '/auth/signin' },
    user && { label: 'My orders', href: '/orders' },
    user && { label: 'Sell ticket', href: '/tickets/new' },
    user && { label: 'Sign out', href: '/auth/signout' },
  ]
    .filter((link) => link)
    .map((link, i) => (
      <li key={i} className="nav-item">
        <Link href={link.href}>
          <a className="nav-link">{link.label}</a>
        </Link>
      </li>
    ));

  return (
    <nav className="navbar navbar-ligh bg-light">
      <Link href="/">
        <a href="" className="navbar-brand">
          GitTix
        </a>
      </Link>
      <div className="d-flex justify-content-end">
        <ul className="nav d-flex align-items-center">{links}</ul>
      </div>
    </nav>
  );
};
