import React, { useContext, useEffect, useState } from "react";
import { Col, Container, Nav, Navbar, NavDropdown, Row } from "react-bootstrap";
import toast from "react-hot-toast";
import { db } from "../../API/firebase";
import { ApiContext, DataContext } from "../../App";
import SaveBtn from "../../Components/Buttons/SaveBtn/SaveBtn";
import Table2 from "../../Components/Tables/Table2/Table2";
import Add from "../../Modals/Add/Add";
import Update from "../../Modals/Update/Update";
import styles from "./Alerts.module.css";

const Alerts = () => {
  const [header, setHeader] = useContext(ApiContext);
  const [info, setInfo] = useContext(DataContext);
  const [addState, setAddState] = useState(false);
  const [editState, setEditState] = useState(false);
  const [allAlerts, setAllAlerts] = useState([]);

  useEffect(() => {
    const unsubscribe = db.collection("alerts").onSnapshot((querySnapshot) => {
      const alertList = querySnapshot.docs.map((doc) => ({
        name: doc.data().name,
        bg: doc.data().bg,
        border: doc.data().border,
        id: doc.id,
      }));
      setAllAlerts(alertList.sort((a, b) => a.name.localeCompare(b.name)));
    });
    return () => unsubscribe(); // Cleanup the listener on unmount
  }, []);

  const toggleModalAdd = () => setAddState((prevState) => !prevState);
  const toggleModalEdit = () => setEditState((prevState) => !prevState);

  const handleAddData = () => {
    setInfo({
      method: "add",
      type: "alert",
      collection: "alerts",
      onOpenModal: toggleModalAdd,
    });
  };

  const handleUpdateData = (list) => {
    setInfo({
      method: "update",
      type: "alert",
      collection: "alerts",
      id: list.id,
      onOpenModal: toggleModalEdit,
    });
  };

  const countSelected = async (value) => {
    const alertRef = db.collection("counterAlert").doc("yb9ciS93fi2rkrwTWnfm");
    await alertRef.set({ value });
    toast.success(`${value} added`);
  };

  return (
    <Container id={styles.alertsContainer} fluid>
      <Navbar variant="light" bg="light" expand="lg">
        <Container fluid>
          <Navbar.Toggle aria-controls="navbar-dark-example" />
          <Navbar.Collapse id="navbar-dark-example">
            <Nav className="w-100 d-flex justify-content-between">
              <NavDropdown
                id="nav-dropdown-dark-example"
                title="Select for count"
                menuVariant="dark"
                className="w-100"
              >
                {allAlerts.map((alert) => (
                  <NavDropdown.Item
                    key={alert.id}
                    onClick={() => countSelected(alert.name)}
                  >
                    {alert.name}
                  </NavDropdown.Item>
                ))}
              </NavDropdown>
              <SaveBtn handleClick={handleAddData} name="Add new" />
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Row
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "85vh" }}
      >
        <Col
          md={12}
          className="d-flex justify-content-center align-items-center"
        >
          <div className={styles.alertContainer}>
            <Table2 items={allAlerts} handleUpdateData={handleUpdateData} />
          </div>
        </Col>
      </Row>
      <Add />
      <Update />
    </Container>
  );
};

export default Alerts;
