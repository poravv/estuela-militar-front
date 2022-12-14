import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
//Importamos componentes creados
import Inicio from '../components/Inicio';
import NuevoProducto from '../components/Producto/NuevoProducto';
import ListaProductos from '../components/Producto/ListaProductos';
import ListaProveedor from '../components/Proveedor/ListaProveedor';
import ListaInventario from '../components/Inventario/ListaInventario';
import NuevoInventario from '../components/Inventario/NuevoInventario';
import ListaVenta from '../components/Venta/ListaVenta';
import NuevaVenta from '../components/Venta/NuevaVenta';
import AppBar from './AppBar';
import TableFormat from '../components/TableModel/Table';
import NuevoProveedor from '../components/Proveedor/NuevoProveedor';
import ListaCliente from '../components/Cliente/ListaCliente';
import NuevoCliente from '../components/Cliente/NuevoCliente';

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
                  <Route path='/articulo' element={<ListaProductos token={usuario.token} />} />
                  <Route path='/creararticulo' element={<NuevoProducto idusuario={usuario.body.idusuario} token={usuario.token} />} />

                  <Route path='*' element={<Navigate replace to='/' />} />
                  

                </>
                : null
            }
            
            #Cliente
            <Route path='/cliente' element={<ListaCliente token={usuario.token} />} />
            <Route path='/crearcliente' element={<NuevoCliente token={usuario.token} />} />

            #Inventario
            <Route path='/inventario' element={<ListaInventario token={usuario.token} idsucursal={usuario.body.idsucursal} />} />
            <Route path='/crearinv' element={<NuevoInventario token={usuario.token} idsucursal={usuario.body.idsucursal} />} />
            
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
