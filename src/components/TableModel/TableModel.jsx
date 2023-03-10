import axios from 'axios'
import { useState, useEffect } from 'react'
import { Form, Input, InputNumber, Table, Select } from 'antd';
import { Spin } from 'antd';
import Buscador from '../Buscador/Buscador';
import UploadFile from '../Utils/Upload';
import { Buffer } from 'buffer';

const { Option } = Select;
const URIPROV = 'http://186.158.152.141:3002/automot/api/proveedor/';
const URIMARCA = 'http://186.158.152.141:3002/automot/api/marca/';
const URICIUDAD = 'http://186.158.152.141:3002/automot/api/ciudad/';

function TableModel({ token, form, data, mergedColumns, keyExtraido }) {

  //Celdas editables
  const EditableCell = ({ editing, dataIndex, title, inputType, record, index, children, ...restProps }) => {
    //console.log('edit',record);

    const [previewImage, setPreviewImage] = useState('');
    const [proveedores, setProveedores] = useState([]);
    const [marca, setMarca] = useState([]);
    const [ciudades, setCiudades] = useState([]);

    useEffect(() => {
      getProveedor();
      getCiudad();
      getMarca();
      // eslint-disable-next-line
    }, []);

    //CONFIGURACION DE TOKEN
    const config = {
      headers: {
        "Authorization": `Bearer ${token}`,
      }
    };

    const getProveedor = async () => {
      const res = await axios.get(`${URIPROV}/get`, config);
      setProveedores(res.data.body);
    }

    const getMarca = async () => {
      const res = await axios.get(`${URIMARCA}/get`, config);
      setMarca(res.data.body);
    }

    const getCiudad = async () => {
      const res = await axios.get(`${URICIUDAD}/get`, config);
      setCiudades(res.data.body);
    }

    const inputNode = inputType === 'number' ? <InputNumber /> : <Input />;

    switch (dataIndex) {
      case 'estado':
        return (
          <td {...restProps}>
            {
              editing ? (
                <Form.Item name={dataIndex} style={{ margin: 0, }} rules={[{ required: true, message: `Por favor complete ${title}!`, },]} >
                  <Select allowClear > <Option value="AC">Activo</Option> <Option value="IN">Inactivo</Option> </Select>
                </Form.Item>
              ) : (children)
            }
          </td>);
      case 'tipo_cli':
        return (
          <td {...restProps}>
            {
              editing ? (
                <Form.Item name={dataIndex} style={{ margin: 0, }} rules={[{ required: true, message: `Por favor complete ${title}!`, },]} >
                  <Select allowClear > <Option value="F">Fisico</Option> <Option value="J">Juridico</Option> </Select>
                </Form.Item>
              ) : (children)
            }
          </td>);
      case 'sexo':
            return (
              <td {...restProps}>
                {
                  editing ? (
                    <Form.Item name={dataIndex} style={{ margin: 0, }} rules={[{ required: true, message: `Por favor complete ${title}!`, },]} >
                      <Select allowClear > <Option value="MA">Masculino</Option> <Option value="FE">Femenino</Option> </Select>
                    </Form.Item>
                  ) : (children)
                }
              </td>);
      //break;
      //Proveedor
      case 'idproveedor':
        return (
          <td {...restProps}>
            {
              editing ?
                <Buscador label={'razon_social'} value={'idproveedor'} data={proveedores} dataIndex={dataIndex} title={title} />
                : (children)
            }
          </td>);
      //Marca
      case 'idmarca':
        return (
          <td {...restProps}>
            {
              editing ?
                <Buscador  label={'descripcion'} value={'idmarca'} data={marca} dataIndex={dataIndex} title={title} />
                : (children)
            }
          </td>);
      //Modelo
      case 'idmodelo':
        return (
          <td {...restProps}>
            {
              editing ?
                <Buscador label={'descripcion'} value={'idmodelo'} data={marca} dataIndex={dataIndex} title={title} />
                : (children)
            }
          </td>);
      //Ciudad
      case 'idciudad':
        return (
          <td {...restProps}>
            {
              editing ?
                <Buscador label={'descripcion'} value={'idciudad'} data={ciudades} dataIndex={dataIndex} title={title} />
                : (children)
            }
          </td>);
      case 'img':
        return (
          <td {...restProps}>
            {
              //
              editing ?
                <Form.Item name={dataIndex} style={{ margin: 0, }}  >
                  <UploadFile previewImage={previewImage} setPreviewImage={setPreviewImage} >

                    { //Aqui la logica de si actualiza o no las imagenes del formulario
                      (previewImage !== '' && previewImage != null) ?
                        record.img = previewImage :
                        record.img ?
                          record.img = Buffer.from(record.img).toString('ascii') :
                          null}

                  </UploadFile>
                </Form.Item>
                : (children)
            }
          </td>);

case 'img1':
  return (
    <td {...restProps}>
      {
        //
        editing ?
          <Form.Item name={dataIndex} style={{ margin: 0, }}  >
            <UploadFile previewImage={previewImage} setPreviewImage={setPreviewImage} >

              { //Aqui la logica de si actualiza o no las imagenes del formulario
                (previewImage !== '' && previewImage != null) ?
                  record.img1 = previewImage :
                  record.img1 ?
                    record.img1 = Buffer.from(record.img1).toString('ascii') :
                    null}

            </UploadFile>
          </Form.Item>
          : (children)
      }
    </td>);
    case 'img2':
      return (
        <td {...restProps}>
          {
            //
            editing ?
              <Form.Item name={dataIndex} style={{ margin: 0, }}  >
                <UploadFile previewImage={previewImage} setPreviewImage={setPreviewImage} >

                  { //Aqui la logica de si actualiza o no las imagenes del formulario
                    (previewImage !== '' && previewImage != null) ?
                      record.img2 = previewImage :
                      record.img2 ?
                        record.img2 = Buffer.from(record.img2).toString('ascii') :
                        null}

                </UploadFile>
              </Form.Item>
              : (children)
          }
        </td>);
      //break;
      default:
        return (
          <td {...restProps}>
            {
              editing ? (
                <Form.Item name={dataIndex} style={{ margin: 0, }} rules={[{ required: true, message: `Por favor complete ${title}!`, },]} >
                  {inputNode}
                </Form.Item>
              ) : (children)
            }
          </td>);
    }
  };

  return (
    <>
      {
        data ? <Form form={form} component={false}>
          <Table
            rowKey={keyExtraido}
            components={{
              body: {
                cell: EditableCell,
              },
            }}
            bordered
            dataSource={data}
            columns={mergedColumns}
            rowClassName="editable-row"
            scroll={{
              x: 'calc(600px + 80%)',
              y: 300,
            }}

          //pagination={{onChange: setCantidadRow,pageSize: 50,}}
          />
        </Form> :
          <section style={{ textAlign: `center`, margin: `10px` }}>
            <Spin />
          </section>
      }
    </>
  );
};
export default TableModel;