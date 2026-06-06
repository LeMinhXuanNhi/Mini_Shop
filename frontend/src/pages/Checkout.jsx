import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { orderAPI } from '../services/api'
import { toast } from 'react-toastify'
import { useState } from 'react'

export default function Checkout() {
  const { cartItems, cartTotal, clearCart } = useCart()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const { register, handleSubmit, formState: { errors } } = useForm()

  const formatPrice = (price) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price)

  const onSubmit = async (data) => {
    if (cartItems.length === 0) {
      toast.error('Giỏ hàng trống!')
      return
    }
    setLoading(true)
    try {
      await orderAPI.create({
        shippingAddress: data.shippingAddress,
        phoneNumber: data.phoneNumber,
        note: data.note,
        items: cartItems.map(item => ({
          productId: item.id,
          quantity: item.quantity
        }))
      })
      clearCart()
      toast.success('🎉 Đặt hàng thành công!')
      navigate('/orders')
    } catch (err) {
      toast.error(err.response?.data?.error || 'Đặt hàng thất bại!')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ padding: '3rem 0' }}>
      <div className="container">
        <div className="page-header">
          <h1 className="section-title">🏪 Thanh Toán</h1>
          <div className="section-line" />
        </div>

        <div className="row g-4">
          {/* Form */}
          <div className="col-lg-7">
            <div className="card-dark p-4">
              <h5 style={{ fontWeight: 700, marginBottom: '1.5rem' }}>Thông tin giao hàng</h5>
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-4">
                  <label className="form-label-dark">Địa chỉ giao hàng *</label>
                  <input
                    {...register('shippingAddress', { required: 'Vui lòng nhập địa chỉ' })}
                    className="form-control-dark w-100"
                    placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành phố"
                  />
                  {errors.shippingAddress && (
                    <p style={{ color: 'var(--secondary)', fontSize: '0.8rem', marginTop: '0.5rem' }}>
                      {errors.shippingAddress.message}
                    </p>
                  )}
                </div>

                <div className="mb-4">
                  <label className="form-label-dark">Số điện thoại *</label>
                  <input
                    {...register('phoneNumber', {
                      required: 'Vui lòng nhập số điện thoại',
                      pattern: { value: /^[0-9]{10,11}$/, message: 'Số điện thoại không hợp lệ' }
                    })}
                    className="form-control-dark w-100"
                    placeholder="0912 345 678"
                  />
                  {errors.phoneNumber && (
                    <p style={{ color: 'var(--secondary)', fontSize: '0.8rem', marginTop: '0.5rem' }}>
                      {errors.phoneNumber.message}
                    </p>
                  )}
                </div>

                <div className="mb-4">
                  <label className="form-label-dark">Ghi chú (tuỳ chọn)</label>
                  <textarea
                    {...register('note')}
                    className="form-control-dark w-100"
                    placeholder="Ghi chú thêm cho người bán..."
                    rows={3}
                    style={{ resize: 'vertical' }}
                  />
                </div>

                <button
                  type="submit"
                  className="btn-primary-custom w-100"
                  style={{ fontSize: '1.1rem', padding: '16px' }}
                  disabled={loading}
                >
                  {loading ? '⏳ Đang xử lý...' : '✅ Xác nhận đặt hàng'}
                </button>
              </form>
            </div>
          </div>

          {/* Order summary */}
          <div className="col-lg-5">
            <div className="card-dark p-4">
              <h5 style={{ fontWeight: 700, marginBottom: '1.5rem' }}>Đơn hàng của bạn</h5>
              {cartItems.map(item => (
                <div key={item.id} className="d-flex justify-content-between align-items-center mb-3">
                  <div className="d-flex align-items-center gap-3">
                    <img
                      src={item.imageUrl || `https://picsum.photos/seed/${item.id}/80/80`}
                      style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 8 }}
                      alt={item.name}
                    />
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{item.name}</div>
                      <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>x{item.quantity}</div>
                    </div>
                  </div>
                  <span style={{ color: 'var(--accent)', fontWeight: 700 }}>
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </div>
              ))}

              <hr style={{ borderColor: 'var(--dark-border)' }} />

              <div className="d-flex justify-content-between">
                <span style={{ fontWeight: 800, fontSize: '1.1rem' }}>Tổng cộng</span>
                <span style={{ fontWeight: 800, fontSize: '1.3rem', color: 'var(--accent)' }}>
                  {formatPrice(cartTotal)}
                </span>
              </div>

              <div className="mt-3 p-3" style={{
                background: 'rgba(67,233,123,0.1)',
                borderRadius: '10px',
                border: '1px solid rgba(67,233,123,0.2)',
                fontSize: '0.85rem',
                color: 'var(--accent)'
              }}>
                🚚 Giao hàng miễn phí toàn quốc
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
