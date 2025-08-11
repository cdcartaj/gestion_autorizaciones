

// export const Navbar = ({ onLogout }) => {
//   return (
//     <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
//       <div className="container-fluid">
//         <span className="navbar-brand">📁 Proyectos</span>
//         <div className="d-flex">
//           <button className="btn btn-outline-light" onClick={onLogout}>
//             Cerrar sesión
//           </button>
//         </div>
//       </div>
//     </nav>
//   )
// }

export const Navbar = ({ onLogout, username }) => {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container-fluid">
        <span className="navbar-brand">📁 Autorizaciones</span>
        <div className="d-flex align-items-center gap-3">
          <span className="text-light">👤 { username }</span>
          <button className="btn btn-outline-light btn-sm" onClick={onLogout}>
            Cerrar sesión
          </button>
        </div>
      </div>
    </nav>
  )
}

