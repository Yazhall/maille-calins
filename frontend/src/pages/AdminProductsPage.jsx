import { useState, useEffect } from 'react';
import { ImageIcon, Trash2, Pencil } from 'lucide-react';
import apiClient from '../api/client.js';
import { getProducts, getCategories } from '../api/catalogApi.js';
import AdminLayout from '../components/AdminLayout.jsx';
import Button from '../components/Button.jsx';
import Input from '../components/Input.jsx';
import { getImageUrl } from '../utils/imageUrl.js';
const EMPTY_FORM = {
    name: '',
    slug: '',
    description: '',
    price: '',
    stock: '',
    status: 'published',
    categoryIds: [],
};

function ProductRow({ product, onEdit, onDelete }) {
    return (
        <div className="flex items-center gap-4 bg-creme rounded-lg p-4">
            <div className="w-14 h-14 bg-blanc rounded-lg flex items-center justify-center shrink-0 overflow-hidden">
                {product.image ? (
                    <img src={getImageUrl(product.image)} alt={product.name} className="w-full h-full object-cover" />
                ) : (
                    <ImageIcon className="w-5 h-5 text-brun-gris" strokeWidth={1.2} />
                )}
            </div>
            <div className="flex-1 min-w-0">
                <p className="font-body text-body text-noir-chaud truncate">{product.name}</p>
                <p className="font-body text-body-sm text-brun-gris">
                    {product.price.toFixed(2)} € · Stock : {product.stock}
                </p>
            </div>
            <button onClick={() => onEdit(product)} aria-label="Modifier">
                <Pencil className="w-4 h-4 text-brun-gris" />
            </button>
            <button onClick={() => onDelete(product.id)} aria-label="Supprimer">
                <Trash2 className="w-4 h-4 text-red-500" />
            </button>
        </div>
    );
}

function ProductForm({ categories, editingProduct, onSaved, onCancel }) {
    const [form, setForm] = useState(EMPTY_FORM);
    const [imageFile, setImageFile] = useState(null);
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (editingProduct) {
            setForm({
                name: editingProduct.name,
                slug: editingProduct.slug,
                description: editingProduct.description,
                price: editingProduct.price,
                stock: editingProduct.stock,
                status: editingProduct.status,
                categoryIds: editingProduct.categoryIds || [],
            });
        } else {
            setForm(EMPTY_FORM);
        }
        setImageFile(null);
    }, [editingProduct]);

    function handleChange(field, value) {
        setForm((current) => ({ ...current, [field]: value }));
    }

    function toggleCategory(categoryId) {
        setForm((current) => ({
            ...current,
            categoryIds: current.categoryIds.includes(categoryId)
                ? current.categoryIds.filter((id) => id !== categoryId)
                : [...current.categoryIds, categoryId],
        }));
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setError(null);
        setIsSubmitting(true);

        try {
            const payload = {
                ...form,
                price: parseFloat(form.price),
                stock: parseInt(form.stock, 10),
            };

            let productId;
            if (editingProduct) {
                await apiClient.patch(`/admin/products/${editingProduct.id}`, payload);
                productId = editingProduct.id;
            } else {
                const res = await apiClient.post('/admin/products', payload);
                productId = res.data.id;
            }

            if (imageFile) {
                const imageForm = new FormData();
                imageForm.append('image', imageFile);
                await apiClient.post(`/admin/products/${productId}/image`, imageForm, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
            }

            onSaved();
        } catch (err) {
            setError(err.response?.data?.errors || 'Erreur lors de l\'enregistrement.');
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-3 bg-blanc border border-brun-gris/15 rounded-lg p-5">
            <p className="font-body text-body font-medium text-noir-chaud">
                {editingProduct ? 'Modifier le produit' : 'Ajouter un produit'}
            </p>

            <Input placeholder="Nom" value={form.name} onChange={(e) => handleChange('name', e.target.value)} required />
            <Input placeholder="Slug" value={form.slug} onChange={(e) => handleChange('slug', e.target.value)} required />
            <textarea
                placeholder="Description"
                value={form.description}
                onChange={(e) => handleChange('description', e.target.value)}
                className="w-full px-5 py-3 rounded-lg font-body text-noir-chaud bg-blanc border border-brun-gris/30 outline-none"
                rows={3}
                required
            />
            <div className="flex gap-3">
                <Input
                    type="number"
                    step="0.01"
                    placeholder="Prix"
                    value={form.price}
                    onChange={(e) => handleChange('price', e.target.value)}
                    required
                />
                <Input
                    type="number"
                    placeholder="Stock"
                    value={form.stock}
                    onChange={(e) => handleChange('stock', e.target.value)}
                />
            </div>

            <div>
                <p className="font-body text-body-sm text-brun-gris mb-2">Catégories</p>
                <div className="flex flex-wrap gap-2">
                    {categories.map((category) => (
                        <button
                            key={category.id}
                            type="button"
                            onClick={() => toggleCategory(category.id)}
                            className={`px-3 py-1.5 rounded-full font-body text-body-sm ${
                                form.categoryIds.includes(category.id)
                                    ? 'bg-roux-principal text-blanc'
                                    : 'bg-roux-clair text-noir-chaud'
                            }`}
                        >
                            {category.name}
                        </button>
                    ))}
                </div>
            </div>

            <div>
                <label className="font-body text-body-sm text-brun-gris block mb-1">Image du produit</label>
                <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} />
            </div>

            <div className="flex gap-3">
                <Button variant="primary" type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Enregistrement...' : 'Enregistrer'}
                </Button>
                {editingProduct && (
                    <Button variant="secondary" type="button" onClick={onCancel}>
                        Annuler
                    </Button>
                )}
            </div>

            {error && <p className="font-body text-body-sm text-red-500">{JSON.stringify(error)}</p>}
        </form>
    );
}

export default function AdminProductsPage() {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingProduct, setEditingProduct] = useState(null);

    async function fetchData() {
        try {
            const [productsData, categoriesData] = await Promise.all([getProducts(), getCategories()]);
            setProducts(productsData);
            setCategories(categoriesData);
        } catch (err) {
            console.error('Erreur lors du chargement des produits', err);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchData();
    }, []);

    async function handleDelete(id) {
        try {
            await apiClient.delete(`/admin/products/${id}`);
            fetchData();
        } catch (err) {
            console.error('Erreur lors de la suppression', err);
        }
    }

    function handleSaved() {
        setEditingProduct(null);
        fetchData();
    }

    if (loading) {
        return (
            <AdminLayout>
                <p className="font-body text-body text-brun-gris text-center">Chargement...</p>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <h1 className="font-heading text-h1 text-noir-chaud mb-6">Produits</h1>

            <div className="flex flex-col gap-2 mb-8">
                {products.map((product) => (
                    <ProductRow
                        key={product.id}
                        product={product}
                        onEdit={setEditingProduct}
                        onDelete={handleDelete}
                    />
                ))}
            </div>

            <ProductForm
                categories={categories}
                editingProduct={editingProduct}
                onSaved={handleSaved}
                onCancel={() => setEditingProduct(null)}
            />
        </AdminLayout>
    );
}