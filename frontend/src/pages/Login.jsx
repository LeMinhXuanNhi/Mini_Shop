import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { authAPI } from '../services/api'
import { toast } from 'react-toastify'
import { useState } from 'react'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const { register, handleSubmit, formState: { errors } } = useForm()

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      const res = await authAPI.login(data)
      const { token, ...userData } = res.data
      login(userData, token)
      toast.success(`🎉 Chào mừng trở lại, ${userData.username}!`)
      navigate('/')
    } catch (err) {
      toast.error(err.response?.data?.error || 'Đăng nhập thất bại!')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: 'calc(100vh - 72px)', display: 'flex', alignItems: 'center', padding: '3rem 0' }}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-5">
            <div className="card-dark p-5">
              <div className="text-center mb-5">
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔐</div>
                <h2 style={{ fontWeight: 800 }}>Đăng Nhập</h2>
                <p style={{ color: 'var(--text-secondary)' }}>Chào mừng trở lại MiniShop</p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-4">
                  <label className="form-label-dark">Tên đăng nhập</label>
                  <input
                    {...register('username', { required: 'Vui lòng nhập tên đăng nhập' })}
                    className="form-control-dark w-100"
                    placeholder="username của bạn"
                  />
                  {errors.username && (
                    <p style={{ color: 'var(--secondary)', fontSize: '0.8rem', marginTop: '0.5rem' }}>
                      {errors.username.message}
                    </p>
                  )}
                </div>

                <div className="mb-5">
                  <label className="form-label-dark">Mật khẩu</label>
                  <input
                    type="password"
                    {...register('password', { required: 'Vui lòng nhập mật khẩu' })}
                    className="form-control-dark w-100"
                    placeholder="••••••••"
                  />
                  {errors.password && (
                    <p style={{ color: 'var(--secondary)', fontSize: '0.8rem', marginTop: '0.5rem' }}>
                      {errors.password.message}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  className="btn-primary-custom w-100"
                  style={{ fontSize: '1.1rem', padding: '14px' }}
                  disabled={loading}
                >
                  {loading ? '⏳ Đang đăng nhập...' : '🚀 Đăng nhập'}
                </button>
              </form>

              <div className="text-center mt-4" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                Chưa có tài khoản?{' '}
                <Link to="/register" style={{ color: 'var(--primary-light)', fontWeight: 600 }}>
                  Đăng ký ngay
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
