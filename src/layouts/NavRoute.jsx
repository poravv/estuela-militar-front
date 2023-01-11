import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
//Importamos componentes creados
import Inicio from '../components/Inicio';
import NuevoDetModelo from '../components/DetModelo/NuevoDetModelo';
import ListaDetModelo from '../components/DetModelo/ListaDetModelo';
import ListaDetModeloTotal from '../components/DetModelo/ListaDetModeloTotal';
import ListaProveedor from '../components/Proveedor/ListaProveedor';
import ListaVenta from '../components/Venta/ListaVenta';
import NuevaVenta from '../components/Venta/NuevaVenta';
import AppBar from './AppBar';
import TableFormat from '../components/TableModel/Table';
import NuevoProveedor from '../components/Proveedor/NuevoProveedor';
import ListaInscripcion from '../components/Inscripcion/ListaInscripcion';
import NuevoInscripcion from '../components/Inscripcion/NuevoInscripcion';
import ListaCiudad from '../components/Ciudad/ListaCiudad';
import NuevoCiudad from '../components/Ciudad/NuevoCiudad';
import ReportePlaya from '../components/Reportes/ReportePlaya';
import ListaContrato from '../components/Contrato/ListaContrato';
import NuevoContrato from '../components/Contrato/NuevoContrato';
import Informes from '../components/Reportes/Informes';
import ListaTurno from '../components/Turno/ListaTurno';
import NuevoTurno from '../components/Turno/NuevoTurno';

function NavRoute({ usuario }) {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<AppBar usuario={usuario.body} />} >
            <Route index element={<Inicio idsucursal={usuario.body.idsucursal} token={usuario.token} usuario={usuario.body.nick}/> }/>
            <Route path='/inicio' element={<Inicio idsucursal={usuario.body.idsucursal} token={usuario.token} usuario={usuario.body.nick}/>} />
            {
              usuario.body.nivel === 1 ?
                <>
                  #Proveedor
                  <Route path='/proveedor' element={<ListaProveedor token={usuario.token} />} />
                  <Route path='/crearprov' element={<NuevoProveedor idusuario={usuario.body.idusuario} token={usuario.token} />} />
                  #Producto
                  <Route path='/detmodelo' element={<ListaDetModelo idsucursal={usuario.body.idsucursal} token={usuario.token} />} />
                  <Route path='/detmodelototal' element={<ListaDetModeloTotal idsucursal={usuario.body.idsucursal} token={usuario.token} />} />
                  <Route path='/creardetmodelo' element={<NuevoDetModelo idsucursal={usuario.body.idsucursal} idusuario={usuario.body.idusuario} token={usuario.token} />} />

                  #Ciudad
                  <Route path='/ciudad' element={<ListaCiudad token={usuario.token} />} />
                  <Route path='/crearciudad' element={<NuevoCiudad token={usuario.token} />} />
                  #Modelo
                  <Route path='/instructor' element={<ListaContrato token={usuario.token} />} />
                  <Route path='/crearcontrato' element={<NuevoContrato token={usuario.token} />} />
                  #Turno
                  <Route path='/turno' element={<ListaTurno token={usuario.token} />} />
                  <Route path='/crearturno' element={<NuevoTurno token={usuario.token} />} />

                  #ReportePlaya
                  <Route path='/repomodelos' element={<ReportePlaya token={usuario.token} />} />
                  <Route path='/informes' element={<Informes token={usuario.token} />} />

                  <Route path='*' element={<Navigate replace to='/' />} />
                  

                </>
                : null
            }
            
            #Inscripcion
            <Route path='/inscripcion' element={<ListaInscripcion token={usuario.token} />} />
            <Route path='/crearinscripcion' element={<NuevoInscripcion token={usuario.token} />} />
            
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
