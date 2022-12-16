import React from 'react'
import '../CSS/Cuerpo.css';
import ReportePlaya from './Reportes/ReportePlaya';


export const Inicio = ({ token,usuario,idsucursal }) => {
    
    return (
        <div className='container'>
            <ReportePlaya token={token} />
        </div>
    );
}
export default Inicio;

//<ListaDetModeloTotal token={token} idsucursal={idsucursal} />