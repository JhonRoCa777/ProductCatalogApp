import { IProduct } from "@/models";
import { useEffect, useState } from "react";
import { Button, Form, Table } from "react-bootstrap";
import styles from "./index.module.css";
import { CreateProduct } from "@/components";
import { FaTrashAlt } from "react-icons/fa";
import Swal from "sweetalert2";
import { EditProduct } from "../EditProduct";
import { DetailProduct } from "../DetailProduct";

export function IndexProduct() {

    const API_URL = import.meta.env.VITE_API_URL;

    const [products, setProducts] = useState<IProduct[]>([]);
    const [loading, setLoading] = useState(true);

    const [filterText, setFilterText] = useState("");

    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(filterText.toLowerCase()) ||
        product.description.toLowerCase().includes(filterText.toLowerCase())
    );

    const deleteProduct = async (ProductID: number) => {
      
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
            await fetch(`${API_URL}/Product/${ProductID}`, {
              method: "DELETE",
            });
      
            Swal.fire("¡Eliminado!", "El producto ha sido eliminado.", "success");
      
            handleReload();
          }
          catch (error) {
            Swal.fire("Error", "No se pudo eliminar el producto", "error");
          }
        }
    }

    const handleReload = async () => {

        setLoading(true);

        try
        {
            var response = await fetch(API_URL + "/Product");
            var data = await response.json();

            setProducts(data);
        }
        catch (error)
        {
            Swal.fire("Error", "No se pudo cargar los productos", "error");
        }
        finally
        {
            setLoading(false);
        }
    }
  
    useEffect(() => {
      handleReload();
    }, []);


  if (loading) return <p>Cargando productos...</p>;

    return (
    <>
        <div className={`${styles.flexSearch} mb-3 mt-3`}>
            
            <div className={`${styles.flexDistance}`}>
                <h2> Productos </h2>
                <CreateProduct handleReload={handleReload}/>
            </div>

            <div style={{"width": "50%"}}>
                <Form.Control
                    type="text"
                    placeholder="Buscar producto..."
                    className="mb-3"
                    value={filterText}
                    onChange={(e) => setFilterText(e.target.value)}
                />
            </div>

        </div>
        
        <Table striped bordered>
            <thead>
                <tr>
                    <th>Nombre</th>
                    <th>Descripción</th>
                    <th>Precio</th>
                    <th>Stock</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                {filteredProducts.map((product, key) => (
                <tr key={key}>
                    <td>{product.name}</td>
                    <td>{product.description}</td>
                    <td>${product.price}</td>
                    <td>{product.stock}</td>
                    <td>
                        <div className={`${styles.flexDistance}`}>
                            <EditProduct key={key} handleReload={handleReload} product={product}/>
                            <DetailProduct Product={product}/>
                            <Button variant="danger" onClick={() => deleteProduct(product.id)}><FaTrashAlt/></Button>
                        </div>
                    </td>
                </tr>
                ))}
            </tbody>
        </Table>
    </>
    );
}