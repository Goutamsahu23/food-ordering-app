import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import api from '../../lib/api';
import { useAppDispatch } from '../../store/hooks';
import { addItem } from '../../store/slices/cartSlice';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

type MenuItem = { id: string; name: string; price: number; imageUrl?: string | null };
type Restaurant = { id: string; name: string; address?: string; country?: string; imageUrl?: string | null; menu?: MenuItem[] };

const HEADER_FALLBACK = 'https://plus.unsplash.com/premium_photo-1673108852141-e8c3c22a4a22?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';
const MENU_FALLBACK = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';

// TypeScript strict/correct variants ↓
const menuItemVariant = {
  hidden: { opacity: 0, y: 20, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring" as const, stiffness: 160, damping: 13 }
  },
  hover: {
    scale: 1.015,
    boxShadow: "0 4px 20px rgba(52,211,153,0.09)"
  }
};
const thumbVariant = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.35 }
  }
};
const buttonVariant = {
  rest: { scale: 1 },
  pressed: { scale: 0.92, boxShadow: "0 0 8px 2px #34d399" }
};

export default function RestaurantPage() {
  const router = useRouter();
  const { id } = router.query;
  const dispatch = useAppDispatch();

  const [rest, setRest] = useState<Restaurant | null>(null);
  const [loading, setLoading] = useState(true);
  const [qtys, setQtys] = useState<Record<string, number>>({});

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    api.get(`/restaurants/${id}`)
      .then((r) => setRest(r.data))
      .catch(() => setRest(null))
      .finally(() => setLoading(false));
  }, [id]);

  function changeQty(menuId: string, delta: number) {
    setQtys((prev) => {
      const current = prev[menuId] || 1;
      const next = Math.max(1, current + delta);
      return { ...prev, [menuId]: next };
    });
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
        autoClose={1800}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss={false}
        draggable={false}
        pauseOnHover={false}
      />
      <div className="page-section">
        <Link href="/" className="small">← Back</Link>
      </div>
      {loading ? (
        <div className="card">Loading…</div>
      ) : !rest ? (
        <div className="card">Restaurant not found</div>
      ) : (
        <>
          <motion.div
            className="card"
            style={{ padding: 0, overflow: 'hidden' }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.38, type: "spring" as const }}
          >
            <img
              src={rest.imageUrl || HEADER_FALLBACK}
              alt={rest.name}
              style={{ width: '100%', height: 320, objectFit: 'cover', display: 'block' }}
              onError={(e) => handleImgError(e, HEADER_FALLBACK)}
            />
            <div style={{ padding: 18 }}>
              <h1 style={{ margin: 0 }}>{rest.name}</h1>
              <div className="small">{rest.address} • {rest.country}</div>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.42 }}
            className="card"
            style={{ marginTop: 14 }}
          >
            <h3 style={{ marginTop: 0 }}>Menu</h3>
            <motion.div
              style={{ marginTop: 12, display: 'grid', gap: 12 }}
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { transition: { staggerChildren: 0.1, staggerDirection: -1 } },
                visible: { transition: { staggerChildren: 0.12 } }
              }}
            >
              {rest.menu?.map((mi) => (
                <motion.div
                  key={mi.id}
                  className="menu-item"
                  variants={menuItemVariant}
                  initial="hidden"
                  animate="visible"
                  whileHover="hover"
                  style={{ background: "#f9fdfa", borderRadius: 10, padding: 16 }}
                  transition={{ duration: 0.165 }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <motion.img
                      className="menu-thumb"
                      src={mi.imageUrl || MENU_FALLBACK}
                      alt={mi.name}
                      onError={(e) => handleImgError(e, MENU_FALLBACK)}
                      variants={thumbVariant}
                      initial="hidden"
                      animate="visible"
                      style={{ width: 54, height: 54, objectFit: 'cover', borderRadius: 8 }}
                    />
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 18 }}>{mi.name}</div>
                      <div className="hint" style={{ fontSize: 15 }}>₹{Number(mi.price).toFixed(2)}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10 }}>
                    <button className="btn btn-ghost" onClick={() => changeQty(mi.id, -1)}>-</button>
                    <div style={{ minWidth: 28, textAlign: 'center', fontWeight: 500 }}>
                      {qtys[mi.id] || 1}
                    </div>
                    <button className="btn btn-ghost" onClick={() => changeQty(mi.id, 1)}>+</button>
                    <motion.button
                      className="btn btn-primary"
                      variants={buttonVariant}
                      initial="rest"
                      whileTap="pressed"
                      onClick={() => {
                        const qty = qtys[mi.id] || 1;
                        dispatch(addItem({ name: mi.name, price: Number(mi.price), qty: qty }));
                        toast.success(`"${mi.name}" added to cart!`);
                      }}
                      style={{ marginLeft: 16, fontWeight: 600 }}
                    >
                      Add to cart
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </>
      )}
    </section>
  );
}
