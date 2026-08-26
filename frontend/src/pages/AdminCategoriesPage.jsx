import { useState, useEffect } from 'react';
import { ImageIcon, Trash2, Pencil } from 'lucide-react';
import apiClient from '../api/client.js';
import { getCategories } from '../api/catalogApi.js';
import { getImageUrl } from '../utils/imageUrl.js';
import AdminLayout from '../components/AdminLayout.jsx';
import Button from '../components/Button.jsx';
import Input from '../components/Input.jsx';

const EMPTY_FORM = {
    name: '',
    slug: '',
    description: '',
    order: 0,
};

function CategoryRow({ category, onEdit, onDelete }) {
    return (
        <div className="flex items-center gap-4 bg-creme rounded-lg p-4">
            <div className="w-14 h-14 bg-blanc rounded-lg flex items-center justify-center shrink-0 overflow-hidden">
                {category.image ? (
                    <img src={getImageUrl(category.image)} alt={category.name} className="w-full h-full object-cover" />
                ) : (
                    <ImageIcon className="w-5 h-5 text-brun-gris" strokeWidth={1.2} />
                )}
            </div>
            <div className="flex-1 min-w-0">
                <p className="font-body text-body text-noir-chaud truncate">{category.name}</p>
                <p className="font-body text-body-sm text-brun-gris">Ordre : {category.order}</p>
            </div>
            <button onClick={() => onEdit(category)} aria-label="Modifier">
                <Pencil className="w-4 h-4 text-brun-gris" />
            </button>
            <button onClick={() => onDelete(category.id)} aria-label="Supprimer">
                <Trash2 className="w-4 h-4 text-red-500" />
            </button>
        </div>
    );
}

function CategoryForm({ editingCategory, onSaved, onCancel }) {
    const [form, setForm] = useState(EMPTY_FORM);
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (editingCategory) {
            setForm({
                name: editingCategory.name,
                slug: editingCategory.slug,
                description: editingCategory.description,
                order: editingCategory.order,
            });
            setImagePreview(editingCategory.image ? getImageUrl(editingCategory.image) : null);
        } else {
            setForm(EMPTY_FORM);
            setImagePreview(null);
        }
        setImageFile(null);
    }, [editingCategory]);

    function handleChange(field, value) {
        setForm((current) => ({ ...current, [field]: value }));
    }

    function handleImageChange(e) {
        const file = e.target.files?.[0];
        if (!file) return;
        setImageFile(file);
        setImagePreview(URL.createObjectURL(file));
    }

    async function uploadImage(categoryId) {
        const formData = new FormData();
        formData.append('image', imageFile);
        await apiClient.post(`/admin/categories/${categoryId}/image`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setError(null);
        setIsSubmitting(true);

        try {
            const payload = { ...form, order: parseInt(form.order, 10) };
            let categoryId = editingCategory?.id;

            if (editingCategory) {
                await apiClient.patch(`/admin/categories/${editingCategory.id}`, payload);
            } else {
                const response = await apiClient.post('/admin/categories', payload);
                categoryId = response.data.id;
            }

            if (imageFile && categoryId) {
                await uploadImage(categoryId);
            }

            onSaved();
        } catch (err) {
            setError(err.response?.data?.errors || "Erreur lors de l'enregistrement.");
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-3 bg-blanc border border-brun-gris/15 rounded-lg p-5">
            <p className="font-body text-body font-medium text-noir-chaud">
                {editingCategory ? 'Modifier la catégorie' : 'Ajouter une catégorie'}
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
            <Input
                type="number"
                placeholder="Ordre d'affichage"
                value={form.order}
                onChange={(e) => handleChange('order', e.target.value)}
            />

            <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-creme rounded-lg flex items-center justify-center shrink-0 overflow-hidden">
                    {imagePreview ? (
                        <img src={imagePreview} alt="Aperçu" className="w-full h-full object-cover" />
                    ) : (
                        <ImageIcon className="w-5 h-5 text-brun-gris" strokeWidth={1.2} />
                    )}
                </div>
                <label className="font-body text-body-sm text-noir-chaud">
                    <span className="block mb-1">Image de la catégorie</span>
                    <input type="file" accept="image/*" onChange={handleImageChange} />
                </label>
            </div>

            {!editingCategory && (
                <p className="font-body text-body-sm text-brun-gris">
                    L'image sera envoyée juste après la création de la catégorie.
                </p>
            )}

            <div className="flex gap-3">
                <Button variant="primary" type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Enregistrement...' : 'Enregistrer'}
                </Button>
                {editingCategory && (
                    <Button variant="secondary" type="button" onClick={onCancel}>
                        Annuler
                    </Button>
                )}
            </div>

            {error && <p className="font-body text-body-sm text-red-500">{JSON.stringify(error)}</p>}
        </form>
    );
}

export default function AdminCategoriesPage() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingCategory, setEditingCategory] = useState(null);

    async function fetchData() {
        try {
            const data = await getCategories();
            setCategories(data);
        } catch (err) {
            console.error('Erreur lors du chargement des catégories', err);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchData();
    }, []);

    async function handleDelete(id) {
        try {
            await apiClient.delete(`/admin/categories/${id}`);
            fetchData();
        } catch (err) {
            console.error('Erreur lors de la suppression', err);
        }
    }

    function handleSaved() {
        setEditingCategory(null);
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
            <h1 className="font-heading text-h1 text-noir-chaud mb-6">Catégories</h1>

            <div className="flex flex-col gap-2 mb-8">
                {categories.map((category) => (
                    <CategoryRow
                        key={category.id}
                        category={category}
                        onEdit={setEditingCategory}
                        onDelete={handleDelete}
                    />
                ))}
            </div>

            <CategoryForm
                editingCategory={editingCategory}
                onSaved={handleSaved}
                onCancel={() => setEditingCategory(null)}
            />
        </AdminLayout>
    );
}