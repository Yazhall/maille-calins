import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { register } from '../api/authApi'
import Input from '../components/Input.jsx'
import Button from '../components/Button.jsx'

function RegisterPage() {
    const navigate = useNavigate()

    const [formData, setFormData] = useState({
        lastName: '',
        firstName: '',
        email: '',
        password: '',
        phone: '',
    })
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)

    function handleChange(event) {
        const { name, value } = event.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    async function handleSubmit(event) {
        event.preventDefault()
        setError(null)
        setLoading(true)

        try {
            await register(formData)
            navigate('/login')
        } catch (err) {
            setError('Impossible de créer le compte. Vérifie tes informations.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-rose-poudre flex flex-col items-center justify-center px-4 py-16">
            <div className="w-full max-w-sm flex flex-col items-center text-center gap-2 mb-8">
                <h1 className="font-heading text-h1 text-noir-chaud">Maille &amp; Câlins</h1>
                <p className="font-body text-body text-brun-gris">Créer votre compte</p>
            </div>

            <form onSubmit={handleSubmit} className="w-full max-w-sm flex flex-col gap-4">
                <Input
                    type="text"
                    name="lastName"
                    placeholder="Nom"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                />

                <Input
                    type="text"
                    name="firstName"
                    placeholder="Prénom"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                />

                <Input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />

                <Input
                    type="password"
                    name="password"
                    placeholder="Mot de passe"
                    value={formData.password}
                    onChange={handleChange}
                    required
                />

                <Input
                    type="tel"
                    name="phone"
                    placeholder="Téléphone"
                    value={formData.phone}
                    onChange={handleChange}
                />

                {error && <p className="font-body text-body-sm text-red-500 text-center">{error}</p>}

                <Button variant="primary" type="submit" disabled={loading} className="w-full justify-center">
                    {loading ? 'Création...' : "S'inscrire"}
                </Button>

                <p className="font-body text-body-sm text-roux-principal text-center mt-1">
                    Déjà un compte ?{' '}
                    <Link to="/login" className="font-medium">
                        Se connecter
                    </Link>
                </p>
            </form>
        </div>
    )
}

export default RegisterPage