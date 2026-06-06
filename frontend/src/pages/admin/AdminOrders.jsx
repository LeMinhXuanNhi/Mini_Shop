import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { orderAPI } from '../../services/api'
import { toast } from 'react-toastify'

const formatPrice = (p) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(p)

const STATUS_OPTIONS = ['PENDING', 'CONFIRMED', 'SHIPPING', 'DELIVERED', 'CANCELLED']
const STATUS_LABELS = { PENDING: '⏳ Chờ xác nhận', CONFIRMED: '✅ Đã xác nhận', SHIPPING: '🚚 Đang giao', DELIVERED: '🎉 Đã giao', CANCELLED: '❌ Đã hủy' }

export default function AdminOrders() {
  const queryClient = useQueryClient()
  const { data, isLoading } = useQuery({
    queryKey: ['admin-orders'],
    queryFn: () => orderAPI.getAll({ page: 0, size: 50 })
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, status }) => orderAPI.updateStatus(id, status),
    onSuccess: () => { queryClient.invalidateQueries(['admin-orders']); toast.success('Đã cập nhật trạng thái!') }
  })

  const orders = data?.data?.content || []

  return (
    <div style={{ padding: '3rem 0' }}>
      <div className="container">
        <div className="mb-4">
          <h1 style={{ fontWeight: 800, fontSize: '1.8rem' }}>📋 Quản Lý Đơn Hàng</h1>
          <p style={{ color: 'var(--text-muted)' }}>{orders.length} đơn hàng</p>
        </div>

        {isLoading ? (
          <div className="loading-spinner"><div className="spinner-custom" /></div>
        ) : orders.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📋</div>
            <h5 style={{ color: 'var(--text-secondary)' }}>Chưa có đơn hàng nào</h5>
          </div>
        ) : (
          orders.map(order => (
            <div key={order.id} className="order-card">
              <div className="d-flex justify-content-between align-items-start flex-wrap gap-3 mb-3">
                <div>
                  <span style={{ fontWeight: 700 }}>Đơn #{order.id}</span>
                  <span className="ms-3" style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                    👤 {order.username}
                  </span>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '0.25rem' }}>
                    {new Date(order.createdAt).toLocaleString('vi-VN')}
                  </div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '0.25rem' }}>
                    📍 {order.shippingAddress} | 📞 {order.phoneNumber}
                  </div>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <select
                    value={order.status}
                    onChange={(e) => updateMutation.mutate({ id: order.id, status: e.target.value })}
                    className="form-control-dark"
                    style={{ padding: '6px 12px', fontSize: '0.85rem' }}
                  >
                    {STATUS_OPTIONS.map(s => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
                  </select>
                </div>
              </div>

              <div>
                {order.orderItems?.map(item => (
                  <div key={item.id} className="d-flex align-items-center gap-3 mb-2">
                    <img src={item.productImage || `https://picsum.photos/seed/${item.id}/60/60`}
                      style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 6 }} alt={item.productName} />
                    <div style={{ flex: 1, fontSize: '0.9rem' }}>
                      {item.productName} × {item.quantity}
                    </div>
                    <span style={{ color: 'var(--accent)', fontWeight: 600 }}>{formatPrice(item.subtotal)}</span>
                  </div>
                ))}
              </div>

              <div className="d-flex justify-content-end mt-3 pt-3" style={{ borderTop: '1px solid var(--dark-border)' }}>
                <span style={{ fontWeight: 800 }}>
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
