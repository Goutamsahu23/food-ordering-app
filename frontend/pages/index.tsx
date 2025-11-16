import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import api from '../lib/api';
import Link from 'next/link';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { addItem } from '../store/slices/cartSlice';
import { motion } from 'framer-motion';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

type MenuItem = { id: string; name: string; price: string; imageUrl?: string | null };
type Restaurant = { id: string; name: string; address?: string; country: string; menu?: MenuItem[]; imageUrl?: string | null };

// Fallback images
const REST_FALLBACK = 'https://plus.unsplash.com/premium_photo-1673108852141-e8c3c22a4a22?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';
const FOOD_FALLBACK = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';

// Corrected variant objects for Ts
const cardVariant = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring" as const, damping: 15, stiffness: 120 }
  },
  hover: {
    scale: 1.04,
    boxShadow: "0 8px 32px rgba(0,0,0,0.13)",
    transition: { duration: 0.16 }
  }
};
const imageVariant = {
  hidden: { opacity: 0, scale: 0.97 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.32, type: "spring" as const, stiffness: 110 }
  }
};
const menuThumbVariant = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.28 }
  }
};
const addButtonVariant = {
  rest: { scale: 1, boxShadow: "none" },
  pressed: { scale: 0.93, boxShadow: "0 0 8px 3px #34d399" },
};

export default function IndexPage() {
  const router = useRouter();
  const user = useAppSelector((s) => s.auth.user);
  const dispatch = useAppDispatch();
  const [rests, setRests] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const cartItems = useAppSelector((s) => s.cart.items);
  const [heroImageUrl, setHeroImageUrl] = useState<string>('https://foodish-api.com/api/');

  useEffect(() => {
    if (!user) router.replace('/login');
  }, [user, router]);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    api.get('/restaurants')
      .then((r) => setRests(r.data || []))
      .catch(() => setRests([]))
      .finally(() => setLoading(false));
  }, [user]);

  useEffect(() => {
    const interval = setInterval(() => {
      fetch('https://foodish-api.com/api/')
        .then((res) => res.json())
        .then((data) => {
          if (data.image) {
            setHeroImageUrl(data.image);
          }
        })
        .catch(() => { /* keep current image */ });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  if (!user) {
    return (
      <div
        className="container"
        style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="card">Redirecting to login…</div>
      </div>
    );
  }

  function handleImgError(e: React.SyntheticEvent<HTMLImageElement, Event>, fallback: string) {
    const img = e.currentTarget;
    if (img.dataset.fallbackApplied === '1') return;
    img.dataset.fallbackApplied = '1';
    img.src = fallback;
  }

  return (
    <section className="container">
      <ToastContainer
        position="top-center"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss={false}
        draggable={false}
        pauseOnHover={false}
      />
      <div className="hero card" style={{ marginBottom: 20 }}>
        <div className="hero-left">
          <h1>Good food, great teams</h1>
          <p className="small">Order from curated restaurants near your team's country. Quick delivery, easy corporate billing.</p>
          <div style={{ marginTop: 18, display: 'flex', gap: 12 }}>
            <Link href="/cart" className="btn btn-primary">View Cart ({cartItems.length})</Link>
            <Link href="/admin/payments" className="btn btn-ghost">Manage Payments</Link>
          </div>
        </div>
        <div className="hero-right">
          <div className="thumb">
            <motion.img
              src={heroImageUrl}
              alt="Random food"
              style={{ width: 320, height: 200, objectFit: 'cover', borderRadius: 12, transition: 'opacity 0.12s ease-in-out' }}
              onError={(e) => handleImgError(e, FOOD_FALLBACK)}
              initial="hidden"
              animate="visible"
              variants={imageVariant}
            />
          </div>
        </div>
      </div>
      {loading ? (
        <div className="card">Loading restaurants…</div>
      ) : (
        <motion.div
          className="grid-2"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { transition: { staggerChildren: 0.11, staggerDirection: -1 } },
            visible: { transition: { staggerChildren: 0.14 } }
          }}
        >
          {rests.map((r) => (
            <motion.article
              key={r.id}
              className="restaurant card"
              variants={cardVariant}
              initial="hidden"
              animate="visible"
              whileHover="hover"
              transition={{ type: "spring" as const, duration: 0.17 }}
            >
              <motion.img
                className="restaurant-image"
                src={r.imageUrl || REST_FALLBACK}
                alt={`${r.name} image`}
                onError={(e) => handleImgError(e, REST_FALLBACK)}
                variants={imageVariant}
                initial="hidden"
                animate="visible"
              />
              <div className="card-header">
                <div style={{ flex: 1 }}>
                  <h3 style={{ margin: '0 0 6px 0' }}>{r.name}</h3>
                  <div className="small">{r.address} • <strong>{r.country}</strong></div>
                </div>
                <div>
                  <div className="badge">Top Pick</div>
                </div>
              </div>
              <div style={{ marginTop: 12 }}>
                <div className="small" style={{ marginBottom: 8, fontWeight: 600 }}>Popular</div>
                <div style={{ display: 'grid', gap: 8 }}>
                  {(r.menu || []).slice(0, 3).map((mi) => (
                    <motion.div
                      key={mi.id}
                      className="menu-item"
                      whileHover={{ scale: 1.02, boxShadow: "0 3px 12px rgba(52,211,153,0.08)" }}
                      transition={{ duration: 0.13 }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <motion.img
                          className="menu-thumb"
                          src={mi.imageUrl || FOOD_FALLBACK}
                          alt={mi.name}
                          onError={(e) => handleImgError(e, FOOD_FALLBACK)}
                          variants={menuThumbVariant}
                          initial="hidden"
                          animate="visible"
                        />
                        <div>
                          <div style={{ fontWeight: 600 }}>{mi.name}</div>
                          <div className="hint">₹{Number(mi.price).toFixed(2)}</div>
                        </div>
                      </div>
                      <div className="card-footer">
                        <motion.button
                          className="btn btn-primary"
                          variants={addButtonVariant}
                          initial="rest"
                          whileTap="pressed"
                          onClick={() => {
                            dispatch(addItem({ name: mi.name, price: Number(mi.price), qty: 1 }));
                            toast.success(`"${mi.name}" added to cart!`);
                          }}
                          style={{ outline: 'none' }}
                        >
                          Add
                        </motion.button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
              <div className="card-footer" style={{ marginTop: 12 }}>
                <Link href={`/restaurants/${r.id}`} className="btn btn-ghost">View menu</Link>
              </div>
            </motion.article>
          ))}
        </motion.div>
      )}
    </section>
  );
}
