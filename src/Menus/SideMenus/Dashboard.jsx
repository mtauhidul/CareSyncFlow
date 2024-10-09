import React, { useCallback, useContext, useEffect, useState } from "react";
import { CardDeck, Col, Container, Row } from "react-bootstrap";
import toast from "react-hot-toast";
import { addDashData, countUpdate } from "../../API/Api";
import { db } from "../../API/firebase";
import { GlobalContext, ModalContext } from "../../App";
import ResetBtn from "../../Components/Buttons/ResetBtn/ResetBtn";
import StopBtn from "../../Components/Buttons/StopBtn/StopBtn";
import DashCard from "../../Components/Cards/DashCard/DashCard";
import App from "../../Modals/ModalComponent/App";
import styles from "./Dashboard.module.css";

const Dashboard = () => {
  const [mod, setMod] = useContext(ModalContext);
  const [globalData, updateGlobalData] = useContext(GlobalContext);
  const [data, setData] = useState([]);

  useEffect(() => {
    const unsubscribe = db
      .collection("dashboard")
      .onSnapshot((querySnapshot) => {
        const drList = querySnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        setData(drList);
      });

    return () => unsubscribe(); // Unsubscribe from the snapshot listener on unmount
  }, []);

  const onOpenModal = useCallback(
    () => setMod({ onOpenModal: true }),
    [setMod]
  );

  const reset = useCallback((doc) => {
    const emptyRooms = doc.rooms.map((room) => ({
      ...room,
      alert: "",
      bg: "",
      border: "",
      blink: false,
      activityType: "",
    }));

    addDashData({
      dr: {
        dr: doc.dr,
        email: doc.email,
        phone: doc.phone,
        count: doc.count,
        id: doc.id,
      },
      rooms: emptyRooms,
    });
  }, []);

  const countUp = useCallback((doc) => {
    countUpdate({
      id: doc.id,
      value: doc.count.length + 1,
    });
  }, []);

  const countDown = useCallback((doc) => {
    if (doc.count.length === 0) {
      toast.error("Patients can't be less than zero");
    } else {
      countUpdate({
        id: doc.id,
        value: doc.count.length - 1,
      });
    }
  }, []);

  return (
    <Container fluid id={styles.dashboard}>
      {data.map((doc, index) => (
        <Row key={index} className={styles.drDeck}>
          <Col md={3} className={styles.drArea}>
            <div className={styles.drAreaWrapper}>
              <div className={styles.drAreaTop}>
                <ResetBtn handleClick={() => reset(doc)} />
              </div>
              <div className={styles.drAreaTitle}>
                <h1>{doc.id}</h1>
                <p>{doc.role}</p>
              </div>
              <div className={styles.drAreaBottom}>
                <StopBtn handleClick={() => countUp(doc)} sign="Add" />
                <p
                  style={{
                    color: "#FC7E55",
                    fontWeight: "bold",
                    fontSize: "30px",
                    margin: "-9px 10px 10px 10px",
                  }}
                >
                  {doc?.count?.length}
                </p>
                <StopBtn handleClick={() => countDown(doc)} sign="Remove" />
              </div>
            </div>
          </Col>
          <Col md={9} sm={8} className={styles.dropBoxParent}>
            <CardDeck id={styles.DropBox}>
              {doc.rooms?.map((room, idx) => (
                <DashCard
                  key={room.id}
                  handler={() =>
                    updateGlobalData({
                      ...globalData,
                      count: doc.count,
                      arrIndex: idx,
                      docId: doc.id,
                    })
                  }
                  docId={doc.id}
                  idx={idx}
                  room={room}
                  data={doc}
                  openAlertModal={onOpenModal}
                  waiting={doc.count}
                  countDown={() => countDown(doc)}
                />
              ))}
            </CardDeck>
          </Col>
        </Row>
      ))}
      <App />
    </Container>
  );
};

export default Dashboard;
