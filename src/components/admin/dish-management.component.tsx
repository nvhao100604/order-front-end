'use client'

import { useState, useEffect } from 'react'
import { getDishesSWR } from '@/hooks/useDishes'
import { getCategoriesSWR } from '@/hooks/useCategories'
import { IDish, ICategory } from '@/interfaces'

export default function DishManagementComponent() {
    const { data: dishesRes, isLoading: dishesLoading } = getDishesSWR({ page: 1, limit: 100 })
    const { data: categoriesRes, isLoading: categoriesLoading } = getCategoriesSWR(1, 100)

    const initialCategories: ICategory[] = [
        { id: 1, name: 'Main Course' },
        { id: 2, name: 'Appetizers' },
        { id: 3, name: 'Desserts' },
        { id: 4, name: 'Beverages' },
    ]

    const initialDishes: IDish[] = [
        {
            id: 1,
            name: 'Phở Bò Đặc Biệt',
            price: 85000,
            categoryId: 1,
            imgUrl: 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=500',
            describe: 'Phở bò truyền thống với tái, nạm, gầu, bò viên tươi ngon.',
            category: { id: 1, name: 'Main Course' },
        },
        {
            id: 2,
            name: 'Cơm Tấm Sườn Bì Chả',
            price: 75000,
            categoryId: 1,
            imgUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500',
            describe: 'Cơm tấm sườn nướng mật ong thơm lừng kèm bì chả trứng.',
            category: { id: 1, name: 'Main Course' },
        },
        {
            id: 3,
            name: 'Gỏi Cuốn Tôm Thịt (4 Cuốn)',
            price: 45000,
            categoryId: 2,
            imgUrl: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=500',
            describe: 'Gỏi cuốn tôm tươi, thịt heo luộc kèm rau sống và chấm mắm nêm.',
            category: { id: 2, name: 'Appetizers' },
        },
        {
            id: 4,
            name: 'Trà Sữa Oolong Kem Trứng',
            price: 38000,
            categoryId: 4,
            imgUrl: 'https://images.unsplash.com/photo-1558857563-b371033873b8?w=500',
            describe: 'Trà Oolong nướng đậm vị kết hợp lớp kem trứng béo ngậy.',
            category: { id: 4, name: 'Beverages' },
        },
    ]

    const [dishes, setDishes] = useState<IDish[]>(initialDishes)
    const [categories, setCategories] = useState<ICategory[]>(initialCategories)
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedCategory, setSelectedCategory] = useState<number | 'ALL'>('ALL')

    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingDish, setEditingDish] = useState<IDish | null>(null)
    const [formData, setFormData] = useState({
        name: '',
        price: 0,
        categoryId: 1,
        imgUrl: '',
        describe: '',
    })

    // Category Modal state
    const [isCatModalOpen, setIsCatModalOpen] = useState(false)
    const [newCatName, setNewCatName] = useState('')

    useEffect(() => {
        if (dishesRes?.data && dishesRes.data.length > 0) {
            setDishes(dishesRes.data)
        }
    }, [dishesRes])

    useEffect(() => {
        if (categoriesRes?.data && Array.isArray(categoriesRes.data) && categoriesRes.data.length > 0) {
            setCategories(categoriesRes.data)
        }
    }, [categoriesRes])

    const filteredDishes = dishes.filter((dish) => {
        const matchesSearch = dish.name.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesCat =
            selectedCategory === 'ALL' ||
            dish.categoryId === selectedCategory ||
            dish.category?.id === selectedCategory
        return matchesSearch && matchesCat
    })

    const handleOpenAddModal = () => {
        setEditingDish(null)
        setFormData({
            name: '',
            price: 50000,
            categoryId: categories[0]?.id || 1,
            imgUrl: '',
            describe: '',
        })
        setIsModalOpen(true)
    }

    const handleOpenEditModal = (dish: IDish) => {
        setEditingDish(dish)
        setFormData({
            name: dish.name,
            price: dish.price,
            categoryId: dish.categoryId || dish.category?.id || 1,
            imgUrl: dish.imgUrl,
            describe: dish.describe || '',
        })
        setIsModalOpen(true)
    }

    const handleDeleteDish = (id: number) => {
        if (confirm('Bạn có chắc chắn muốn xóa món ăn này?')) {
            setDishes((prev) => prev.filter((d) => d.id !== id))
        }
    }

    const handleSaveDish = (e: React.FormEvent) => {
        e.preventDefault()
        if (!formData.name) return alert('Vui lòng nhập tên món ăn')

        const selectedCat = categories.find((c) => c.id === Number(formData.categoryId)) || {
            id: Number(formData.categoryId),
            name: 'Danh mục',
        }

        if (editingDish) {
            // Update
            setDishes((prev) =>
                prev.map((d) =>
                    d.id === editingDish.id
                        ? {
                              ...d,
                              name: formData.name,
                              price: Number(formData.price),
                              categoryId: Number(formData.categoryId),
                              category: selectedCat,
                              imgUrl: formData.imgUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500',
                              describe: formData.describe,
                          }
                        : d
                )
            )
        } else {
            // Create
            const newDish: IDish = {
                id: Date.now(),
                name: formData.name,
                price: Number(formData.price),
                categoryId: Number(formData.categoryId),
                category: selectedCat,
                imgUrl: formData.imgUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500',
                describe: formData.describe,
            }
            setDishes((prev) => [newDish, ...prev])
        }
        setIsModalOpen(false)
    }

    const handleAddCategory = (e: React.FormEvent) => {
        e.preventDefault()
        if (!newCatName.trim()) return
        const newCat: ICategory = {
            id: Date.now(),
            name: newCatName.trim(),
        }
        setCategories((prev) => [...prev, newCat])
        setNewCatName('')
        setIsCatModalOpen(false)
    }

    return (
        <div className="space-y-6">
            {/* Top Toolbar */}
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-amber-900/10">
                <div className="flex items-center gap-3 flex-1">
                    <div className="relative flex-1 max-w-md">
                        <input
                            type="text"
                            placeholder="Tìm kiếm món ăn..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-amber-900/20 focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20 outline-none text-sm transition-all"
                        />
                        <svg
                            className="w-5 h-5 absolute left-3 top-3 text-amber-800/40"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                            />
                        </svg>
                    </div>

                    <select
                        value={selectedCategory}
                        onChange={(e) =>
                            setSelectedCategory(e.target.value === 'ALL' ? 'ALL' : Number(e.target.value))
                        }
                        className="px-4 py-2.5 rounded-xl border border-amber-900/20 bg-white text-sm focus:border-amber-600 outline-none font-medium text-amber-900"
                    >
                        <option value="ALL">Tất cả danh mục ({dishes.length})</option>
                        {categories.map((cat) => (
                            <option key={cat.id} value={cat.id}>
                                {cat.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setIsCatModalOpen(true)}
                        className="px-4 py-2.5 rounded-xl bg-amber-50 text-amber-900 hover:bg-amber-100 font-semibold text-sm transition-all border border-amber-900/20 flex items-center gap-2"
                    >
                        <span>📁 Quản lý Danh mục</span>
                    </button>
                    <button
                        onClick={handleOpenAddModal}
                        className="px-5 py-2.5 rounded-xl bg-amber-600 text-white hover:bg-amber-700 font-semibold text-sm shadow-md hover:shadow-lg transition-all flex items-center gap-2"
                    >
                        <span>➕ Thêm Món Mới</span>
                    </button>
                </div>
            </div>

            {/* Dishes Table / Cards */}
            <div className="bg-white rounded-2xl shadow-sm border border-amber-900/10 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-amber-900/5 text-amber-900 text-xs font-bold uppercase tracking-wider border-b border-amber-900/10">
                                <th className="py-4 px-6">Món Ăn</th>
                                <th className="py-4 px-6">Danh Mục</th>
                                <th className="py-4 px-6">Đơn Giá</th>
                                <th className="py-4 px-6">Mô Tả</th>
                                <th className="py-4 px-6 text-right">Thao Tác</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-amber-900/10 text-sm">
                            {filteredDishes.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="py-12 text-center text-amber-800/60 font-medium">
                                        Không tìm thấy món ăn nào phù hợp.
                                    </td>
                                </tr>
                            ) : (
                                filteredDishes.map((dish) => (
                                    <tr key={dish.id} className="hover:bg-amber-50/50 transition-colors">
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-3">
                                                <img
                                                    src={
                                                        dish.imgUrl ||
                                                        'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500'
                                                    }
                                                    alt={dish.name}
                                                    className="w-12 h-12 rounded-xl object-cover border border-amber-900/10 shadow-sm"
                                                />
                                                <div>
                                                    <h4 className="font-bold text-amber-950">{dish.name}</h4>
                                                    <span className="text-xs text-amber-800/60">ID: #{dish.id}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-900 border border-amber-900/10">
                                                {dish.category?.name || 'Chưa phân loại'}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6 font-bold text-amber-900">
                                            {dish.price.toLocaleString('vi-VN')} đ
                                        </td>
                                        <td className="py-4 px-6 text-amber-900/70 max-w-xs truncate">
                                            {dish.describe || 'Không có mô tả'}
                                        </td>
                                        <td className="py-4 px-6 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => handleOpenEditModal(dish)}
                                                    className="p-2 rounded-lg text-amber-700 hover:bg-amber-100 transition-colors"
                                                    title="Chỉnh sửa"
                                                >
                                                    ✏️
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteDish(dish.id)}
                                                    className="p-2 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                                                    title="Xóa"
                                                >
                                                    🗑️
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add / Edit Dish Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white rounded-2xl shadow-xl border border-amber-900/10 w-full max-w-lg overflow-hidden">
                        <div className="px-6 py-4 bg-amber-900/5 border-b border-amber-900/10 flex items-center justify-between">
                            <h3 className="font-bold text-amber-950 text-lg">
                                {editingDish ? 'Chỉnh Sửa Món Ăn' : 'Thêm Món Ăn Mới'}
                            </h3>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="text-amber-800/60 hover:text-amber-950 font-bold text-lg"
                            >
                                ✕
                            </button>
                        </div>
                        <form onSubmit={handleSaveDish} className="p-6 space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-amber-900 uppercase tracking-wider mb-1">
                                    Tên món ăn *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="vd: Phở Bò Đặc Biệt"
                                    className="w-full px-4 py-2.5 rounded-xl border border-amber-900/20 text-sm outline-none focus:border-amber-600"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-amber-900 uppercase tracking-wider mb-1">
                                        Đơn giá (VNĐ) *
                                    </label>
                                    <input
                                        type="number"
                                        required
                                        min="0"
                                        value={formData.price}
                                        onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                                        className="w-full px-4 py-2.5 rounded-xl border border-amber-900/20 text-sm outline-none focus:border-amber-600"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-amber-900 uppercase tracking-wider mb-1">
                                        Danh mục *
                                    </label>
                                    <select
                                        value={formData.categoryId}
                                        onChange={(e) =>
                                            setFormData({ ...formData, categoryId: Number(e.target.value) })
                                        }
                                        className="w-full px-4 py-2.5 rounded-xl border border-amber-900/20 text-sm outline-none focus:border-amber-600 bg-white"
                                    >
                                        {categories.map((cat) => (
                                            <option key={cat.id} value={cat.id}>
                                                {cat.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-amber-900 uppercase tracking-wider mb-1">
                                    URL Hình ảnh (Unsplash / CDN)
                                </label>
                                <input
                                    type="text"
                                    value={formData.imgUrl}
                                    onChange={(e) => setFormData({ ...formData, imgUrl: e.target.value })}
                                    placeholder="https://images.unsplash.com/..."
                                    className="w-full px-4 py-2.5 rounded-xl border border-amber-900/20 text-sm outline-none focus:border-amber-600"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-amber-900 uppercase tracking-wider mb-1">
                                    Mô tả món ăn
                                </label>
                                <textarea
                                    rows={3}
                                    value={formData.describe}
                                    onChange={(e) => setFormData({ ...formData, describe: e.target.value })}
                                    placeholder="Thành phần, hương vị đặc biệt..."
                                    className="w-full px-4 py-2.5 rounded-xl border border-amber-900/20 text-sm outline-none focus:border-amber-600"
                                />
                            </div>

                            <div className="pt-4 flex items-center justify-end gap-3 border-t border-amber-900/10">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-5 py-2.5 rounded-xl border border-amber-900/20 text-amber-900 hover:bg-amber-50 font-semibold text-sm"
                                >
                                    Hủy bỏ
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-2.5 rounded-xl bg-amber-600 text-white hover:bg-amber-700 font-semibold text-sm shadow-md"
                                >
                                    Lưu Món Ăn
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Add Category Modal */}
            {isCatModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white rounded-2xl shadow-xl border border-amber-900/10 w-full max-w-md overflow-hidden">
                        <div className="px-6 py-4 bg-amber-900/5 border-b border-amber-900/10 flex items-center justify-between">
                            <h3 className="font-bold text-amber-950 text-lg">Quản Lý Danh Mục</h3>
                            <button
                                onClick={() => setIsCatModalOpen(false)}
                                className="text-amber-800/60 hover:text-amber-950 font-bold text-lg"
                            >
                                ✕
                            </button>
                        </div>
                        <div className="p-6 space-y-4">
                            <form onSubmit={handleAddCategory} className="flex items-center gap-2">
                                <input
                                    type="text"
                                    required
                                    value={newCatName}
                                    onChange={(e) => setNewCatName(e.target.value)}
                                    placeholder="Tên danh mục mới..."
                                    className="flex-1 px-4 py-2.5 rounded-xl border border-amber-900/20 text-sm outline-none focus:border-amber-600"
                                />
                                <button
                                    type="submit"
                                    className="px-4 py-2.5 rounded-xl bg-amber-600 text-white hover:bg-amber-700 font-semibold text-sm"
                                >
                                    Thêm
                                </button>
                            </form>

                            <div className="mt-4 space-y-2 max-h-60 overflow-y-auto pr-1">
                                <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wider">
                                    Danh mục hiện có ({categories.length}):
                                </h4>
                                {categories.map((cat) => (
                                    <div
                                        key={cat.id}
                                        className="flex items-center justify-between p-3 rounded-xl bg-amber-50 border border-amber-900/10 text-sm text-amber-950 font-medium"
                                    >
                                        <span>{cat.name}</span>
                                        <span className="text-xs text-amber-800/50">ID: #{cat.id}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
