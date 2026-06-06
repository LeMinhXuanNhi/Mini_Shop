import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { productAPI } from '../../services/api'
import { toast } from 'react-toastify'

const formatPrice = (p) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(p)

export default function AdminProducts() {
  const queryClient = useQueryClient()
  const { data, isLoading } = useQuery({
    queryKey: ['admin-products'],
    queryFn: () => productAPI.getAll({ page: 0, size: 100 })
  })

  const deleteMutation = useMutation({
    mutationFn: (id) => productAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-products'])
      toast.success('Đã ẩn sản phẩm!')
    }
  })

  const products = data?.data?.content || []

  return (
    <div style={{ padding: '3rem 0' }}>
      <div className="container">
        <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
          <div>
            <h1 style={{ fontWeight: 800, fontSize: '1.8rem' }}>⚙️ Quản Lý Sản Phẩm</h1>
            <p style={{ color: 'var(--text-muted)' }}>{products.length} sản phẩm</p>
          </div>
          <Link to="/admin/products/new">
            <button className="btn-primary-custom" style={{ padding: '12px 28px' }}>
              ➕ Thêm sản phẩm
            </button>
          </Link>
        </div>

        {isLoading ? (
          <div className="loading-spinner"><div className="spinner-custom" /></div>
        ) : (
          <div className="admin-table">
            <table className="table table-borderless mb-0">
              <thead>
                <tr>
                  <th>Sản phẩm</th>
                  <th>Danh mục</th>
                  <th>Giá</th>
                  <th>Tồn kho</th>
                  <th>Trạng thái</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {products.map(p => (
                  <tr key={p.id}>
                    <td>
                      <div className="d-flex align-items-center gap-3">
                        <img src={p.imageUrl || `https://picsum.photos/seed/${p.id}/80/80`}
                          style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: 8 }} alt={p.name} />
                        <div>
                          <div style={{ fontWeight: 600 }}>{p.name}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>ID: #{p.id}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ color: 'var(--text-secondary)' }}>{p.category?.name || '—'}</td>
                    <td style={{ color: 'var(--accent)', fontWeight: 700 }}>{formatPrice(p.price)}</td>
                    <td>
                      <span style={{
                        color: p.stockQuantity > 0 ? 'var(--accent)' : 'var(--secondary)',
                        fontWeight: 600
                      }}>
                        {p.stockQuantity}
                      </span>
                    </td>
                    <td>
                      <span style={{
                        padding: '3px 10px', borderRadius: 20, fontSize: '0.75rem', fontWeight: 700,
                        background: p.isActive ? 'rgba(67,233,123,0.15)' : 'rgba(255,101,132,0.15)',
                        color: p.isActive ? 'var(--accent)' : 'var(--secondary)',
                      }}>
                        {p.isActive ? '✅ Hiển thị' : '❌ Ẩn'}
                      </span>
                    </td>
                    <td>
                      <button
                        onClick={() => { if (confirm('Ẩn sản phẩm này?')) deleteMutation.mutate(p.id) }}
                        style={{
                          background: 'rgba(255,101,132,0.15)', border: '1px solid rgba(255,101,132,0.3)',
                          color: 'var(--secondary)', borderRadius: 8, padding: '6px 14px',
                          fontSize: '0.8rem', cursor: 'pointer', fontWeight: 600
                        }}
                      >
                        🗑️ Ẩn
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
