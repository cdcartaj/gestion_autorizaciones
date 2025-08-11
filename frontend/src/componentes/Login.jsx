import { useState } from 'react'
import axios from 'axios'

export const Login = ({ onLogin, onSwitchToRegister }) => {
  const [form, setForm] = useState({ username: '', password: '' })
  const [error, setError] = useState('')

  const handleLogin = (e) => {
    e.preventDefault()
    axios.post('http://localhost:8000/api/token/', form)
      .then(res => {
        localStorage.setItem('token', res.data.access)
        onLogin()
      })
      .catch(() => setError('Credenciales incorrectas'))
  }

  return (
    <>
      <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
        <div className="card p-4 shadow" style={{ width: '100%', maxWidth: '400px' }}>
          <h2 className="mb-3 text-center">Iniciar Sesión</h2>
          {error && <div className="alert alert-danger">{error}</div>}
          <form onSubmit={handleLogin}>
            <div className="mb-3">
              <label className="form-label">Usuario</label>
              <input type="text" className="form-control" autoComplete="new-username"
                value={form.username} autoFocus="AutoFocus"
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Contraseña</label>
              <input type="password" className="form-control" autoComplete="new-password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary w-100">Entrar</button>
          </form>

          <div className="mt-3 text-center">
            <button className="btn btn-link" onClick={onSwitchToRegister}>
              ¿No tienes cuenta? Regístrate aquí
            </button>
          </div>
        </div>
      </div>
      {/* <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
        <h2 className="mb-3">Iniciar Sesión</h2>
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label className="form-label">Usuario</label>
            <input type="text" className="form-control"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Contraseña</label>
            <input type="password" className="form-control"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-100">Entrar</button>
        </form>
        <div className="mt-3 text-center">
          <button className="btn btn-link" onClick={onSwitchToRegister}>
            ¿No tienes cuenta? Regístrate aquí
          </button>
        </div>
      </div> */}
    </>
  )
}
