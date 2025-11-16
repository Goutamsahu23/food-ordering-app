// frontend/components/Navbar.tsx
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { clearToken } from '../store/slices/authSlice';
import { BsCart3 } from 'react-icons/bs';
import { clearCart } from '@/store/slices/cartSlice';

export default function Navbar() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector((s) => s.cart.items);
  const user = useAppSelector((s) => s.auth.user);

  function handleLogout() {
    dispatch(clearToken());
    dispatch(clearCart());
    router.push('/login');
  }

  return (
    <header className="container site-header">
      {/* Brand */}
      <Link href="/" className="brand" aria-label="Home">
        <div className="logo">MF</div>
        <div className="title">
          <div className="name">Marvel Food</div>
          <div className="tag">Smart ordering for teams</div>
        </div>
      </Link>

      {/* Right section */}
      <div className="header-actions">
        {/* If logged in show user + logout + admin link + cart */}
        {user ? (
          <div className="header-card" role="region" aria-label="User menu">
            <div className="avatar-box" aria-hidden>
              {user.email ? user.email[0].toUpperCase() : 'U'}
            </div>

            <div style={{ marginLeft: 8 }}>
              <div style={{ fontWeight: 700 }}>{user.email}</div>
              <div className="small">{user.role}</div>
            </div>

            <Link href="/cart" className="header-card" aria-label="Cart">

              <div style={{ minWidth: 28, textAlign: 'center', fontWeight: 700 }}>{cartItems.length}</div>
              <div style={{ minWidth: 28, textAlign: 'center', fontSize: 24 }}>
                <BsCart3 />
              </div>

            </Link>

            {/* Admin-only quick link */}
            {user.role === 'admin' && (
              <Link href="/admin/payments" className="btn btn-ghost" style={{ marginLeft: 10 }}>
                Manage payments
              </Link>
            )}

            <button className="btn btn-ghost" onClick={handleLogout} style={{ marginLeft: 10 }}>
              Logout
            </button>
          </div>
        ) : (
          <Link href="/login" className="btn btn-primary">Login</Link>
        )}
      </div>
    </header>
  );
}
