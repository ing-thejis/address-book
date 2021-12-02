import axios from "axios";
import React, { useEffect, useState } from "react";
import { Button, Card, Col, Form, Image, Modal, Row } from "react-bootstrap";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { styles } from "./styles/Contacts";

const baseURL = "https://618aac0d34b4f400177c480e.mockapi.io/api/v1/contactos/";

const myStore = window.localStorage;

const Contacts = (props) => {
  console.log(myStore);
  const [contactData, setContactData] = useState([]);

  const [modalInsert, setModalInsert] = useState(false);
  const [modalUpdate, setModalUpdate] = useState(false);
  const [modalDelete, setModalDelete] = useState(false);

  const [contactSelect, setContactSelect] = useState({
    id: "",
    nombre: "",
    apellido: "",
    telefono: "",
    direccion: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setContactSelect((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const OpenCloseModal = (type) => {
    switch (type) {
      case "INSERT":
        setModalInsert(!modalInsert);
        break;
      case "UPDATE":
        setModalUpdate(!modalUpdate);
        break;
      case "DELETE":
        setModalDelete(!modalDelete);
        break;
      default:
        break;
    }
  };

  const requestGET = async () => {
    await axios
      .get(baseURL)
      .then((response) => {
        setContactData(response.data);
        console.log(contactData);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const requestPOST = async () => {
    await axios.post(baseURL, contactSelect).then((response) => {
      setContactData(contactData.concat(response.data));
      OpenCloseModal("INSERT");
    });
    console.log(contactSelect);
  };

  const requestPUT = async () => {
    await axios
      .put(baseURL + contactSelect.id, contactSelect)
      .then((response) => {
        var newContactData = contactData;
        newContactData.map((contact) => {
          if (contactSelect.id === contact.id) {
            contact.nombre = contactSelect.nombre;
            contact.apellido = contactSelect.apellido;
            contact.telefono = contactSelect.telefono;
            contact.direccion = contactSelect.direccion;
          }
          return 0;
        });
        setContactData(newContactData);
        console.log(
          myStore.setItem("contacts", JSON.stringify(newContactData))
        );
        OpenCloseModal("UPDATE");
      });
  };

  const requestDEL = async () => {
    await axios.delete(baseURL + contactSelect.id).then((response) => {
      setContactData(
        contactData.filter((contact) => contact.id !== contactSelect.id)
      );
      myStore.removeItem("contact");
      OpenCloseModal("DELETE");
    });
  };

  const selectContact = (contact, typeCase) => {
    setContactSelect(contact);
    switch (typeCase) {
      case "Update":
        setModalUpdate(true);
        break;
      case "Delete":
        setModalDelete(true);
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    requestGET();
  }, []);

  const bodyInsert = (
    <div style={styles.modal}>
      <div style={{ padding: "10px" }}><b>Agregar un nuevo contacto</b></div>
      <form>
        <Form.Group className="mb-3" controlId="formGroupName">
          <Form.Control
            name="nombre"
            type="text"
            placeholder="Nombres"
            onChange={handleChange}
            value={contactData.name}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formGroupLastName">
          
          <Form.Control
            name="apellido"
            type="text"
            placeholder="Apellidos"
            onChange={handleChange}
            value={contactData.surname}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formGroupTel">
          
          <Form.Control
            name="telefono"
            type="text"
            placeholder="Telefono"
            onChange={handleChange}
            value={contactData.phone}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formGroupAddress">
          
          <Form.Control
            name="direccion"
            type="text"
            placeholder="Dirección"
            onChange={handleChange}
            value={contactData.address}
          />
        </Form.Group>
        <div className="d-flex justify-content-center">
          <button type="button" className="btn btn-success mx-3 w-50" onClick={() => requestPOST()}>
            Crear
          </button>
          <button type="button" className="btn btn-danger mx-3 w-50" onClick={() => OpenCloseModal("INSERT")}>
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );

  const bodyUpdate = (
    <div style={styles.modal}>
      <div>Editar contacto {contactSelect.id}</div>
      <Form>
        <Form.Group className="mb-3" controlId="formGroupName">
          <Form.Label style={styles.label}>Nombres</Form.Label>
          <Form.Control
            name="nombre"
            type="text"
            placeholder="Nombres"
            onChange={handleChange}
            value={contactSelect && contactData.name}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formGroupLastName">
          <Form.Label style={styles.label}>Apellido</Form.Label>
          <Form.Control
            name="apellido"
            type="text"
            placeholder="Apellidos"
            onChange={handleChange}
            value={contactSelect && contactData.surname}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formGroupTel">
          <Form.Label style={styles.label}>Teléfono</Form.Label>
          <Form.Control
            name="telefono"
            type="text"
            placeholder="Telefono"
            onChange={handleChange}
            value={contactSelect && contactData.phone}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formGroupAddress">
          <Form.Label style={styles.label}>Dirección</Form.Label>
          <Form.Control
            name="direccion"
            type="text"
            placeholder="Dirección"
            onChange={handleChange}
            value={contactSelect && contactData.address}
          />
        </Form.Group>
        <div style={styles.buttonGroup}>
          <Button style={styles.btnEdit} onClick={() => requestPUT()}>
            Editar
          </Button>
          <Button
            style={styles.btnClose}
            onClick={() => OpenCloseModal("UPDATE")}
          >
            Cancelar
          </Button>
        </div>
      </Form>
    </div>
  );

  const bodyDelete = (
    <div style={styles.modalDel}>
      <p>
        Esta seguro que quiere eliminar el contacto{" "}
        <b>{contactSelect && contactSelect.nombre}</b> ?
      </p>

      <div className="d-flex justify-content-center">
        <button type="button" className="btn btn-success mx-3" onClick={() => requestDEL()}>
          Aceptar
        </button>
        <button type="button" className="btn btn-danger mx-3" onClick={() => OpenCloseModal("DELETE")}>
          Cancelar
        </button>
      </div>
    </div>
  );

  return (
    <div className="container w-50">
      <button
        className="btn btn-primary btn-lg my-3"
        type="button"
        onClick={() => OpenCloseModal("INSERT")}
      >
        Agregar Nuevo Contacto
      </button>

      <div>
        {contactData.map((contact) => (
          <div
            key={contactData.id}
            className="card border border-primary my-4 rounded"
          >
            <div className="card-body row">
              <div className="col-md-4 d-flex justify-content-center align-items-center flex-column">
                <img
                  className="rounded img-thumbnail w-75"
                  alt="avatar"
                  src="https://png.pngtree.com/png-vector/20190625/ourlarge/pngtree-business-male-user-avatar-vector-png-image_1511454.jpg"
                />
                <div >
                  <button
                    className="btn btn-primary w-50"
                    onClick={() => selectContact(contact, "Update")}
                  >
                    <FaEdit />
                  </button>
                  <button
                    className="btn btn-danger w-50"
                    onClick={() => selectContact(contact, "Delete")}
                  >
                    <MdDelete />
                  </button>
                </div>
              </div>
              <div className="col-md-8">
                <div className="card-text">
                  <ul className="list-group">
                    <li className="list-group-item">
                      <b>nombres:</b> {contact.nombre}
                    </li>
                    <li className="list-group-item">
                      <b>apellidos:</b> {contact.apellido}
                    </li>
                    <li className="list-group-item">
                      <b>telefono:</b>
                      {contact.telefono}
                    </li>
                    <li className="list-group-item">
                      <b>direccion:</b>
                      {contact.direccion}
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Modal show={modalInsert} onHide={() => OpenCloseModal("INSERT")}>
        {bodyInsert}
      </Modal>
      <Modal show={modalUpdate} onHide={() => OpenCloseModal("UPDATE")}>
        {bodyUpdate}
      </Modal>
      <Modal show={modalDelete} onHide={() => OpenCloseModal("DELETE")}>
        {bodyDelete}
      </Modal>
    </div>
  );
};

export default Contacts;
