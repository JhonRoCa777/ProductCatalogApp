import { useState } from "react";
import { Modal, Button, Form, Spinner } from "react-bootstrap";
import { FaPlusCircle } from "react-icons/fa";
import styles from "./index.module.css";
import { IProduct } from "@/models";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";

export const CreateProduct = ({handleReload}:{handleReload: ()=>void}) => {

  const API_URL = import.meta.env.VITE_API_URL;

  const [loading, setLoading] = useState(false);

  const [show, setShow] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm<IProduct>({
    defaultValues: {
        name: "",
        description: "",
        price: 0,
        stock: 0
    }
  });

  const handleShow = () => setShow(true);

  const handleClose = () => {
    setShow(false);
    reset();
  };

  const onSubmit = async (product: IProduct) => {

    setLoading(true);

    try
    {
        await fetch(API_URL + "/Product", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(product),
        });

        Swal.fire({
            title: "¡Finalizado!",
            text: "El producto se agregó correctamente.",
            icon: "success",
            confirmButtonColor: "#3085d6",
            confirmButtonText: "OK",
        });

        handleReload();

        handleClose();
    }
    catch(error)
    {
        Swal.fire("Error", "No se pudo crear el producto", "error");
    }
    finally
    {
        setLoading(false);
    }
  };

  return (
    <>
        <Button variant="success" onClick={handleShow}>
            <div className={`${styles.flexDistance}`}>
                NUEVO <FaPlusCircle/>
            </div>
        </Button>

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
