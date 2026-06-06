import { useQuery } from '@tanstack/react-query'
import { orderAPI } from '../services/api'

const formatPrice = (p) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(p)

export default function MyOrders() {
  const { data, isLoading } = useQuery({ queryKey: ['my-orders'], queryFn: () => orderAPI.getMyOrders() })
  const orders = data?.data || []

  if (isLoading) return <div className="loading-spinner" style={{ minHeight: '60vh' }}><div className="spinner-custom" /></div>

  return (
    <div style={{ padding: '3rem 0' }}>
      <div className="container">
        <div className="page-header">
          <h1 className="section-title">📦 Đơn Hàng Của Tôi</h1>
          <div className="section-line" />
        </div>
        {orders.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📋</div>
            <h5 style={{ color: 'var(--text-secondary)' }}>Bạn chưa có đơn hàng nào</h5>
          </div>
        ) : (
          orders.map(order => (
            <div key={order.id} className="order-card">
              <div className="d-flex justify-content-between align-items-start mb-3 flex-wrap gap-2">
                <div>
                  <span style={{ fontWeight: 700, fontSize: '1rem' }}>Đơn #{order.id}</span>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '0.25rem' }}>
                    {new Date(order.createdAt).toLocaleString('vi-VN')}
                  </div>
                </div>
                <span className={`status-badge status-${order.status}`}>{
                  { PENDING: '⏳ Chờ xác nhận', CONFIRMED: '✅ Đã xác nhận', SHIPPING: '🚚 Đang giao', DELIVERED: '🎉 Đã giao', CANCELLED: '❌ Đã hủy' }[order.status]
                }</span>
              </div>

              <div className="mb-3" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                <span>📍 {order.shippingAddress}</span>
                <span className="ms-4">📞 {order.phoneNumber}</span>
              </div>

              {order.orderItems?.map(item => (
                <div key={item.id} className="d-flex align-items-center gap-3 mb-2 p-2"
                  style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 8 }}>
                  <img src={item.productImage || `https://picsum.photos/seed/${item.id}/80/80`}
                    style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: 6 }} alt={item.productName} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{item.productName}</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>x{item.quantity} × {formatPrice(item.unitPrice)}</div>
                  </div>
                  <span style={{ color: 'var(--accent)', fontWeight: 700 }}>{formatPrice(item.subtotal)}</span>
                </div>
              ))}

              <div className="d-flex justify-content-end mt-3 pt-3" style={{ borderTop: '1px solid var(--dark-border)' }}>
                <span style={{ fontWeight: 800, fontSize: '1.1rem' }}>
                  Tổng: <span style={{ color: 'var(--accent)' }}>{formatPrice(order.totalAmount)}</span>
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
