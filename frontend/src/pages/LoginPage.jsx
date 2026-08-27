import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { login } from '../api/authApi'
import { useAuth } from '../context/AuthContext'
import Input from '../components/Input.jsx'
import Button from '../components/Button.jsx'

function LoginPage() {
    const navigate = useNavigate()
    const { loginUser } = useAuth()

    const [formData, setFormData] = useState({
        email: '',
        password: '',
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
            const data = await login(formData)
            loginUser(data.token)
            navigate('/')
        } catch (err) {
            setError('Email ou mot de passe incorrect.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-rose-poudre flex flex-col items-center justify-center px-4 py-16">
            <div className="w-full max-w-sm flex flex-col items-center text-center gap-2 mb-8">
                <h1 className="font-heading text-h1 text-noir-chaud">Maille &amp; Câlins</h1>
                <p className="font-body text-body text-brun-gris">Connexion à votre compte</p>
            </div>

            <form onSubmit={handleSubmit} className="w-full max-w-sm flex flex-col gap-4">
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

                {error && <p className="font-body text-body-sm text-red-500 text-center">{error}</p>}

                <Button variant="primary" type="submit" disabled={loading} className="w-full justify-center">
                    {loading ? 'Connexion...' : 'Se connecter'}
                </Button>

                <div className="flex flex-col items-center gap-2 mt-1">
                    <Link to="/forgot-password" className="font-body text-body-sm text-roux-principal">
                        Mot de passe oublié ?
                    </Link>
                    <p className="font-body text-body-sm text-roux-principal">
                        Pas encore de compte ?{' '}
                        <Link to="/register" className="font-medium">
                            Créer un compte
                        </Link>
                    </p>
                </div>
            </form>
        </div>
    )
}

export default LoginPage