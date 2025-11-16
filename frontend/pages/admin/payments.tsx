import { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '../../lib/api';
import { useAppSelector } from '../../store/hooks';

type PaymentMethod = { id: string; type: string; details: any; country: string | null };


function normalizeApiResponse(res: any) {
  if (!res) return { success: false, message: 'No response from server', data: null };


  const payload = res.data ?? null;

  if (payload && typeof payload === 'object' && ('success' in payload)) {
    return {
      success: Boolean(payload.success),
      message: payload.message || '',
      data: payload.data ?? null,
    };
  }

  return {
    success: true,
    message: '',
    data: payload,
  };
}

export default function AdminPaymentsPage() {
  const user = useAppSelector(s => s.auth.user);
  const [payments, setPayments] = useState<PaymentMethod[]>([]);
  const [type, setType] = useState('card');
  const [details, setDetails] = useState('{"label":"Corporate Card (****4242)"}');
  const [country, setCountry] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingPayments, setLoadingPayments] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // edit state
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    if (!user || user.role !== 'admin') return;
    fetchPayments();
  }, [user]);

  async function fetchPayments() {
    setLoadingPayments(true);
    setError(null);
    try {
      const raw = await api.get('/payments');
      const res = normalizeApiResponse(raw);
      if (!res.success) {
        setError(res.message || 'Failed to load payment methods');
        setPayments([]);
      } else {
        const arr = Array.isArray(res.data) ? res.data : [];
        setPayments(arr);
      }
    } catch (err) {
      console.error('Failed to load payment methods', err);
      setError('Failed to load payment methods. Make sure you are an admin.');
      setPayments([]);
    } finally {
      setLoadingPayments(false);
    }
  }

  if (!user) {
    return (
      <div className="card">
        <div className="small">Please login as admin to manage payments.</div>
        <div style={{ marginTop: 12 }}>
          <Link href="/login" className="btn btn-primary">Login</Link>
        </div>
      </div>
    );
  }
  if (user.role !== 'admin') {
    return <div className="card">Access denied — admin only.</div>;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    setError(null);

    // validate JSON in details
    let parsedDetails: any = null;
    try {
      parsedDetails = JSON.parse(details);
    } catch {
      setError('Details must be valid JSON.');
      return;
    }

    setLoading(true);
    try {
      if (editingId) {
        // update
        const raw = await api.patch(`/payments/${editingId}`, { type, details: parsedDetails, country: country || null });
        const res = normalizeApiResponse(raw);
        if (!res.success) {
          setError(res.message || 'Failed to update payment method');
          return;
        }
        setMessage('Payment method updated.');
        setEditingId(null);
      } else {
        // create
        const raw = await api.post('/payments', { type, details: parsedDetails, country: country || null });
        const res = normalizeApiResponse(raw);
        if (!res.success) {
          setError(res.message || 'Failed to save payment method');
          return;
        }
        setMessage('Saved payment method.');
      }
      // refresh list
      await fetchPayments();
      // reset form to defaults after create
      setType('card');
      setDetails('{"label":"Corporate Card (****4242)"}');
      setCountry('');
    } catch (err: any) {
      console.error(err);
      setError(err?.response?.data?.message || 'Failed to save payment method');
    } finally {
      setLoading(false);
    }
  }

  function handleEdit(p: PaymentMethod) {
    setEditingId(p.id);
    setType(p.type);
    setDetails(typeof p.details === 'string' ? p.details : JSON.stringify(p.details, null, 2));
    setCountry(p.country ?? '');
    setMessage(null);
    setError(null);
    // scroll into view for small screens
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  async function handleDelete(id: string) {
    const confirmed = confirm('Are you sure you want to delete this payment method? This cannot be undone.');
    if (!confirmed) return;

    setLoading(true);
    setError(null);
    try {
      const raw = await api.delete(`/payments/${id}`);
      const res = normalizeApiResponse(raw);
      if (!res.success) {
        setError(res.message || 'Failed to delete payment method');
        return;
      }
      setMessage('Payment method deleted.');
      await fetchPayments();
    } catch (err: any) {
      console.error(err);
      setError(err?.response?.data?.message || 'Failed to delete payment method');
    } finally {
      setLoading(false);
    }
  }

  function handleCancelEdit() {
    setEditingId(null);
    setType('card');
    setDetails('{"label":"Corporate Card (****4242)"}');
    setCountry('');
    setMessage(null);
    setError(null);
  }

  return (
    <section>
      <div className="page-section">
        <Link href="/" className="small">← Back</Link>
      </div>

      <div className="card" style={{ maxWidth: 760 }}>
        <h2 style={{ marginTop: 0 }}>{editingId ? 'Edit Payment Method' : 'Admin — Payment Methods'}</h2>
        <div className="small hint" style={{ marginBottom: 12 }}>
          {editingId ? 'Update the payment method below or cancel editing.' : 'Add a global or country-specific payment method.'}
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 12 }}>
          <div>
            <label className="small">Payment Type</label>
            <select className="input" value={type} onChange={(e) => setType(e.target.value)}>
              <option value="card">Card</option>
              <option value="upi">UPI</option>
              <option value="wallet">Wallet</option>
              <option value="cod">Cash on Delivery (COD)</option>
            </select>
          </div>

          <div>
            <label className="small">Country (optional)</label>
            <select className="input" value={country} onChange={e => setCountry(e.target.value)}>
              <option value="">Global</option>
              <option value="India">India</option>
              <option value="America">America</option>
              {/* Add more countries as needed */}
            </select>
          </div>

          <div>
            <label className="small">Details (JSON)</label>
            <textarea className="input" value={details} onChange={(e) => setDetails(e.target.value)} rows={6} />
            <div className="small hint">Example: <code>{"{ \"label\": \"Corporate Card (****4242)\" }"}</code></div>
          </div>

          {message && <div className="msg-success">{message}</div>}
          {error && <div className="msg-error">{error}</div>}

          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn btn-primary" disabled={loading}>
              {loading ? (editingId ? 'Updating...' : 'Saving...') : (editingId ? 'Update Payment Method' : 'Save Payment Method')}
            </button>

            {editingId && (
              <button type="button" className="btn btn-ghost" onClick={handleCancelEdit} disabled={loading}>
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="card" style={{ maxWidth: 760, marginTop: 24 }}>
        <h3 style={{ marginTop: 0 }}>Existing Methods</h3>

        {loadingPayments ? (
          <div>Loading...</div>
        ) : payments.length === 0 ? (
          <div className="small" style={{ marginTop: 8 }}>No payment methods found.</div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'left', paddingBottom: 8 }}>Type</th>
                <th style={{ textAlign: 'left', paddingBottom: 8 }}>Details</th>
                <th style={{ textAlign: 'left', paddingBottom: 8 }}>Country</th>
                <th style={{ textAlign: 'right', paddingBottom: 8 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {payments.map(p => (
                <tr key={p.id} style={{ borderTop: '1px solid #eee' }}>
                  <td style={{ padding: '12px 8px' }}>{p.type}</td>
                  <td style={{ padding: '12px 8px' }}>{p.details?.label ?? JSON.stringify(p.details)}</td>
                  <td style={{ padding: '12px 8px' }}>{p.country || 'Global'}</td>
                  <td style={{ padding: '12px 8px', textAlign: 'right' }}>
                    <button className="btn btn-ghost" onClick={() => handleEdit(p)} style={{ marginRight: 8 }}>Edit</button>
                    <button className="btn btn-danger" onClick={() => handleDelete(p.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
}
