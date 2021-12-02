import axios from "axios";
import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";

const baseURL = "https://618aac0d34b4f400177c480e.mockapi.io/api/v1/contactos/";
const myStore = window.localStorage;


const Contacts = (props) => {
  console.log(myStore);
  const [contactData, setContactData] = useState([]);

  const [modalInsert, setModalInsert] = useState(false);
  const [modalUpdate, setModalUpdate] = useState(false);
  const [modalDelete, setModalDelete] = useState(false);

  const [contactSelected, setContactSelected] = useState({
    id: "",
    nombre: "",
    apellido: "",
    telefono: "",
    direccion: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setContactSelected((prevState) => ({
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
    await axios.post(baseURL, contactSelected).then((response) => {
      setContactData(contactData.concat(response.data));
      OpenCloseModal("INSERT");
    });
    console.log(contactSelected);
  };

  const requestPUT = async () => {
    await axios
      .put(baseURL + contactSelected.id, contactSelected)
      .then((response) => {
        var newContactData = contactData;
        newContactData.map((contact) => {
          if (contactSelected.id === contact.id) {
            contact.nombre = contactSelected.nombre;
            contact.apellido = contactSelected.apellido;
            contact.telefono = contactSelected.telefono;
            contact.direccion = contactSelected.direccion;
          }
          return contactSelected;
        });
        setContactData(newContactData);
        console.log(
          myStore.setItem("contacts", JSON.stringify(newContactData))
        );
        OpenCloseModal("UPDATE");
      });
  };

  const requestDEL = async () => {
    await axios.delete(baseURL + contactSelected.id).then((response) => {
      setContactData(
        contactData.filter((contact) => contact.id !== contactSelected.id)
      );
      myStore.removeItem("contact");
      OpenCloseModal("DELETE");
    });
  };

  const selectContact = (contact, typeCase) => {
    setContactSelected(contact);
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
    <div className="d-flex justify-content-center align-items-center flex-column py-4">
      <div style={{ padding: "10px" }}><b>Agregar un nuevo contacto</b></div>
      <form>
        <div className="form-group mb-3" controlId="formGroupName">
          <input className="form-control"
            name="nombre"
            type="text"
            placeholder="Nombres"
            onChange={handleChange}
            value={contactData.name}
          />
        </div >
        <div  className="form-group mb-3" controlId="formGroupLastName">
          <input className="form-control"
            name="apellido"
            type="text"
            placeholder="Apellidos"
            onChange={handleChange}
            value={contactData.surname}
          />
        </div >
        <div  className="form-group mb-3" controlId="formGroupTel">
          <input className="form-control"
            name="telefono"
            type="text"
            placeholder="Telefono"
            onChange={handleChange}
            value={contactData.phone}
          />
        </div >
        <div className="form-group mb-3" controlId="formGroupAddress">
          <input className="form-control"
            name="direccion"
            type="text"
            placeholder="Dirección"
            onChange={handleChange}
            value={contactData.address}
          />
        </div >
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
    <div className="d-flex justify-content-center align-items-center flex-column py-4">
      <div className="text-uppercase mb-4"><b>Editar contacto {contactSelected.id}</b></div>
      <form>
        <div className="form-group mb-3" controlId="formGroupName">
          <input className="form-control"
            name="nombre"
            type="text"
            placeholder="Nombres"
            onChange={handleChange}
            value={contactSelected && contactSelected.nombre}
          />
        </div>
        <div className="form-group mb-3" controlId="formGroupLastName">
          <input className="form-control"
            name="apellido"
            type="text"
            placeholder="Apellidos"
            onChange={handleChange}
            value={contactSelected && contactSelected.apellido}
          />
        </div>
        <div className="form-group mb-3" controlId="formGroupTel">
          <input className="form-control"
            name="telefono"
            type="text"
            placeholder="Telefono"
            onChange={handleChange}
            value={contactSelected && contactSelected.telefono}
          />
        </div>
        <div className="form-group mb-3" controlId="formGroupAddress">
          <input className="form-control"
            name="direccion"
            type="text"
            placeholder="Dirección"
            onChange={handleChange}
            value={contactSelected && contactSelected.direccion}
          />
        </div>
        <div className="d-flex justify-content-center">
          <button type="button" className="btn btn-success mx-3 w-50" onClick={() => requestPUT()}>
            Editar
          </button>
          <button type="button" className="btn btn-danger mx-3 w-50" onClick={() => OpenCloseModal("UPDATE")} >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );

  const bodyDelete = (
    <div className="p-4">
      <p>
        Esta seguro que quiere eliminar el contacto{" "}
        <b>{contactSelected && contactSelected.nombre}</b> ?
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
                      <b>telefono:</b> {contact.telefono}
                    </li>
                    <li className="list-group-item">
                      <b>direccion:</b> {contact.direccion}
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
