import React, { useContext, useEffect, useState } from "react";
import { Card, CardDeck, Col, Container, Row } from "react-bootstrap";
import { ErrorBoundary } from "react-error-boundary";
import toast from "react-hot-toast";
import { addDashData } from "../../API/Api";
import { db } from "../../API/firebase";
import { DataContext, GlobalContext, ModalContext } from "../../App";
import AddAlertBtn from "../../Components/Buttons/AddAllertBtn/AddAlertBtn";
import SaveBtn from "../../Components/Buttons/SaveBtn/SaveBtn";
import RoomCard from "../../Components/Cards/RoomCard/RoomCard";
import DroppedRoom from "../../Components/Rooms/DroppedRoom/DroppedRoom";
import ErrorFallback from "../../ErrorFallback";
import Add from "../../Modals/Add/Add";
import Del from "../../Modals/Del/Del";
import Update from "../../Modals/Update/Update";
import styles from "./Sequence.module.css";

const Sequence = () => {
  const [globalData, updateGlobalData] = useContext(GlobalContext);
  const [mod, setMod] = useContext(ModalContext);
  const [info, setInfo] = useContext(DataContext);

  const [roomData, setRoomData] = useState([]);
  const [specificDr, setSpecificDr] = useState({});
  const [rooms, setRooms] = useState([]);
  const [drList, setDrList] = useState([]);

  useEffect(() => {
    const unsubscribe = db
      .collection("dashboard")
      .onSnapshot((querySnapshot) => {
        const drArray = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          name: doc.id,
          email: doc.data().email,
          phone: doc.data().phone,
          count: doc.data().count,
          role: doc.data().role,
          rooms: doc.data().rooms,
          waiting: doc.data().waiting,
        }));
        setDrList(drArray);
      });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchRooms = async () => {
      const roomList = [];
      const snapshot = await db.collection("rooms").get();
      snapshot.forEach((doc) => {
        roomList.push({
          id: doc.id,
          name: doc.data().name,
          alert: "",
          bg: "",
          border: "",
          blink: doc.data().blink,
        });
      });
      setRoomData(roomList);
    };

    fetchRooms();
    updateGlobalData();
  }, [updateGlobalData]);

  const handleAddData = () => {
    setInfo({
      method: "add",
      type: "room",
      collection: "rooms",
      onOpenModal: true,
    });
  };

  const handleDelData = (id) => {
    setInfo({
      method: "del",
      type: "room",
      collection: "rooms",
      id,
      onOpenModal: true,
    });
  };

  const handleUpdateData = (id) => {
    setInfo({
      method: "update",
      type: "room",
      collection: "rooms",
      id,
      onOpenModal: true,
    });
  };

  const updateData = () => {
    addDashData({ dr: specificDr, rooms });
    setRooms([]);
    setSpecificDr({});
    updateGlobalData({});
  };

  const drSelect = (e) => {
    const selectedDr = drList.find((dr) => dr.id === e.target.value);
    setSpecificDr(selectedDr);
    setRooms(selectedDr.rooms || []);
  };

  const selected = (room) => {
    if (rooms.find((rm) => rm.id === room.id)) {
      toast.error("Room already added");
    } else {
      setRooms([...rooms, room]);
    }
  };

  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={() => {
        document.location.reload(true);
      }}
    >
      <Container fluid className={styles.sequenceContainer}>
        <div className={styles.sequenceTop}>
          <label htmlFor="DrSelect">
            Choose a Doctor
            <div className={styles.wrapper}>
              <select
                name="DrSelect"
                id="DrSelect"
                onChange={drSelect}
                className={styles.DrSelect}
              >
                <option value="" />
                {drList.map((dr) => (
                  <option key={dr.id} value={dr.id}>
                    {dr.id}
                  </option>
                ))}
              </select>
            </div>
          </label>
          <div style={{ marginTop: "30px" }}>
            <SaveBtn handleClick={updateData} name="Save" />
          </div>
        </div>

        <Row>
          <Col md={12} className={styles.dropBoxParent}>
            <div id={styles.DropBox}>
              {rooms.map((room, index) => (
                <DroppedRoom
                  room={room}
                  key={index}
                  handleDelData={handleDelData}
                  handleUpdateData={handleUpdateData}
                  specificDr={specificDr}
                  rooms={rooms}
                />
              ))}
            </div>
          </Col>
        </Row>

        <h2>Select rooms to show in the box</h2>
        <CardDeck className={styles.cardDeckContainer}>
          <Card className={styles.createRoom}>
            <AddAlertBtn handleClick={handleAddData} />
            <span>Add a room</span>
          </Card>
          {roomData.map((room, index) => (
            <RoomCard
              room={room}
              key={index}
              handleDelData={handleDelData}
              handleUpdateData={handleUpdateData}
              selected={selected}
              specificDr={specificDr}
              rooms={rooms}
            />
          ))}
        </CardDeck>

        <Add />
        <Del />
        <Update />
      </Container>
    </ErrorBoundary>
  );
};

export default Sequence;
