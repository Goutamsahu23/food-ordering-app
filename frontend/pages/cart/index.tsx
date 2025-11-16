import Link from 'next/link';
import api from '../../lib/api';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { removeItem, clearCart } from '../../store/slices/cartSlice';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { toast } from 'react-toastify';

// Map Modal Component
const MapModal = ({ isOpen, onClose, onConfirm, onFetchLocation, location, loading, error }: any) => {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex',
      alignItems: 'center', justifyContent: 'center', zIndex: 1000
    }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="card"
        style={{ width: '90%', maxWidth: '600px', padding: '24px' }}
      >
        <h3 style={{ marginTop: 0 }}>Confirm Delivery Location</h3>
        <p className="small">Please confirm your location to ensure accurate delivery.</p>

        {error && <div className="msg-error">{error}</div>}

        {location ? (
          <div style={{ height: '300px', marginTop: '16px', borderRadius: '8px', overflow: 'hidden' }}>
            <iframe
              width="100%"
              height="100%"
              style={{ border: 0 }}
              loading="lazy"
              allowFullScreen
              src={`https://www.openstreetmap.org/export/embed.html?bbox=${location.longitude - 0.01},${location.latitude - 0.01},${location.longitude + 0.01},${location.latitude + 0.01}&layer=mapnik&marker=${location.latitude},${location.longitude}`}
            ></iframe>
          </div>
        ) : (
          <div style={{ height: '300px', marginTop: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f0f0f0', borderRadius: '8px' }}>
            <p>Map will be displayed here.</p>
          </div>
        )}

        <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between', gap: '12px' }}>
          <button className="btn btn-ghost" onClick={onFetchLocation} disabled={loading}>
            {loading ? 'Fetching...' : 'Get My Current Location'}
          </button>
          <div>
            <button className="btn btn-secondary" onClick={onClose} style={{ marginRight: '8px' }}>Cancel</button>
            <button className="btn btn-primary" onClick={onConfirm} disabled={!location || loading}>
              Confirm & Place Order
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};


export default function CartPage() {
  const dispatch = useAppDispatch();
  const items = useAppSelector(s => s.cart.items);
  const user = useAppSelector(s => s.auth.user);
  const restaurantId = useAppSelector(s => s.cart.restaurantId);
  const [loading, setLoading] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [orderStatus, setOrderStatus] = useState<string | null>(null);
  const [paymentMethods, setPaymentMethods] = useState<any[]>([]);
  const [selectedPm, setSelectedPm] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // State for map modal
  const [isMapModalOpen, setMapModalOpen] = useState(false);
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [isFetchingLocation, setIsFetchingLocation] = useState(false);


  const total = items.reduce((s, i) => s + i.price * i.qty, 0);

  async function createOrder() {
    setError(null);
    setMessage(null);

    if (items.length === 0) return setError('Cart is empty');

    if (!restaurantId) return setError('Restaurant not selected');

    setLoading(true);

    try {
      const res = await api.post('/orders/create', {
        restaurantId,
        items: items.map(i => ({
          name: i.name,
          qty: i.qty,
          price: i.price
        }))
      });

      setOrderId(res.data.data?.id || res.data.id);
      setOrderStatus(res.data.data?.status || 'draft');
      setMessage(res.data.message || 'Order created. Select payment method.');

      // fetch pms safely
      const pmRes = await api.get('/payments');
      const rawPm = pmRes.data;
      let arr: any[] = [];

      if (Array.isArray(rawPm)) arr = rawPm;
      else if (Array.isArray(rawPm?.data)) arr = rawPm.data;

      setPaymentMethods(arr);

      if (arr.length === 1) setSelectedPm(arr[0].id);

    } catch (e: any) {
      setError(e?.response?.data?.message || 'Failed to create order');
    } finally {
      setLoading(false);
    }
  }




  async function placeOrder() {
    if (!orderId) { setError('No order to place'); return; }
    if (!selectedPm) { setError('Select payment method'); return; }
    setLoading(true); setError(null);
    try {
      await api.post(`/orders/${orderId}/place`, { paymentMethodId: selectedPm });
      setOrderStatus('placed');
      setMessage('Order placed successfully');
      dispatch(clearCart());
    } catch (e: any) {
      setError(e?.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
      setMapModalOpen(false);
    }
  }

  async function cancelOrder() {
    if (!orderId) { setError('No order to cancel'); return; }
    setLoading(true); setError(null);
    try {
      await api.delete(`/orders/${orderId}/cancel`);
      setOrderStatus('cancelled');
      setMessage(`Order ${orderId} cancelled`);
    } catch (e: any) {
      setError(e?.response?.data?.message || 'Failed to cancel order');
    } finally { setLoading(false); }
  }

  const handleFetchLocation = () => {
    setIsFetchingLocation(true);
    setLocationError(null);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setIsFetchingLocation(false);
      },
      (err) => {
        setLocationError(`Failed to get location: ${err.message}`);
        setIsFetchingLocation(false);
      }
    );
  };

  const handleOpenMapModal = () => {
    if (!selectedPm) {
      setError('Please select a payment method first.');
      return;
    }
    setError(null);
    setMapModalOpen(true);
  }

  return (
    <section>
      <AnimatePresence>
        <MapModal
          isOpen={isMapModalOpen}
          onClose={() => setMapModalOpen(false)}
          onConfirm={placeOrder}
          onFetchLocation={handleFetchLocation}
          location={location}
          loading={isFetchingLocation}
          error={locationError}
        />
      </AnimatePresence>

      <div className="page-section">
        <Link href="/" className="small">← Back</Link>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 18 }}>
        <div>
          <div className="card">
            <h2 style={{ marginTop: 0 }}>Your cart</h2>
            {items.length === 0 ? <div className="small" style={{ marginTop: 12 }}>Your cart is empty</div> : (
              <div style={{ marginTop: 12, display: 'grid', gap: 12 }}>
                {items.map((it, idx) => (
                  <div className="menu-item" key={idx}>
                    <div>
                      <div style={{ fontWeight: 600 }}>{it.name}</div>
                      <div className="hint">Qty: {it.qty} • ₹{(it.price * it.qty).toFixed(2)}</div>
                    </div>
                    <div>
                      <button className="btn btn-ghost" onClick={() => dispatch(removeItem({ name: it.name }))}>Remove</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <aside className="aside">
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div className="small">Total</div>
                <div style={{ fontSize: 20, fontWeight: 700 }}>₹{total.toFixed(2)}</div>
              </div>
              <div>
                <button className="btn btn-primary" onClick={createOrder} disabled={loading}>{loading ? 'Processing...' : 'Create order'}</button>
              </div>
            </div>
          </div>

          {orderId && (
            <div className="card">
              <h3 style={{ marginTop: 0 }}>Payment</h3>

              {orderStatus === 'placed' && <div className="msg-success" style={{ marginTop: 8 }}>Order placed successfully</div>}
              {orderStatus === 'cancelled' && <div className="msg-error" style={{ marginTop: 8 }}>Order cancelled</div>}

              {paymentMethods.length === 0 ? (
                <div className="small" style={{ marginTop: 10 }}>No payment methods found — ask Admin to add one.</div>
              ) : (
                <div style={{ marginTop: 10, display: 'grid', gap: 10 }}>
                  {paymentMethods.map(pm => (
                    <label key={pm.id} className="menu-item" style={{ alignItems: 'center' }}>
                      <div>
                        <div style={{ fontWeight: 600 }}>{pm.type}</div>
                        <div className="hint">{pm.details.label}</div>
                      </div>
                      <input type="radio" name="pm" checked={selectedPm === pm.id} onChange={() => setSelectedPm(pm.id)} />
                    </label>
                  ))}

                  <div style={{ display: 'flex', gap: 8 }}>
                    <button className="btn btn-primary" onClick={handleOpenMapModal} disabled={loading || !selectedPm}>Pay & Place order</button>
                    <button className="btn btn-ghost" onClick={cancelOrder} disabled={loading || orderStatus !== 'placed'}>Cancel order</button>

                  </div>
                </div>
              )}
            </div>
          )}

          {message && <div className="msg-success">{message}</div>}
          {error && <div className="msg-error">{error}</div>}
        </aside>
      </div>
    </section>
  );
}
