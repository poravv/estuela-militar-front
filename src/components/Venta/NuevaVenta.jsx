

import { useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Button, Form, Input } from 'antd';
import Buscador from '../Buscador/Buscador';
import { Row, Col, message } from 'antd';
import { IoTrashOutline } from 'react-icons/io5';
import Table from 'react-bootstrap/Table';

const URI = 'http://186.158.152.141:3002/automot/api/venta';
const URIINVDET = 'http://186.158.152.141:3002/automot/api/detventa';
const URIMODELO = 'http://186.158.152.141:3002/automot/api/modelo';
const URICLI = 'http://186.158.152.141:3002/automot/api/cliente';


let fechaActual = new Date();

function NuevaVenta({ token, idusuario, idsucursal }) {

    console.log(idsucursal)
 
    //Parte de nuevo registro por modal
    const strFecha = fechaActual.getFullYear() + "-" + (fechaActual.getMonth() + 1) + "-" + fechaActual.getDate();
    const [tblventatmp, setTblVentaTmp] = useState([]);
    const [total, setTotal] = useState(0);
    const [totalIva, setTotalIva] = useState(0);
    const [descuento, setDescuento] = useState(0);
    const [modeloSelect, setModeloSelect] = useState(0);
    const [cliente, setCliente] = useState(0);
    const navigate = useNavigate();
    const [lstmodelo, setLstmodelo] = useState([]);
    const [lstClientes, setLstClientes] = useState([]);

    useEffect(() => {
        getmodelos();
        getClientes();
        verificaproceso();
        // eslint-disable-next-line
    }, []);

    //CONFIGURACION DE TOKEN
    const config = {
        headers: {
            "Authorization": `Bearer ${token}`,
        }
    };

    const getmodelos = async () => {
        const res = await axios.get(`${URIMODELO}/getsucursal/${idsucursal}`, config);
        console.log(res.data);
        setLstmodelo(res.data.body);
    }

    const getClientes = async () => {
        const res = await axios.get(`${URICLI}/get`, config);
        setLstClientes(res.data.body);
    }

    const verificaproceso = async () => {
        return await axios.post(URI + `/verificaproceso/${idusuario}-inventario`, {}, config);
    }

    const guardaCab = async (valores) => {
        return await axios.post(URI + "/post/", valores, config);
    }

    const guardaDetalle = async (valores) => {
        await axios.post(URIINVDET + "/post/", valores, config);
    }

    const actualizaModelo = async (idmodelo) => {
        console.log('Entra en ups modelo: ',idmodelo)
        await axios.put(URIMODELO + `/put/${idmodelo}`, {estado:'VE'}, config);
    }


    //procedimiento para actualizar
    const gestionGuardado = async () => {
        //e.preventDefault();
        try {
            guardaCab(
                {
                    idusuario: idusuario,
                    idcliente: cliente.idcliente,
                    estado: 'AC',
                    fecha: strFecha,
                    iva_total: totalIva,
                    total: total,
                    costo_envio: 0,
                    nro_comprobante: 0
                }
            ).then((cabecera) => {
                try {
                    //console.log('cab: ',cabecera.data.body);
                    //console.log('Entra en guarda detalle')
                    //Guardado del detalle
                    tblventatmp.map((venta) => {
                        console.log(venta);
                        console.log('idmodelo: ', venta.modelo.idmodelo)
                        console.log('descuento: ',venta.descuento)
                        console.log('subtotal: ',(venta.modelo.costo))
                        console.log('idventa: ',(cabecera.data.body.idventa))
                        
                        guardaDetalle({
                            idmodelo: venta.modelo.idmodelo,
                            //estado: venta.modelo.estado,
                            estado:'AC',
                            descuento: venta.descuento,
                            idventa: cabecera.data.body.idventa,
                            subtotal: venta.modelo.costo,
                        });
                        actualizaModelo(venta.modelo.idmodelo);

                        return true;

                    });
                    
                    message.success('Registro almacenado');

                } catch (error) {
                    console.log(error);
                    message.error('Error en la creacion');
                    return null;
                }
                navigate('/venta');
            });
            
        } catch (e) {
            console.log(e);
            message.error('Error en la creacion');
            return null;
        }

    }

    const agregarLista = async (e) => {
        e.preventDefault();
        
        //console.log(modeloSelect);

        //Validacion de existencia del modelo dentro de la lista 
        //const modeloSelect = lstmodelo.filter((inv) => inv.idmodelo === idmodeloSelect);
        const validExist = tblventatmp.filter((inv) => inv.idmodelo === modeloSelect.idmodelo);

        if (modeloSelect !== null) {
                if (validExist.length === 0) {
                        tblventatmp.push({
                            idmodelo: modeloSelect.idmodelo,
                            modelo: modeloSelect,
                            descuento: descuento
                        });

                        setTotal(parseInt(total + (modeloSelect.costo) - descuento));
                        setTotalIva(parseInt(totalIva + ((modeloSelect.costo*modeloSelect.tipo_iva/100))));

                    } else {
                        message.warning('Producto ya existe');
                    }
        } else {
            message.warning('Seleccione un modelo');
        }
    }

    const btnCancelar = (e) => {
        e.preventDefault();
        navigate('/venta');
    }

    const onChangemodelo = (value) => {
        //console.log(value);
        //console.log(lstmodelo);
        lstmodelo.find((element) => {
            
            if (element.idmodelo === value) {
                //console.log(element);
                setModeloSelect(element)
                return true;
            } else {
                return false;
            }
        });
    };

    const onChangeCliente = (value) => {

        lstClientes.find((element) => {
            if (element.idcliente === value) {
                //console.log(element);
                setCliente(element)
                return true;
            } else {
                return false;
            }
        });
    };

    const onSearch = (value) => {
        console.log('search:', value);
    };

    const extraerRegistro = async (e,id, costo, monto_iva) => {
        e.preventDefault();
        //console.log('Datos: ',costo,monto_iva)
        const updtblVenta = tblventatmp.filter(inv => inv.idmodelo !== id);
        setTblVentaTmp(updtblVenta);

        try {
            await axios.post(URI + `/operacionventa/${id}-retorno-${idusuario}-0`, {}, config);
        } catch (error) {
            console.log('Error: ', error);
        }

        setTotal(total - costo);
        setTotalIva(totalIva - monto_iva);

    };

    return (
        <>
            <div style={{ marginBottom: `20px` }}>
                <h2>Nueva orden</h2>
            </div>
            <div>
                <Form
                    //style={{ backgroundColor: `gray` }}
                    initialValues={{ remember: true, }}
                    onFinish={gestionGuardado}
                    autoComplete="off">
                    <Row style={{ justifyContent: `center` }}>
                        <Col style={{ marginLeft: `15px` }}>
                            <Buscador label={'razon_social'} title={'Cliente'} value={'idcliente'} data={lstClientes} onChange={onChangeCliente} onSearch={onSearch} />
                        </Col>
                    </Row>


                    <Row style={{ justifyContent: `center`, margin: `10px` }}>
                        <Col style={{ marginLeft: `15px` }}>
                            <Buscador label={'modelo'} title={'Modelo'} value={'idmodelo'} data={lstmodelo} onChange={onChangemodelo} onSearch={onSearch} />
                        </Col>
                        <Col>
                            <Form.Item name="descuento" >
                                <Input type='number' placeholder='Descuento' value={descuento} onChange={(e) => setDescuento(e.target.value)} />
                            </Form.Item>
                        </Col>
                        <Col style={{ marginLeft: `15px` }}>
                            <Button type="primary" htmlType="submit" onClick={(e) => agregarLista(e)} >
                                Agregar
                            </Button>
                        </Col>
                    </Row>
                    <div style={{ alignItems: `center`, justifyContent: `center`, margin: `0px`, display: `flex` }}>
                        <Table striped bordered hover style={{ backgroundColor:`white` }}>
                            <thead className='table-primary'>
                                <tr>
                                    <th>modelo</th>
                                    <th>Costo</th>
                                    <th>Descuento</th>
                                    <th>Iva</th>
                                    <th>Monto Iva</th>
                                    <th>Subtotal iva</th>
                                    <th>Subtotal</th>
                                    <th>Accion</th>
                                </tr>
                            </thead>
                            <tbody>
                                {tblventatmp.length !== 0 ? tblventatmp.map((inv) => (
                                    <tr key={inv.idmodelo}>
                                        <td> {inv.modelo.modelo} </td>
                                        <td> {inv.modelo.costo} </td>
                                        <td> {inv.descuento} </td>
                                        <td> {inv.modelo.tipo_iva + '%'} </td>
                                        <td> {inv.modelo.costo*inv.modelo.tipo_iva/100} </td>
                                        <td> {(inv.modelo.costo*inv.modelo.tipo_iva/100)} </td>
                                        <td> {inv.modelo.costo} </td>
                                        <td>
                                            <button onClick={(e) => extraerRegistro(e,inv.idmodelo, (inv.modelo.costo - descuento), parseInt((inv.modelo.costo*inv.modelo.tipo_iva)/100))} className='btn btn-danger'><IoTrashOutline /></button>
                                        </td>
                                    </tr>
                                )) : null
                                }
                            </tbody>
                            <tfoot >
                                <tr>
                                    <th>Total</th>
                                    <th style={{ textAlign: `start` }} colSpan={7}>
                                        <b>{total}</b>
                                    </th>
                                </tr>
                                <tr>
                                    <th>Total iva</th>
                                    <th style={{ textAlign: `start` }} colSpan={7}>
                                        <b>{parseInt(totalIva) ?? 0}</b>
                                    </th>
                                </tr>
                            </tfoot>
                        </Table>
                    </div>

                    <Row style={{ alignItems: `center`, justifyContent: `center` }}>
                        <Form.Item style={{ margin: `20px` }}>
                            <Button type="primary" htmlType="submit" style={{ margin: `20px` }} >
                                Guardar
                            </Button>
                            <Button type="primary" htmlType="submit" onClick={btnCancelar} style={{ margin: `20px` }} >
                                Cancelar
                            </Button>
                        </Form.Item>
                    </Row>
                </Form>
            </div>
        </>
    );
}

export default NuevaVenta;
