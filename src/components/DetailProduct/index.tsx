import { useEffect, useState } from "react";
import { Modal, Button, Form, Spinner, Table } from "react-bootstrap";
import { FaEye, FaTrashAlt } from "react-icons/fa";
import styles from "./index.module.css";
import { IProduct, IProductDetail } from "@/models";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";

export const DetailProduct = ({Product}: {Product: IProduct}) => {

  const API_URL = import.meta.env.VITE_API_URL;

  const [productDetails, setProductDetails] = useState<IProductDetail[]>([]);
  const [loadingTable, setLoadingTable] = useState(false);
  const [loadingForm, setLoadingForm] = useState(false);


  const [show, setShow] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<IProductDetail>({
    defaultValues: {
        type: "",
        info: ""
    }
  });

  const handleShow = () => {setShow(true); reset();}
  const handleClose = () => setShow(false);

  const onSubmit = async (productDetail: IProductDetail) => {

    setLoadingForm(true);

    productDetail.productId = Product.id;

    try
    {
        await fetch(API_URL + "/ProductDetail", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(productDetail),
        });

        Swal.fire({
            title: "¡Finalizado!",
            text: "El detalle del producto se agregó correctamente.",
            icon: "success",
            confirmButtonColor: "#3085d6",
            confirmButtonText: "OK",
        });

        reset();
        handleReload();
    }
    catch(error)
    {
        Swal.fire("Error", "No se pudo crear el detalle del producto", "error");
    }
    finally
    {
        setLoadingForm(false);
    }
  };

  const deleteProductDetail = async (ProductDetailID: number) => {
        
          const result = await Swal.fire({
            title: "¿Estás seguro?",
            text: "No podrás revertir esta acción",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Sí, eliminar",
            cancelButtonText: "Cancelar",
          });
        
          if (result.isConfirmed)
          {
            try
            {
              await fetch(`${API_URL}/ProductDetail/${ProductDetailID}`, {
                method: "DELETE",
              });
        
              Swal.fire("¡Eliminado!", "El detalle del producto ha sido eliminado.", "success");
        
              handleReload();
            }
            catch (error) {
              Swal.fire("Error", "No se pudo eliminar el producto", "error");
            }
          }
    }

    const handleReload = async () => {

        setLoadingTable(true);

        try
        {
            var response = await fetch(API_URL + "/Product/details/" + Product.id);
            var data = await response.json();

            setProductDetails(data);
        }
        catch (error)
        {
            Swal.fire("Error", "No se pudo cargar los detalles del producto", "error");
        }
        finally
        {
            setLoadingTable(false);
        }
    }

    useEffect(() => {
        handleReload();
    }, []);
  
    if (loadingTable) return <Spinner/>;

    return (
    <>
        <Button variant="secondary" onClick={handleShow}><FaEye/></Button>

        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header>
                <h2> {Product.name} </h2>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit(onSubmit)}>
                    {/* Nombre */}
                    <Form.Group className="mb-3">
                    <Form.Label>Nombre</Form.Label>
                    <Form.Control
                        type="text"
                        {...register("type", { required: "Campo Obligatorio", maxLength: {value: 60, message: "Máximo 100 caracteres"} })}
                    />
                    {errors.type && <p className="text-danger">{errors.type.message}</p>}
                    </Form.Group>

                    {/* Descripción */}
                    <Form.Group className="mb-3">
                    <Form.Label>Descripción</Form.Label>
                    <Form.Control
                        type="text"
                        {...register("info", { required: "Campo Obligatorio", maxLength: {value: 255, message: "Máximo 255 caracteres"} })}
                    />
                    {errors.info && <p className="text-danger">{errors.info.message}</p>}
                    </Form.Group>

                    <div className={`${styles.flexDistance}`}>
                        <Button variant="success" type="submit">
                            {(loadingForm) ? <Spinner size="sm"/> : "Crear Detalle"}
                        </Button>
                    </div>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Table striped bordered>
                    <thead>
                        <tr>
                            <th>Tipo</th>
                            <th>Información</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {productDetails.map((productDetail, key) => (
                        <tr key={key}>
                            <td>{productDetail.type}</td>
                            <td>{productDetail.info}</td>
                            <td>
                                <div className={`${styles.flexDistance}`}>
                                    <Button variant="danger" onClick={() => deleteProductDetail(productDetail.id)}><FaTrashAlt/></Button>
                                </div>
                            </td>
                        </tr>
                        ))}
                    </tbody>
                </Table>
            </Modal.Footer>
        </Modal>
    </>
  );
};
