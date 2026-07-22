import { useState, useEffect } from 'react'
import { getMe } from '../api/authApi'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

function HomePage() {
    const { logoutUser } = useAuth()
    const navigate = useNavigate()
    const [user, setUser] = useState(null)
    const [error, setError] = useState(null)


    useEffect(() => {
        async function fetchUser() {
            try {
                const data = await getMe()
                setUser(data)
            } catch (err) {
                setError('Impossible de récupérer tes informations.')
            }
        }
        fetchUser()
    }, [])

    if (error) {
        return <p style={{ color: 'red' }}>{error}</p>
    }

    if (!user) {
        return <p>Chargement...</p>
    }

    return (
        <div>
            <h1>Vous êtes connecté, {user.firstName} {user.lastName} !</h1>
            <button onClick={() => { logoutUser(); navigate('/login') }}>Se déconnecter</button>
        </div>
    )
}

export default HomePage