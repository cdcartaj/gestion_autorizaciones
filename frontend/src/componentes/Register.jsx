import { useState } from 'react'
import axios from 'axios'

export const Register = ({ onRegister }) => {
    const [form, setForm] = useState({ username: '', password: '' })
    const [error, setError] = useState('')
    const [success, setSuccess] = useState(false)

    const handleRegister = (e) => {
        e.preventDefault()
        setError('')
        axios.post('http://localhost:8000/api/registro/', form)
            .then(() => setSuccess(true))
            // .catch(() => setError('El usuario ya existe o hay un error'))
            .catch(err => {
                    // console.error('Error en Registro: ', err.response?.data || err.message)
                    console.error('Error en Registro: ', err.message)
                    setError('El usuario ya existe o hay un error')
        
            })
    }

    if (success) {
        return (
            <div className="container mt-5" style={{ maxWidth: '400px' }}>
                <div className="alert alert-success">¡Registro exitoso! Ahora puedes iniciar sesión.</div>
                <button className="btn btn-primary w-100" onClick={onRegister}>Ir al login</button>
            </div>
        )
    }

    return (
        <>
            <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
                <div className="card p-4 shadow" style={{ width: '100%', maxWidth: '400px' }}>
                    <h2 className="mb-3 text-center">Registrarse</h2>
                    {error && <div className="alert alert-danger">{error}</div>}
                    <form onSubmit={handleRegister}>
                        <div className="mb-3">
                            <label className="form-label">Usuario</label>
                            <input type="text" className="form-control" autoComplete="new-username"
                                value={form.username} autoFocus="AutoFocus"
                                onChange={(e) => setForm({ ...form, username: e.target.value })}
                                required />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Contraseña</label>
                            <input type="password" className="form-control" autoComplete="new-password"
                                value={form.password}
                                onChange={(e) => setForm({ ...form, password: e.target.value })}
                                required />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Nombre</label>
                            <input type="text" className="form-control" autoComplete="new-first_name"
                                value={form.first_name}
                                onChange={(e) => setForm({ ...form, first_name: e.target.value })}
                                required />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Apellido</label>
                            <input type="text" className="form-control" autoComplete="new-last_name"
                                value={form.last_name}
                                onChange={(e) => setForm({ ...form, last_name: e.target.value })}
                                required />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Email</label>
                            <input type="email" className="form-control" autoComplete="new-email"
                                value={form.email}
                                onChange={(e) => setForm({ ...form, email: e.target.value })}
                                required />
                        </div>
                        <button type="submit" className="btn btn-success w-100">Registrarse</button>
                    </form>
                    <div className="mt-3 text-center">
                        <button className="btn btn-link" onClick={onRegister}>
                            ¿Ya tienes cuenta? Inicia sesión
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}