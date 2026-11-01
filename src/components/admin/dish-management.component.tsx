'use client'

import { useState, useEffect, useRef } from 'react'
import { getDishesSWR } from '@/hooks/useDishes'
import { getCategoriesSWR } from '@/hooks/useCategories'
import { dishes_services } from '@/services/dish.services'
import { IDish, ICategory } from '@/interfaces'
import { toast } from 'react-toastify'
import {
    Search,
    Plus,
    FolderPlus,
    Pencil,
    Trash2,
    X,
    Upload,
    Image as ImageIcon,
    Loader2,
    CheckCircle2,
    Link as LinkIcon,
} from 'lucide-react'

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
            name: 'Special Beef Pho',
            price: 85000,
            categoryId: 1,
            imgUrl: 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=500',
            describe: 'Traditional Vietnamese beef noodle soup with brisket, flank, and fresh meatballs.',
            category: { id: 1, name: 'Main Course' },
        },
        {
            id: 2,
            name: 'Broken Rice with Grilled Pork Chop',
            price: 75000,
            categoryId: 1,
            imgUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500',
            describe: 'Fragrant broken rice topped with honey-glazed grilled pork chop and steamed egg meatloaf.',
            category: { id: 1, name: 'Main Course' },
        },
        {
            id: 3,
            name: 'Fresh Spring Rolls (4 rolls)',
            price: 45000,
            categoryId: 2,
            imgUrl: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=500',
            describe: 'Rice paper rolls with fresh shrimp, pork, mint, and savory dipping sauce.',
            category: { id: 2, name: 'Appetizers' },
        },
        {
            id: 4,
            name: 'Oolong Milk Tea with Egg Pudding',
            price: 38000,
            categoryId: 4,
            imgUrl: 'https://images.unsplash.com/photo-1558857563-b371033873b8?w=500',
            describe: 'Roasted Oolong tea combined with creamy milk and smooth egg pudding.',
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

    // Image Upload State
    const [isUploading, setIsUploading] = useState(false)
    const [isDragging, setIsDragging] = useState(false)
    const [showManualUrl, setShowManualUrl] = useState(false)
    const fileInputRef = useRef<HTMLInputElement | null>(null)

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
        setShowManualUrl(false)
        setIsModalOpen(true)
    }

    const handleOpenEditModal = (dish: IDish) => {
        setEditingDish(dish)
        setFormData({
            name: dish.name,
            price: dish.price,
            categoryId: dish.categoryId || dish.category?.id || 1,
            imgUrl: dish.imgUrl || '',
            describe: dish.describe || '',
        })
        setShowManualUrl(false)
        setIsModalOpen(true)
    }

    const handleDeleteDish = (id: number) => {
        if (confirm('Are you sure you want to delete this dish?')) {
            setDishes((prev) => prev.filter((d) => d.id !== id))
            toast.success('Dish removed from menu.')
        }
    }

    // Upload dish image via POST /api/v1/dishes/upload
    const handleUploadFile = async (file: File) => {
        if (!file.type.startsWith('image/')) {
            toast.error('Please upload an image file (PNG, JPG, WEBP).')
            return
        }

        if (file.size > 5 * 1024 * 1024) {
            toast.error('Image size exceeds 5MB limit. Please choose a smaller file.')
            return
        }

        setIsUploading(true)
        try {
            const res = await dishes_services.uploadDishImage(file)
            let uploadedUrl = ''

            if (typeof res === 'string') {
                uploadedUrl = res
            } else if (res?.data) {
                if (typeof res.data === 'string') {
                    uploadedUrl = res.data
                } else if (typeof (res.data as any)?.url === 'string') {
                    uploadedUrl = (res.data as any).url
                }
            } else if ((res as any)?.url) {
                uploadedUrl = (res as any).url
            }

            if (uploadedUrl) {
                setFormData((prev) => ({ ...prev, imgUrl: uploadedUrl }))
                toast.success('Dish photo uploaded successfully!')
            } else {
                toast.error('Server did not return a valid image URL.')
            }
        } catch (err: any) {
            toast.error(
                err.response?.data?.message ||
                err.response?.data?.detail ||
                err.message ||
                'Failed to upload image to bucket.'
            )
        } finally {
            setIsUploading(false)
        }
    }

    const handleFileInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            await handleUploadFile(file)
        }
    }

    const handleDrop = async (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(false)
        const file = e.dataTransfer.files?.[0]
        if (file) {
            await handleUploadFile(file)
        }
    }

    const handleSaveDish = (e: React.FormEvent) => {
        e.preventDefault()
        if (!formData.name.trim()) {
            toast.error('Please enter a valid dish name.')
            return
        }

        const selectedCat = categories.find((c) => c.id === Number(formData.categoryId)) || {
            id: Number(formData.categoryId),
            name: 'Uncategorized',
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
            toast.success(`Dish "${formData.name}" updated successfully.`)
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
            toast.success(`New dish "${formData.name}" added successfully.`)
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
        toast.success(`Category "${newCat.name}" added.`)
    }

    return (
        <div className="space-y-6 font-sans">
            {/* Top Toolbar */}
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-stone-200/80">
                <div className="flex items-center gap-3 flex-1">
                    <div className="relative flex-1 max-w-md">
                        <Search className="w-4 h-4 absolute left-3 top-3 text-stone-400" />
                        <input
                            type="text"
                            placeholder="Search dishes by name..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-stone-200 focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20 outline-none text-sm transition-all"
                        />
                    </div>

                    <select
                        value={selectedCategory}
                        onChange={(e) =>
                            setSelectedCategory(e.target.value === 'ALL' ? 'ALL' : Number(e.target.value))
                        }
                        className="px-4 py-2.5 rounded-xl border border-stone-200 bg-white text-sm focus:border-amber-600 outline-none font-medium text-stone-800 cursor-pointer"
                    >
                        <option value="ALL">All Categories ({dishes.length})</option>
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
                        className="px-4 py-2.5 rounded-xl bg-stone-100 text-stone-800 hover:bg-stone-200 font-semibold text-sm transition-all border border-stone-200 flex items-center gap-2 cursor-pointer shadow-xs"
                    >
                        <FolderPlus className="w-4 h-4 text-stone-600" />
                        <span>Manage Categories</span>
                    </button>
                    <button
                        onClick={handleOpenAddModal}
                        className="px-5 py-2.5 rounded-xl bg-amber-600 text-white hover:bg-amber-700 font-semibold text-sm shadow-sm transition-all flex items-center gap-2 cursor-pointer"
                    >
                        <Plus className="w-4 h-4" />
                        <span>Add New Dish</span>
                    </button>
                </div>
            </div>

            {/* Dishes Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-stone-200/80 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-stone-50 text-stone-600 text-xs font-bold uppercase tracking-wider border-b border-stone-200">
                                <th className="py-4 px-6">Dish</th>
                                <th className="py-4 px-6">Category</th>
                                <th className="py-4 px-6">Price</th>
                                <th className="py-4 px-6">Description</th>
                                <th className="py-4 px-6 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-100 text-sm">
                            {filteredDishes.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="py-12 text-center text-stone-400 font-medium">
                                        No dishes found matching your criteria.
                                    </td>
                                </tr>
                            ) : (
                                filteredDishes.map((dish) => (
                                    <tr key={dish.id} className="hover:bg-amber-50/40 transition-colors">
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-3">
                                                <img
                                                    src={
                                                        dish.imgUrl ||
                                                        'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500'
                                                    }
                                                    alt={dish.name}
                                                    className="w-12 h-12 rounded-xl object-cover border border-stone-200 shadow-xs"
                                                />
                                                <div>
                                                    <h4 className="font-bold text-stone-900">{dish.name}</h4>
                                                    <span className="text-xs text-stone-400">ID: #{dish.id}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-stone-100 text-stone-800 border border-stone-200">
                                                {dish.category?.name || 'Uncategorized'}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6 font-bold text-stone-900 tabular-nums">
                                            {dish.price.toLocaleString('vi-VN')} VND
                                        </td>
                                        <td className="py-4 px-6 text-stone-600 max-w-xs truncate">
                                            {dish.describe || 'No description provided'}
                                        </td>
                                        <td className="py-4 px-6 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => handleOpenEditModal(dish)}
                                                    className="p-2 rounded-lg text-stone-600 hover:text-amber-700 hover:bg-stone-100 transition-colors cursor-pointer"
                                                    title="Edit Dish"
                                                    aria-label="Edit Dish"
                                                >
                                                    <Pencil className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteDish(dish.id)}
                                                    className="p-2 rounded-lg text-stone-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                                                    title="Delete Dish"
                                                    aria-label="Delete Dish"
                                                >
                                                    <Trash2 className="w-4 h-4" />
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
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
                    <div className="bg-white rounded-2xl shadow-xl border border-stone-200 w-full max-w-lg overflow-hidden font-sans">
                        <div className="px-6 py-4 bg-stone-50 border-b border-stone-200 flex items-center justify-between">
                            <h3 className="font-bold text-stone-900 text-lg">
                                {editingDish ? 'Edit Dish' : 'Add New Dish'}
                            </h3>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="text-stone-400 hover:text-stone-800 p-1 rounded-lg transition-colors cursor-pointer"
                                aria-label="Close modal"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <form onSubmit={handleSaveDish} className="p-6 space-y-4 max-h-[85vh] overflow-y-auto">
                            <div>
                                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                                    Dish Name *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="e.g. Special Beef Pho"
                                    className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-500/20"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                                        Price (VND) *
                                    </label>
                                    <input
                                        type="number"
                                        required
                                        min={0}
                                        step={1000}
                                        value={formData.price}
                                        onChange={(e) =>
                                            setFormData({ ...formData, price: Number(e.target.value) })
                                        }
                                        className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-500/20"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                                        Category *
                                    </label>
                                    <select
                                        value={formData.categoryId}
                                        onChange={(e) =>
                                            setFormData({ ...formData, categoryId: Number(e.target.value) })
                                        }
                                        className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm outline-none focus:border-amber-600 bg-white cursor-pointer"
                                    >
                                        {categories.map((cat) => (
                                            <option key={cat.id} value={cat.id}>
                                                {cat.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Dish Photo Upload (POST /api/v1/dishes/upload) */}
                            <div>
                                <div className="flex items-center justify-between mb-1.5">
                                    <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider">
                                        Dish Photo
                                    </label>
                                    <button
                                        type="button"
                                        onClick={() => setShowManualUrl((prev) => !prev)}
                                        className="text-xs text-amber-700 hover:text-amber-800 font-medium flex items-center gap-1 cursor-pointer"
                                    >
                                        <LinkIcon className="w-3 h-3" />
                                        <span>{showManualUrl ? 'Use file upload' : 'Enter URL manually'}</span>
                                    </button>
                                </div>

                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleFileInputChange}
                                    accept="image/png,image/jpeg,image/webp,image/gif"
                                    className="hidden"
                                />

                                {showManualUrl ? (
                                    <input
                                        type="text"
                                        value={formData.imgUrl}
                                        onChange={(e) => setFormData({ ...formData, imgUrl: e.target.value })}
                                        placeholder="https://images.unsplash.com/..."
                                        className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm outline-none focus:border-amber-600"
                                    />
                                ) : (
                                    <div>
                                        {formData.imgUrl ? (
                                            <div className="relative rounded-2xl border border-stone-200 overflow-hidden bg-stone-50 p-3 flex items-center gap-4">
                                                <img
                                                    src={formData.imgUrl}
                                                    alt="Dish Preview"
                                                    className="w-20 h-20 rounded-xl object-cover border border-stone-200 shadow-xs"
                                                />
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-xs font-semibold text-stone-800 truncate mb-1">
                                                        Image attached
                                                    </p>
                                                    <p className="text-[11px] text-stone-400 truncate mb-2">
                                                        {formData.imgUrl}
                                                    </p>
                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            type="button"
                                                            onClick={() => fileInputRef.current?.click()}
                                                            disabled={isUploading}
                                                            className="px-2.5 py-1 rounded-lg bg-white border border-stone-200 text-stone-700 hover:bg-stone-50 text-xs font-medium cursor-pointer"
                                                        >
                                                            Replace
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => setFormData({ ...formData, imgUrl: '' })}
                                                            className="px-2.5 py-1 rounded-lg text-red-600 hover:bg-red-50 text-xs font-medium cursor-pointer"
                                                        >
                                                            Remove
                                                        </button>
                                                    </div>
                                                </div>
                                                {isUploading && (
                                                    <div className="absolute inset-0 bg-white/80 backdrop-blur-xs flex items-center justify-center gap-2">
                                                        <Loader2 className="w-5 h-5 text-amber-600 animate-spin" />
                                                        <span className="text-xs font-semibold text-stone-700">Uploading...</span>
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            <div
                                                onClick={() => !isUploading && fileInputRef.current?.click()}
                                                onDragOver={(e) => {
                                                    e.preventDefault()
                                                    setIsDragging(true)
                                                }}
                                                onDragLeave={(e) => {
                                                    e.preventDefault()
                                                    setIsDragging(false)
                                                }}
                                                onDrop={handleDrop}
                                                className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all cursor-pointer ${
                                                    isDragging
                                                        ? 'border-amber-600 bg-amber-50/50'
                                                        : 'border-stone-200 hover:border-amber-500 hover:bg-stone-50/60'
                                                }`}
                                            >
                                                {isUploading ? (
                                                    <div className="flex flex-col items-center justify-center py-2 space-y-2">
                                                        <Loader2 className="w-8 h-8 text-amber-600 animate-spin" />
                                                        <p className="text-xs font-semibold text-stone-700">
                                                            Uploading photo to storage bucket...
                                                        </p>
                                                    </div>
                                                ) : (
                                                    <div className="flex flex-col items-center justify-center py-2 space-y-2">
                                                        <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center">
                                                            <Upload className="w-5 h-5" />
                                                        </div>
                                                        <div>
                                                            <p className="text-xs font-semibold text-stone-800">
                                                                Click to upload or drag & drop dish image
                                                            </p>
                                                            <p className="text-[11px] text-stone-400 mt-0.5">
                                                                PNG, JPG, or WEBP (Max 5MB)
                                                            </p>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                                    Description
                                </label>
                                <textarea
                                    rows={3}
                                    value={formData.describe}
                                    onChange={(e) => setFormData({ ...formData, describe: e.target.value })}
                                    placeholder="Key ingredients, flavor notes, or allergen information..."
                                    className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-500/20"
                                />
                            </div>

                            <div className="pt-4 flex items-center justify-end gap-3 border-t border-stone-100">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-5 py-2.5 rounded-xl border border-stone-200 text-stone-700 hover:bg-stone-50 font-semibold text-sm cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isUploading}
                                    className="px-6 py-2.5 rounded-xl bg-amber-600 text-white hover:bg-amber-700 font-semibold text-sm shadow-sm transition-all cursor-pointer disabled:opacity-50"
                                >
                                    Save Dish
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Category Management Modal */}
            {isCatModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
                    <div className="bg-white rounded-2xl shadow-xl border border-stone-200 w-full max-w-md overflow-hidden font-sans">
                        <div className="px-6 py-4 bg-stone-50 border-b border-stone-200 flex items-center justify-between">
                            <h3 className="font-bold text-stone-900 text-lg">Category Management</h3>
                            <button
                                onClick={() => setIsCatModalOpen(false)}
                                className="text-stone-400 hover:text-stone-800 p-1 rounded-lg transition-colors cursor-pointer"
                                aria-label="Close modal"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="p-6 space-y-4">
                            <form onSubmit={handleAddCategory} className="flex items-center gap-2">
                                <input
                                    type="text"
                                    required
                                    value={newCatName}
                                    onChange={(e) => setNewCatName(e.target.value)}
                                    placeholder="New category name..."
                                    className="flex-1 px-4 py-2.5 rounded-xl border border-stone-200 text-sm outline-none focus:border-amber-600"
                                />
                                <button
                                    type="submit"
                                    className="px-4 py-2.5 rounded-xl bg-amber-600 text-white hover:bg-amber-700 font-semibold text-sm cursor-pointer shadow-xs"
                                >
                                    Add
                                </button>
                            </form>

                            <div className="mt-4 space-y-2 max-h-60 overflow-y-auto pr-1">
                                <h4 className="text-xs font-bold text-stone-700 uppercase tracking-wider">
                                    Existing Categories ({categories.length})
                                </h4>
                                {categories.map((cat) => (
                                    <div
                                        key={cat.id}
                                        className="flex items-center justify-between p-3 rounded-xl bg-stone-50 border border-stone-200 text-sm text-stone-800 font-medium"
                                    >
                                        <span>{cat.name}</span>
                                        <span className="text-xs text-stone-400">ID: #{cat.id}</span>
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
