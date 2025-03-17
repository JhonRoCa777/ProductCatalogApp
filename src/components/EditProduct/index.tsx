import { useEffect, useState } from "react";
import { Modal, Button, Form, Spinner } from "react-bootstrap";
import { FaPencilAlt } from "react-icons/fa";
import styles from "./index.module.css";
import { IProduct } from "@/models";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";

export const EditProduct = (
    {handleReload, product}:
    {handleReload: ()=>void, product: IProduct}) => {

  const API_URL = import.meta.env.VITE_API_URL;

  const [loading, setLoading] = useState(false);

  const [show, setShow] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm<IProduct>({
    defaultValues: product
  });

  const handleShow = () => setShow(true);

  const handleClose = () => {
    setShow(false);
    reset();
  };

  const onSubmit = async (myProduct: IProduct) => {

    setLoading(true);

    try
    {
        await fetch(`${API_URL}/Product/${product.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(myProduct),
        });
  
        Swal.fire("¡Actualizado!", "El producto se actualizó correctamente.", "success");
        handleReload();
        handleClose();
    }
    catch (error)
    {
        Swal.fire("Error", "No se pudo actualizar el producto", "error");
    }
    finally
    {
        setLoading(false);
    }
  };

  useEffect(() => {
    reset(product);
  }, [product, reset]);

  return (
    <>
        <Button variant="warning" onClick={handleShow}><FaPencilAlt/></Button>

        <Modal show={show} onHide={handleClose} centered>
            <Modal.Body>
                <Form onSubmit={handleSubmit(onSubmit)}>
                    {/* Nombre */}
                    <Form.Group className="mb-3">
                    <Form.Label>Nombre</Form.Label>
                    <Form.Control
                        type="text"
                        {...register("name", { required: "Campo Obligatorio", maxLength: {value: 100, message: "Máximo 100 caracteres"} })}
                    />
                    {errors.name && <p className="text-danger">{errors.name.message}</p>}
                    </Form.Group>

                    {/* Descripción */}
                    <Form.Group className="mb-3">
                    <Form.Label>Descripción</Form.Label>
                    <Form.Control
                        as="textarea"
                        rows={3}
                        {...register("description", { required: "Campo Obligatorio", maxLength: {value: 255, message: "Máximo 255 caracteres"} })}
                    />
                    {errors.description && <p className="text-danger">{errors.description.message}</p>}
                    </Form.Group>

                    {/* Precio */}
                    <Form.Group className="mb-3">
                    <Form.Label>Precio</Form.Label>
                    <Form.Control
                        type="number"
                        step="0.1"
                        {...register("price", { required: "Campo Obligatorio", min: {value: 0, message: "Mínimo 0"} })}
                    />
                    {errors.price && <p className="text-danger">{errors.price.message}</p>}
                    </Form.Group>

                    {/* Stock */}
                    <Form.Group className="mb-3">
                    <Form.Label>Stock</Form.Label>
                    <Form.Control
                        type="number"
                        {...register("stock", { required: "Campo Obligatorio", min: {value: 0, message: "Mínimo 0"} })}
                    />
                    {errors.stock && <p className="text-danger">{errors.stock.message}</p>}
                    </Form.Group>

                    <div className={`${styles.flexDistance}`}>
                        <Button variant="secondary" onClick={handleClose}>
                            Cancelar
                        </Button>
                        <Button variant="success" type="submit">
                            {(loading) ? <Spinner size="sm"/> : "Guardar"}
                        </Button>
                    </div>
                </Form>
            </Modal.Body>
        </Modal>
    </>
  );
};
