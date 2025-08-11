import { useEffect, useState } from 'react';
import axios from 'axios';
import { Login } from './componentes/Login';
import { Register } from './componentes/Register';
import { Navbar } from './componentes/Navbar';
import './App.css';

function App() {

  //Declración de Estados
  const [autorizacion, setAutorizacion] = useState([]);
  //const [nuevo, setNuevo] = useState({ responsable: '', sin: '', jira: '' })
  const [nuevo, setNuevo] = useState({
    responsable: '',
    sin: '',
    jira: '',
    nombre_jira: '',
    fecha_pap: '',
    autorizador1: false,
    autorizador2: false,
    autorizador3: false,
    autorizador4: false,
    estado: 'en_gestion'
  });
  const [autenticado, setAutenticado] = useState(false);
  const [pantalla, setPantalla] = useState('login'); // 'login' | 'register'
  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [token, setToken] = useState(''); // ✅ agregado

  const headers = { Authorization: `Bearer ${token}` };

  //Funciones 

  const getUsernameFromToken = (token) => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      console.log("User:", payload.username);
      return payload.username || 'Usuario';
    } catch {
      return 'Usuario';
    }
  }
  
  const getNameFromToken = (token) => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      console.log("Nombre:", payload.first_name + ' ' + payload.last_name);
      return payload.first_name + ' ' + payload.last_name;
    } catch {
      return 'Anónimo';
    }
  }
  
  const getEmailFromToken = (token) => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      console.log("Email:", payload.email);
      return payload.email;
    } catch {
      return 'Anónimo';
    }
  }

  const obtenerAutorizacion = (tk) => {
    axios.get('http://localhost:8000/api/autorizacion/', {
      headers: { Authorization: `Bearer ${tk}` }
      })
      .then(res => {
        setAutorizacion(res.data)
      })
      .catch(err => {
        console.error('Error en obtenerAutorizacion: ', err.response?.data || err.message)
        localStorage.removeItem('token')
        setAutenticado(false)
      });
  }

  const cambiarAutorizador = (obj_aut, campo, valor) => {
  axios.patch(`http://localhost:8000/api/autorizacion/${obj_aut.id}/`, {
    [campo]: valor
    }, { headers })
    .then(res => {
      setAutorizacion(autorizacion.map(a => a.id === obj_aut.id ? res.data : a))
      //Si se tienen las 4 autorizaciones, el estado se debe cambiar a "Autorizado"
      if (res.data.autorizador1 === true && res.data.autorizador2 === true &&
          res.data.autorizador3 === true && res.data.autorizador4 === true ) 
          res.data.estado = 'autorizado';
      else 
          res.data.estado = 'en_gestion';
        //console.log('res.data: ', res.data)
    })
    .catch(err => {
        console.error('Error en cambiarEstado: ', err.response.data);
    })

  }

  useEffect(() => {
    const tk = localStorage.getItem('token')
    if (tk) {
      setToken(tk) // ✅ se guarda el token
      setAutenticado(true)
      setUsername(getUsernameFromToken(tk)) // ✅ Se extrae el username
      setName(getNameFromToken(tk)) // ✅ Se extrae el nombre y apellido
      setEmail(getEmailFromToken(tk)) // ✅ Se extrae el correo
      obtenerAutorizacion(tk)
    }
  }, [])


  const crearAutorizacion = (e) => {
    e.preventDefault()
    axios.post('http://localhost:8000/api/autorizacion/', nuevo, { headers })
      .then(res => {
        setAutorizacion([res.data, ...autorizacion])
        setNuevo({
          responsable: '',
          sin: '',
          jira: '',
          nombre_jira: '',
          fecha_pap: '',
          autorizador1: false,
          autorizador2: false,
          autorizador3: false,
          autorizador4: false,
          estado: 'en_gestion'
        })
      })
      .catch(err => {
        console.error('Error en crearAutorizacion: ', err.response.data) 
  })
  }

  const cambiarEstado = (id, estado) => {
    axios.patch(`http://localhost:8000/api/autorizacion/${id}/`, { estado }, { headers })
      .then(res => {
        setAutorizacion(autorizacion.map(p => p.id === id ? res.data : p))
      })
      .catch(err => {
        console.error('Error en cambiarEstado: ', err.response.data) 
  })
  }

  const logout = () => {
    localStorage.removeItem('token')
    setAutenticado(false)
  }

  if (!autenticado) {
    return pantalla === 'login'
      ? <Login
        onLogin={() => window.location.reload()}
        onSwitchToRegister={() => setPantalla('register')}
      />
      : <Register onRegister={() => setPantalla('login')} />
  }

  return (
    <>
      <Navbar onLogout={logout} username={username} />
      <div className="container min-vh-100 py-5">
        <h1 className="mb-4 text-center">📁 Gestión de Autorizaciones</h1>

        <div className="card p-4 mb-5">
          {/* <h4 className="pb-4">Agregar nueva autorización</h4> */}
          <form onSubmit={crearAutorizacion} className="row g-3 mb-4">
            
            <h5 className="fw-bold text-center">Información del Proyecto</h5>
            
            <div className="col-md-4">
              <label className="form-label">Responsable</label>
              <input type="text" className="form-control border border-secondary text-dark"
                // value={nuevo.responsable}
                value={name}
                onChange={(e) => setNuevo({ ...nuevo, responsable: e.target.value })}
                required />
            </div>

            <div className="col-md-4">
              <label className="form-label">SIN</label>
              <input type="number" className="form-control border border-secondary text-dark"
                placeholder='Ej: 123456' min='10000' max='999999' 
                value={nuevo.sin}
                onChange={(e) => setNuevo({ ...nuevo, sin: e.target.value })}
                required
                autoFocus />
            </div>

            <div className="col-md-4">
              <label className="form-label">Jira Padre (Sin prefijo "PS")</label>
              <input type="number" className="form-control border border-secondary text-dark"
                placeholder='Ej: 12345' min='1000' max='99999'
                value={nuevo.jira}
                onChange={(e) => setNuevo({ ...nuevo, jira: e.target.value })}
                required />
            </div>

            <div className="col-md-6">
              <label className="form-label">Nombre del Jira</label>
              <textarea className="form-control border border-secondary text-dark"
                placeholder='Ej: Habilitar 5G...'
                rows="1"
                value={nuevo.nombre_jira}
                onChange={(e) => setNuevo({ ...nuevo, nombre_jira: e.target.value })}
              ></textarea>
            </div>

            <div className="col-md-3">
              <label className="form-label">Fecha PAP</label>
              <input type="date" className="form-control border border-secondary text-dark"
                value={nuevo.fecha_pap}
                onChange={(e) => setNuevo({ ...nuevo, fecha_pap: e.target.value })}
              />
            </div>

            <div className="col-md-3">
              <label className="form-label">Estado</label>
              <select className="form-select border border-secondary text-dark"
                value={nuevo.estado}
                onChange={(e) => setNuevo({ ...nuevo, estado: e.target.value })}
              >
                <option value="">Seleccione</option>
                <option value="en_gestion">En Gestión</option>
                <option value="autorizado">Autorizado</option>
                <option value="finalizado">Finalizado</option>
              </select>
            </div>
            <hr />
            <h5 className="fw-bold mt-1 text-center">Autorizaciones</h5>
            <div className='autorizaciones text-center'> 
              <div className="col-md form-check form-check-inline">
                <input className="form-check-input border border-secondary"
                  type="checkbox"
                  checked={nuevo.autorizador1}
                  onChange={(e) => setNuevo({ ...nuevo, autorizador1: e.target.checked })}
                  id="aut1" 
                />
                <label className="form-check-label" htmlFor="aut1">Gaby</label>
              </div>

              <div className="col-md form-check form-check-inline">
                <input className="form-check-input border border-secondary"
                  type="checkbox"
                  checked={nuevo.autorizador2}
                  onChange={(e) => setNuevo({ ...nuevo, autorizador2: e.target.checked })}
                  id="aut2"
                />
                <label className="form-check-label" htmlFor="aut2">DBA</label>
              </div>

              <div className="col-md form-check form-check-inline">
                <input className="form-check-input border border-secondary"
                  type="checkbox"
                  checked={nuevo.autorizador3}
                  onChange={(e) => setNuevo({ ...nuevo, autorizador3: e.target.checked })}
                  id="aut3"
                />
                <label className="form-check-label" htmlFor="aut3">Carrillo</label>
              </div>

              <div className="col-md form-check form-check-inline">
                <input className="form-check-input border border-secondary"
                  type="checkbox"
                  checked={nuevo.autorizador4}
                  onChange={(e) => setNuevo({ ...nuevo, autorizador4: e.target.checked })}
                  id="aut4"
                />
                <label className="form-check-label" htmlFor="aut4">Ignacio</label>
              </div>
            </div>
            
            <div className="col-md-12 text-center mt-3">
              <button type="submit" className="btn btn-primary px-5">Registrar</button>
            </div>
          </form>


        </div>

        <div className="table-responsive">
          <table className="table table-bordered table-striped">
            <thead className="table-dark text-center">
              <tr>
                <th>ID</th>
                <th>Responsable</th>
                <th>SIN</th>
                <th>Jira</th>
                <th>Nombre Jira</th>
                <th>Fecha PAP</th>
                <th>Gaby</th>
                <th>DBA</th>
                <th>Carrillo</th>
                <th>Ignacio</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody className="text-center">
              {autorizacion.map(aut => (
                <tr key={aut.id}>
                  <td>{aut.id}</td>
                  <td>{aut.responsable}</td>
                  <td>{aut.sin}</td>
                  <td>PS-{aut.jira}</td>
                  <td>{aut.nombre_jira}</td>
                  <td>{aut.fecha_pap}</td>
                  <td>
                    <input type="checkbox" checked={aut.autorizador1}
                    onChange={(e) => cambiarAutorizador(aut, 'autorizador1', e.target.checked)} />
                    {/* {aut.autorizador1 ? "✔️" : "❌"} */}
                  </td>
                  <td>
                    <input type="checkbox" checked={aut.autorizador2}
                    onChange={(e) => cambiarAutorizador(aut, 'autorizador2', e.target.checked)} />
                    {/* {aut.autorizador2 ? "✔️" : "❌"} */}
                  </td>
                  <td>
                    <input type="checkbox" checked={aut.autorizador3}
                    onChange={(e) => cambiarAutorizador(aut, 'autorizador3', e.target.checked)} />
                    {/* {aut.autorizador3 ? "✔️" : "❌"} */}
                  </td>
                  <td>
                    <input type="checkbox" checked={aut.autorizador4}
                    onChange={(e) => cambiarAutorizador(aut, 'autorizador4', e.target.checked)} />
                    {/* {aut.autorizador4 ? "✔️" : "❌"} */}
                  </td>
                  <td>
                    <select className="form-select form-select-sm"
                      value={aut.estado}
                      onChange={(e) => cambiarEstado(aut.id, e.target.value)}>
                      <option value="en_gestion">En Gestión</option>
                      <option value="autorizado">Autorizado</option>
                      <option value="finalizado">Finalizado</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )

}

export default App
