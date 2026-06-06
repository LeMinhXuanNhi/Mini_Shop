import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { authAPI } from '../services/api'
import { toast } from 'react-toastify'
import { useState } from 'react'

export default function Register() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const { register, handleSubmit, formState: { errors }, watch } = useForm()

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      const res = await authAPI.register({
        username: data.username, email: data.email,
        password: data.password, fullName: data.fullName, phone: data.phone
      })
      const { token, ...userData } = res.data
      login(userData, token)
      toast.success('🎉 Đăng ký thành công!')
      navigate('/')
    } catch (err) {
      toast.error(err.response?.data?.error || 'Đăng ký thất bại!')
    } finally { setLoading(false) }
  }

  return (
    <div style={{ padding: '3rem 0' }}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="card-dark p-5">
              <div className="text-center mb-4">
                <div style={{ fontSize: '3rem' }}>✨</div>
                <h2 style={{ fontWeight: 800 }}>Tạo Tài Khoản</h2>
                <p style={{ color: 'var(--text-secondary)' }}>Tham gia MiniShop ngay hôm nay</p>
              </div>
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="row g-3 mb-3">
                  <div className="col-6">
                    <label className="form-label-dark">Tên đăng nhập *</label>
                    <input {...register('username', { required: 'Bắt buộc', minLength: { value: 3, message: 'Ít nhất 3 ký tự' } })}
                      className="form-control-dark w-100" placeholder="username" />
                    {errors.username && <p style={{ color: 'var(--secondary)', fontSize: '0.75rem' }}>{errors.username.message}</p>}
                  </div>
                  <div className="col-6">
                    <label className="form-label-dark">Họ và tên</label>
                    <input {...register('fullName')} className="form-control-dark w-100" placeholder="Nguyễn Xuân Nhi" />
                  </div>
                </div>
                <div className="mb-3">
                  <label className="form-label-dark">Email *</label>
                  <input type="email" {...register('email', { required: 'Bắt buộc', pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Email không hợp lệ' } })}
                    className="form-control-dark w-100" placeholder="email@example.com" />
                  {errors.email && <p style={{ color: 'var(--secondary)', fontSize: '0.75rem' }}>{errors.email.message}</p>}
                </div>
                <div className="mb-3">
                  <label className="form-label-dark">Số điện thoại</label>
                  <input {...register('phone')} className="form-control-dark w-100" placeholder="0912 345 678" />
                </div>
                <div className="mb-3">
                  <label className="form-label-dark">Mật khẩu *</label>
                  <input type="password" {...register('password', { required: 'Bắt buộc', minLength: { value: 6, message: 'Ít nhất 6 ký tự' } })}
                    className="form-control-dark w-100" placeholder="••••••••" />
                  {errors.password && <p style={{ color: 'var(--secondary)', fontSize: '0.75rem' }}>{errors.password.message}</p>}
                </div>
                <div className="mb-4">
                  <label className="form-label-dark">Xác nhận mật khẩu *</label>
                  <input type="password" {...register('confirmPassword', { required: 'Bắt buộc', validate: v => v === watch('password') || 'Mật khẩu không khớp' })}
                    className="form-control-dark w-100" placeholder="••••••••" />
                  {errors.confirmPassword && <p style={{ color: 'var(--secondary)', fontSize: '0.75rem' }}>{errors.confirmPassword.message}</p>}
                </div>
                <button type="submit" className="btn-primary-custom w-100" style={{ fontSize: '1.1rem', padding: '14px' }} disabled={loading}>
                  {loading ? '⏳ Đang đăng ký...' : '🚀 Đăng ký ngay'}
                </button>
              </form>
              <div className="text-center mt-4" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                Đã có tài khoản?{' '}
                <Link to="/login" style={{ color: 'var(--primary-light)', fontWeight: 600 }}>Đăng nhập</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
