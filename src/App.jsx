import { useEffect, useState } from "react"


function App() {

  const [usuarios, setUsuarios] = useState([]);
  const [buscar, setBuscar] = useState('')
  const [nombre, setNombre] = useState('')
  const [pass, setPass] = useState('')
  const [idEdit, setIdEdit] = useState(null)
  const [nombreLogin, setNombreLogin] = useState('');
  const [passLogin, setPassLogin] = useState('');
  useEffect(() => {
    fetch("http://localhost:3000/usuarios")
      .then(response => response.json())
      .then(data => {
        setUsuarios(data);
      });
  }, []);

  const login = (a) => {
    a.preventDefault();
    fetch("http://localhost:3000/login", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        nombre: nombreLogin,
        pass: passLogin
      })
    })
    .then(response => response.json())
    .then(data => {
      console.log(data)
    })
    setNombreLogin('');
    setPassLogin('')
  }


  const cargarDatos = (a) => {
    a.preventDefault();

    if (idEdit) {
      fetch(`http://localhost:3000/usuarios/${idEdit}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          nombre: nombre,
          pass: pass
        })
      })
        .then(response => response.json())
        .then(data => {
          setUsuarios(usuarios.map((a) => {
            if(a.id === idEdit){
              return data
            }
            return a;
          }));
          setIdEdit(null)
          setNombre('');
          setPass('');
        })
    } else {
      fetch("http://localhost:3000/usuarios", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          nombre: nombre,
          pass: pass
        })
      })
        .then(response => response.json())
        .then(data => {
          setUsuarios([...usuarios, data]);
          setNombre('');
          setPass('');
        })
    }
  }

  const eliminar = (id) => {
    fetch(`http://localhost:3000/usuarios/${id}`, {
      method: 'DELETE'
    })
      .then(response => response.json())
      .then(data => {
        setUsuarios(usuarios.filter((a) => {
          if (a.id !== id) {
            return a;
          }
        }))
      })
  }
  const editar = (user) => {
    setIdEdit(user.id)
    setNombre(user.nombre);
    setPass(user.pass)
  }

  return (
    <>
      <input placeholder="Buscador" type="text" value={buscar} onChange={(a) => setBuscar(a.target.value)} />
      <br />
      <br />
      <table className="table table-dark table-striped">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Pass</th>
            <th>Editar</th>
            <th>Eliminar</th>
          </tr>
        </thead>
        <tbody>
          {usuarios
            .filter((a) => (
              a.nombre.toLowerCase().includes(buscar.toLocaleLowerCase())
            ))
            .map((a) => (
              <tr key={a.id}>
                <td>{a.nombre}</td>
                <td>{a.pass}</td>
                <td><button onClick={() => editar(a)} type="button" className="btn btn-primary">Editar</button></td>
                <td><button onClick={() => eliminar(a.id)} type="button" className="btn btn-danger">Eliminar</button></td>
              </tr>
            ))}
        </tbody>
      </table>

      <form onSubmit={cargarDatos}>
        <input value={nombre} onChange={(a) => setNombre(a.target.value)} type="text" placeholder="Nombre" />
        <input value={pass} onChange={(a) => setPass(a.target.value)} type="text" placeholder="Pass" />
        <button type="submit" className={idEdit ? 'btn btn-warning' : "btn btn-success"} >{idEdit ? 'Actualizar' : 'Agregar'}</button>
      </form>

      <form onSubmit={login}>
        <input placeholder="Nombre" onChange={(a) => setNombreLogin(a.target.value)} value={nombreLogin} type="text" />
        <input placeholder="Password" onChange={(a) => setPassLogin(a.target.value)} value={passLogin} type="text" />
        <button type="submit" className="btn btn-primary">Iniciar Sesion</button>
      </form>
    </>
  )
}

export default App
