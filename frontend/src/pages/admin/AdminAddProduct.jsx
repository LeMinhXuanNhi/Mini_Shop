import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { useQuery, useMutation } from '@tanstack/react-query'
import { productAPI, categoryAPI } from '../../services/api'
import { toast } from 'react-toastify'

export default function AdminAddProduct() {
  const navigate = useNavigate()
  const { register, handleSubmit, formState: { errors } } = useForm()
  const { data: categoriesData } = useQuery({ queryKey: ['categories'], queryFn: () => categoryAPI.getAll() })
  const categories = categoriesData?.data || []

  const mutation = useMutation({
    mutationFn: (data) => productAPI.create(data),
    onSuccess: () => { toast.success('✅ Thêm sản phẩm thành công!'); navigate('/admin/products') },
    onError: (err) => toast.error(err.response?.data?.error || 'Thêm thất bại!')
  })

  const onSubmit = (data) => mutation.mutate({
    ...data,
    price: Number(data.price),
    originalPrice: data.originalPrice ? Number(data.originalPrice) : null,
    stockQuantity: Number(data.stockQuantity),
    categoryId: data.categoryId ? Number(data.categoryId) : null
  })

  return (
    <div style={{ padding: '3rem 0' }}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-7">
            <div className="mb-4">
              <h1 style={{ fontWeight: 800, fontSize: '1.8rem' }}>➕ Thêm Sản Phẩm Mới</h1>
            </div>
            <div className="card-dark p-4">
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-3">
                  <label className="form-label-dark">Tên sản phẩm *</label>
                  <input {...register('name', { required: 'Bắt buộc' })}
                    className="form-control-dark w-100" placeholder="Tên sản phẩm" />
                  {errors.name && <p style={{ color: 'var(--secondary)', fontSize: '0.8rem' }}>{errors.name.message}</p>}
                </div>

                <div className="mb-3">
                  <label className="form-label-dark">Mô tả</label>
                  <textarea {...register('description')} className="form-control-dark w-100"
                    rows={4} placeholder="Mô tả chi tiết sản phẩm..." style={{ resize: 'vertical' }} />
                </div>

                <div className="row g-3 mb-3">
                  <div className="col-6">
                    <label className="form-label-dark">Giá bán (VNĐ) *</label>
                    <input type="number" {...register('price', { required: 'Bắt buộc', min: 0 })}
                      className="form-control-dark w-100" placeholder="150000" />
                    {errors.price && <p style={{ color: 'var(--secondary)', fontSize: '0.8rem' }}>{errors.price.message}</p>}
                  </div>
                  <div className="col-6">
                    <label className="form-label-dark">Giá gốc (VNĐ)</label>
                    <input type="number" {...register('originalPrice')}
                      className="form-control-dark w-100" placeholder="200000" />
                  </div>
                </div>

                <div className="row g-3 mb-3">
                  <div className="col-6">
                    <label className="form-label-dark">Tồn kho *</label>
                    <input type="number" {...register('stockQuantity', { required: 'Bắt buộc', min: 0 })}
                      className="form-control-dark w-100" placeholder="100" />
                    {errors.stockQuantity && <p style={{ color: 'var(--secondary)', fontSize: '0.8rem' }}>{errors.stockQuantity.message}</p>}
                  </div>
                  <div className="col-6">
                    <label className="form-label-dark">Danh mục</label>
                    <select {...register('categoryId')} className="form-control-dark w-100">
                      <option value="">-- Chọn danh mục --</option>
                      {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>
                </div>

                <div className="mb-4">
                  <label className="form-label-dark">URL hình ảnh</label>
                  <input {...register('imageUrl')} className="form-control-dark w-100"
                    placeholder="https://example.com/image.jpg" />
                </div>

                <div className="d-flex gap-3">
                  <button type="submit" className="btn-primary-custom" style={{ flex: 1, padding: '14px' }}
                    disabled={mutation.isPending}>
                    {mutation.isPending ? '⏳ Đang lưu...' : '💾 Lưu sản phẩm'}
                  </button>
                  <button type="button" className="btn-outline-custom" style={{ padding: '14px 24px' }}
                    onClick={() => navigate('/admin/products')}>
                    Hủy
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
