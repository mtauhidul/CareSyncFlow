/* eslint-disable import/no-cycle */
import { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../App";
import styles from "./Home.module.css";

const Home = () => {
  const [auth, setAuth] = useContext(AuthContext);

  const features = [
    {
      icon: "⚡",
      title: "Real-Time Sync",
      description: "Live updates across all dashboards",
      color: "var(--color10)",
    },
    {
      icon: "🏥",
      title: "Room Management",
      description: "Smart room assignment & tracking",
      color: "var(--color12)",
    },
    {
      icon: "🩺",
      title: "Doctor Matching",
      description: "Patients matched to specialists",
      color: "var(--color21)",
    },
    {
      icon: "🔔",
      title: "Status Alerts",
      description: "Emergency & activity notifications",
      color: "var(--color22)",
    },
  ];

  return (
    <div className={styles.homeContainer}>
      <div className={styles.backgroundGradient}></div>
      <div className={styles.glowEffect}></div>
      <div className={styles.floatingShapes}>
        <div className={styles.shape1}></div>
        <div className={styles.shape2}></div>
        <div className={styles.shape3}></div>
      </div>

      <div className={styles.contentWrapper}>
        <div className={styles.leftSection}>
          <div className={styles.brandSection}>
            <div className={styles.brandBox}>
              <h1>
                Care Sync <span>Flow</span>
              </h1>
            </div>
            <p className={styles.tagline}>
              Real-time hospital workflow management for seamless team
              collaboration
            </p>
          </div>

          <div className={styles.authButtons}>
            <Link to="/admin/dashboard">
              <button
                type="button"
                onClick={() =>
                  setAuth({
                    provider: "Admin",
                    collection: "admin",
                    address: "/admin/dashboard",
                  })
                }
                className={styles.authBtn}
              >
                <span className={styles.btnIcon}>👤</span>
                <span className={styles.btnText}>Admin Portal</span>
              </button>
            </Link>
            <Link to="/receptionist/dashboard">
              <button
                type="button"
                onClick={() =>
                  setAuth({
                    provider: "Receptionist",
                    collection: "receptionists",
                    address: "/receptionist/dashboard",
                  })
                }
                className={styles.authBtn}
              >
                <span className={styles.btnIcon}>📋</span>
                <span className={styles.btnText}>Receptionist Login</span>
              </button>
            </Link>
            <Link to="/doctor/self-sequence">
              <button
                type="button"
                onClick={() =>
                  setAuth({
                    provider: "Doctor",
                    collection: "dashboard",
                    address: "/doctor/self-sequence",
                  })
                }
                className={styles.authBtn}
              >
                <span className={styles.btnIcon}>🩺</span>
                <span className={styles.btnText}>Doctor Access</span>
              </button>
            </Link>
            <Link to="/assistant/dashboard">
              <button
                type="button"
                onClick={() =>
                  setAuth({
                    provider: "Assistant",
                    collection: "assistants",
                    address: "/assistant/assistant-dashboard",
                  })
                }
                className={styles.authBtn}
              >
                <span className={styles.btnIcon}>🤝</span>
                <span className={styles.btnText}>Assistant Login</span>
              </button>
            </Link>
          </div>
        </div>

        <div className={styles.rightSection}>
          <div className={styles.featuresGrid}>
            {features.map((feature, index) => (
              <div key={index} className={styles.featureCard}>
                <div
                  className={styles.featureIcon}
                  style={{ background: feature.color }}
                >
                  {feature.icon}
                </div>
                <div className={styles.featureContent}>
                  <h3>{feature.title}</h3>
                  <p>{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
