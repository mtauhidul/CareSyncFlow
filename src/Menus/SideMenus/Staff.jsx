import React, { useContext, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { Link, Route, Switch, useRouteMatch } from "react-router-dom";
import { DataContext } from "../../App";
import SaveBtn from "../../Components/Buttons/SaveBtn/SaveBtn";
import Add from "../../Modals/Add/Add";
import Assistants from "../TabMenus/Assistants";
import Receptionists from "../TabMenus/Receptionists";
import Doctors from "./Doctors";
import styles from "./Staff.module.css";

const Staff = () => {
  const { path } = useRouteMatch();
  const [info, setInfo] = useContext(DataContext);
  const [open, setOpen] = useState(null);

  const onOpenModal = () => setOpen(true);

  const handleAddData = (type, collection) => {
    setInfo({
      method: "add",
      type,
      collection,
      onOpenModal,
    });
  };

  return (
    <Container fluid className={styles.Staff_container}>
      <Row className={styles.Staff_wrapper}>
        <Col md={8} xs={12} style={{ maxWidth: "510px" }}>
          <ul className={styles.tabLinks}>
            <li>
              <Link to={`${path}/doctors`}>Doctors</Link>
            </li>
            <li>
              <Link to={`${path}/assistants`}>Assistants</Link>
            </li>
            <li>
              <Link to={`${path}/receptionists`}>Receptionists</Link>
            </li>
          </ul>
        </Col>
        <Col md={4} xs={12} className={styles.button_wrapper}>
          <Switch>
            <Route path={`${path}/doctors`}>
              <SaveBtn
                handleClick={() => handleAddData("doctor", "dashboard")}
                name="Add new"
              />
            </Route>
            <Route path={`${path}/assistants`}>
              <SaveBtn
                handleClick={() => handleAddData("assistant", "assistants")}
                name="Add new"
              />
            </Route>
            <Route path={`${path}/receptionists`}>
              <SaveBtn
                handleClick={() =>
                  handleAddData("receptionist", "receptionists")
                }
                name="Add new"
              />
            </Route>
          </Switch>
        </Col>
      </Row>
      <br />
      <Row>
        <Col md={12} xs={12}>
          <Switch>
            <Route path={`${path}/doctors`}>
              <Doctors />
            </Route>
            <Route path={`${path}/assistants`}>
              <Assistants />
            </Route>
            <Route path={`${path}/receptionists`}>
              <Receptionists />
            </Route>
          </Switch>
        </Col>
      </Row>
      <Add />
    </Container>
  );
};

export default Staff;
