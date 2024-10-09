import { faArrowAltCircleLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import CircularProgress from "@material-ui/core/CircularProgress";
import { useContext, useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useHistory } from "react-router";
import { Link } from "react-router-dom";
import { db } from "../../API/firebase";
import { AuthContext, UserContext } from "../../App";
import styles from "./AdminLogin.module.css";

const AdminLogin = () => {
  const [loggedInUser, setLoggedInUser] = useContext(UserContext);
  const [auth, setAuth] = useContext(AuthContext);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const history = useHistory();

  useEffect(() => {
    if (!auth.provider) {
      history.push("/");
    }
  }, [auth.provider, history]);

  const pageRedirect = () => {
    history.push(auth.address || "/admin");
  };

  const onSubmit = async (data) => {
    setLoading(true);
    const ref = db.collection(auth.collection);

    if (auth.provider === "Admin") {
      const adminDoc = await ref.doc("administrator").get();
      if (
        adminDoc.exists &&
        adminDoc.data().email === data.email &&
        adminDoc.data().password === data.password
      ) {
        toast.success("Sign In Successful!");
        sessionStorage.setItem("user", adminDoc.data().email); // Set user in sessionStorage
        setLoggedInUser({ email: adminDoc.data().email }); // Update UserContext
        pageRedirect(); // Redirect to the dashboard
      } else {
        toast.error("Error: Not registered!");
      }
    } else {
      const queryRef = ref.where("email", "==", data.email);
      const res = await queryRef.get();

      if (res.empty) {
        toast.error("Not registered");
      } else {
        toast.success("Successful");
        res.forEach((doc) => {
          sessionStorage.setItem("user", doc.data().email); // Set user in sessionStorage
          setLoggedInUser({ email: doc.data().email }); // Update UserContext
          pageRedirect(); // Redirect to the dashboard
        });
      }
    }
    setLoading(false);
  };

  return (
    <Container fluid className={styles.AdminLoginContainer}>
      <div className={styles.AdminLoginWrapper}>
        <h1>
          <span>{auth.provider}</span> Login
        </h1>
        <form onSubmit={handleSubmit(onSubmit)}>
          <input
            type="text"
            placeholder="Email"
            {...register("email", { required: true })}
          />
          {auth.provider === "Admin" && (
            <input
              type="password"
              placeholder="Password"
              {...register("password", { required: true })}
            />
          )}

          <div className={styles.loadingWrapper}>
            {loading && (
              <div className={styles.loading}>
                <CircularProgress />
              </div>
            )}
            <input
              type="submit"
              disabled={loading}
              className={loading ? styles.disabledSubmit : styles.submit}
            />
          </div>
        </form>
      </div>
      <Link to="/" className={styles.exitBtn} type="button">
        <FontAwesomeIcon
          className={styles.plusIcon}
          icon={faArrowAltCircleLeft}
          size="1x"
        />{" "}
        EXIT
      </Link>
    </Container>
  );
};

export default AdminLogin;
