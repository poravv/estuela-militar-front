import axios from 'axios';
import { useState, useEffect, useRef } from 'react'
import { Logout } from '../Utils/Logout';
import * as XLSX from 'xlsx/xlsx.mjs';
import { Popconfirm, Typography } from 'antd';
import { Form } from 'antd';
import TableModel from '../TableModel/TableModel';
import { Tag } from 'antd';
import { message } from 'antd';
import { SearchOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Input, Space } from 'antd';
import Highlighter from 'react-highlight-words';
import { useNavigate } from "react-router-dom";
import { RiFileExcel2Line, RiFilePdfFill } from "react-icons/ri";

const URI = 'http://186.158.152.141:3002/automot/api/cliente/';
let fechaActual = new Date();
const ListaClientes = ({ token }) => {

    const [form] = Form.useForm();
    const [data, setData] = useState([]);

    const [editingKey, setEditingKey] = useState('');
    const strFecha = fechaActual.getFullYear() + "-" + (fechaActual.getMonth() + 1) + "-" + fechaActual.getDate();
    //---------------------------------------------------
    //Datos de buscador
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef(null);
    const navigate = useNavigate();
    //---------------------------------------------------
    useEffect(() => {
        getCliente();
        // eslint-disable-next-line
    }, []);

    //CONFIGURACION DE TOKEN
    const config = {
        headers: {
            "Authorization": `Bearer ${token}`,
        }
    };

    const getCliente = async () => {
        const res = await axios.get(`${URI}/get`, config)
        /*En caso de que de error en el server direcciona a login*/
        if (res.data.error) {
            Logout();
        }
        setData(res.data.body);
    }

    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };

    const handleReset = (clearFilters) => {
        clearFilters();
        setSearchText('');
    };

    const getColumnSearchProps = (dataIndex) => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
            <div style={{ padding: 8, }} onKeyDown={(e) => e.stopPropagation()} >
                <Input
                    ref={searchInput}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{
                        marginBottom: 8,
                        display: 'block',
                    }} />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                        icon={<SearchOutlined />}
                        size="small"
                        style={{
                            width: 90,
                        }} >
                        Search
                    </Button>
                    <Button
                        onClick={() => clearFilters && handleReset(clearFilters)}
                        size="small"
                        style={{
                            width: 90,
                        }} >
                        Reset
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            confirm({
                                closeDropdown: false,
                            });
                            setSearchText(selectedKeys[0]);
                            setSearchedColumn(dataIndex);
                        }} >
                        Filter
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => { close(); }} >
                        close
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered) => (
            <SearchOutlined
                style={{
                    color: filtered ? '#1890ff' : undefined,
                }}
            />
        ),
        onFilter: (value, record) =>
            record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
        onFilterDropdownOpenChange: (visible) => {
            if (visible) {
                setTimeout(() => searchInput.current?.select(), 100);
            }
        },
        render: (text) =>
            searchedColumn === dataIndex ? (
                <Highlighter
                    highlightStyle={{
                        backgroundColor: '#ffc069',
                        padding: 0,
                    }}
                    searchWords={[searchText]}
                    autoEscape
                    textToHighlight={text ? text.toString() : ''}
                />
            ) : (
                text
            ),
    });


    const deleteProducto = async (id) => {
        await axios.put(`${URI}/inactiva/${id}`, {}, config);
        getCliente();
    }

    const handleExport = () => {
        var wb = XLSX.utils.book_new(), ws = XLSX.utils.json_to_sheet(data);
        XLSX.utils.book_append_sheet(wb, ws, 'Clientes');
        XLSX.writeFile(wb, 'Clientes.xlsx')
    }

    const updateCliente = async (newData) => {
        //console.log('Entra en update');
        //console.log(newData)
        await axios.put(URI + "put/" + newData.idcliente, newData, config
        );
        getCliente();
    }


    const columns = [
        {
            title: 'id',
            dataIndex: 'idcliente',
            width: '5%',
            editable: false,
        },
        {
            title: 'Cliente',
            dataIndex: 'razon_social',
            //width: '22%',
            editable: true,
            ...getColumnSearchProps('razon_social'),
        },
        {
            title: 'Ruc',
            dataIndex: 'ruc',
            //width: '22%',
            editable: true,
            ...getColumnSearchProps('ruc'),
        },
        {
            title: 'Telefono',
            dataIndex: 'telefono',
            //width: '5%',
            editable: true,
        },
        {
            title: 'Correo',
            dataIndex: 'correo',
            //width: '12%',
            editable: true,
        },
        {
            title: 'Direccion',
            dataIndex: 'direccion',
            //width: '10%',
            editable: true,
        },
        {
            title: 'Ciudad',
            dataIndex: 'idciudad',
            //  width: '15%',
            editable: true,
            render: (_, { ciudad }) => {
                return (
                    ciudad.descripcion
                );
            },
        },
        {
            title: 'Tipo',
            dataIndex: 'tipo_cli',
            //  width: '15%',
            editable: true,
            render: (_, { tipo_cli }) => {
                if(tipo_cli){
                    return (
                        tipo_cli === 'F' ? 'Fisico' : 'Juridico'
                );
                }else{
                    return (
                        null
                );
                }
            },
        },
        {
            title: 'Sexo',
            dataIndex: 'sexo',
            //  width: '15%',
            editable: true,
            render: (_, { sexo }) => {
                if(sexo){
                    return (
                        sexo === 'MA' ? 'Masculino' : 'Femenino'
                );
                }else{
                    return (
                        null
                );
                }
            },
        },
        {
            title: 'Estado',
            dataIndex: 'estado',
            //width: '10%',
            editable: true,
            render: (_, { estado, idcliente }) => {
                let color = 'black';
                if (estado.toUpperCase() === 'AC') { color = 'green' }
                else { color = 'volcano'; }
                return (
                    <Tag color={color} key={idcliente} >
                        {estado.toUpperCase() === 'AC' ? 'Activo' : 'Inactivo'}
                    </Tag>
                );
            },
        },
        {
            title: 'Accion',
            dataIndex: 'operacion',
            render: (_, record) => {

                const editable = isEditing(record);

                return editable ? (
                    <span>
                        <Typography.Link
                            onClick={() => save(record.idcliente, record)}
                            style={{
                                marginRight: 8,
                            }} >
                            Guardar
                        </Typography.Link>
                        <br />
                        <Popconfirm title="Desea cancelar?" onConfirm={cancel}>
                            <a href='/'>Cancel</a>
                        </Popconfirm>
                    </span>
                ) : (
                    <>
                        <Typography.Link style={{ margin: `5px` }} disabled={editingKey !== ''} onClick={() => edit(record)}>
                            Editar
                        </Typography.Link>
                        <Popconfirm
                            title="Desea eliminar este registro?"
                            onConfirm={() => confirmDel(record.idcliente)}
                            onCancel={cancel}
                            okText="Yes"
                            cancelText="No" >
                            <Typography.Link >
                                Borrar
                            </Typography.Link>
                        </Popconfirm>
                    </>
                );
            },
        }
    ];

    const edit = (record) => {
        form.setFieldsValue({
            ...record,
        });
        setEditingKey(record.idcliente);
    };


    const isEditing = (record) => record.idcliente === editingKey;

    const cancel = () => {
        setEditingKey('');
    };

    const confirmDel = (idcliente) => {
        message.success('Procesando');
        //deleteCliente(idcliente);
        deleteProducto(idcliente)
    };

    const save = async (idcliente, record) => {
        //console.log('record:  ',record.img.length);
        //console.log(idcliente);
        try {
            const row = await form.validateFields();
            const newData = [...data];
            const index = newData.findIndex((item) => idcliente === item.idcliente);

            if (index > -1) {
                const item = newData[index];
                //console.log(newData);

                newData.splice(index, 1, {
                    ...item,
                    ...row,
                });

                if (record.idcliente === item.idcliente) {
                    //console.log('Entra en asignacion',record.img);
                    newData[index].img = record.img;
                }

                newData[index].fecha_upd = strFecha;

                //console.log(newData);

                updateCliente(newData[index]);
                setData(newData);
                setEditingKey('');
                message.success('Registro actualizado');
            } else {
                newData.push(row);
                setData(newData);
                setEditingKey('');
            }
        } catch (errInfo) {
            console.log('Validate Failed:', errInfo);
        }
    };



    const mergedColumns = columns.map((col) => {
        if (!col.editable) {
            return col;
        }
        return {
            ...col,
            onCell: (record) => ({
                record,
                inputType: col.dataIndex === 'age' ? 'number' : 'text',
                dataIndex: col.dataIndex,
                title: col.title,
                editing: isEditing(record),
            }),
        };
    });

    return (
        <>
            <h3>Clientes</h3>
            <Button type='primary' style={{ backgroundColor: `#08AF17`, margin: `2px` }}  ><RiFileExcel2Line onClick={handleExport} size={20} /></Button>
            <Button type='primary' style={{ backgroundColor: `#E94325`, margin: `2px` }}  ><RiFilePdfFill size={20} /></Button>
            <div style={{ marginBottom: `5px`, textAlign: `end` }}>
                <Button type="primary" onClick={() => navigate('/crearcliente')} >{<PlusOutlined />} Nuevo</Button>
            </div>
            <TableModel token={token} mergedColumns={mergedColumns} data={data} form={form} keyExtraido={'idcliente'} />
        </>
    )
}
export default ListaClientes;