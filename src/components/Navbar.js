import React from "react";
import { styles } from "./styles/Navbar";

const Navbar = () => {
  return (
    <div className="container-fluid" style={styles.container}>
      <div className="row">
        <h1>LIBRETA DE CONTACTOS</h1>
      </div>
    </div>
  );
};

export default Navbar;
