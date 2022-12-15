import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
//Importamos componentes creados
import Inicio from '../components/Inicio';
import NuevoModelo from '../components/Modelo/NuevoModelo';
import ListaModelo from '../components/Modelo/ListaModelo';
import ListaModeloTotal from '../components/Modelo/ListaModeloTotal';
import ListaProveedor from '../components/Proveedor/ListaProveedor';
import ListaVenta from '../components/Venta/ListaVenta';
import NuevaVenta from '../components/Venta/NuevaVenta';
import AppBar from './AppBar';
import TableFormat from '../components/TableModel/Table';
import NuevoProveedor from '../components/Proveedor/NuevoProveedor';
import ListaCliente from '../components/Cliente/ListaCliente';
import NuevoCliente from '../components/Cliente/NuevoCliente';
import ListaCiudad from '../components/Ciudad/ListaCiudad';
import NuevoCiudad from '../components/Ciudad/NuevoCiudad';
import ListaMarca from '../components/Marca/ListaMarca';
import NuevoMarca from '../components/Marca/NuevoMarca';

function NavRoute({ usuario }) {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<AppBar usuario={usuario.body} />} >
            <Route index element={<Inicio  token={usuario.token} usuario={usuario.body.nick}/> }/>
            <Route path='/inicio' element={<Inicio   token={usuario.token} usuario={usuario.body.nick}/>} />
            {
              usuario.body.nivel === 1 ?
                <>
                  #Proveedor
                  <Route path='/proveedor' element={<ListaProveedor token={usuario.token} />} />
                  <Route path='/crearprov' element={<NuevoProveedor idusuario={usuario.body.idusuario} token={usuario.token} />} />
                  #Producto
                  <Route path='/modelo' element={<ListaModelo idsucursal={usuario.body.idsucursal} token={usuario.token} />} />
                  <Route path='/modelototal' element={<ListaModeloTotal idsucursal={usuario.body.idsucursal} token={usuario.token} />} />
                  <Route path='/crearmodelo' element={<NuevoModelo idsucursal={usuario.body.idsucursal} idusuario={usuario.body.idusuario} token={usuario.token} />} />

                  #Ciudad
                  <Route path='/ciudad' element={<ListaCiudad token={usuario.token} />} />
                  <Route path='/crearciudad' element={<NuevoCiudad token={usuario.token} />} />
                  #Marca
                  <Route path='/marca' element={<ListaMarca token={usuario.token} />} />
                  <Route path='/crearmarca' element={<NuevoMarca token={usuario.token} />} />


                  <Route path='*' element={<Navigate replace to='/' />} />
                  

                </>
                : null
            }
            
            #Cliente
            <Route path='/cliente' element={<ListaCliente token={usuario.token} />} />
            <Route path='/crearcliente' element={<NuevoCliente token={usuario.token} />} />
            
            <Route path='*' element={<Navigate replace to='/' />} />
            #Venta
            <Route path='/venta' element={<ListaVenta token={usuario.token} idusuario={usuario.body.idusuario} />} />
            <Route path='/crearventa' element={<NuevaVenta token={usuario.token} idusuario={usuario.body.idusuario} idsucursal={usuario.body.idsucursal} />} />
            #Table model
            <Route path='/tablemodel' element={<TableFormat title={'Formato'}/>} />
          </Route>
        </Routes>
      </BrowserRouter>
    </> 
  )
}

export default NavRoute;
