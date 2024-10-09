import {
  faBell,
  faChartBar,
  faColumns,
  faFileMedical,
  faStethoscope,
  faWaveSquare,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import AppBar from "@material-ui/core/AppBar";
import CssBaseline from "@material-ui/core/CssBaseline";
import Divider from "@material-ui/core/Divider";
import Drawer from "@material-ui/core/Drawer";
import Hidden from "@material-ui/core/Hidden";
import IconButton from "@material-ui/core/IconButton";
import List from "@material-ui/core/List";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import MenuIcon from "@material-ui/icons/Menu";
import React, { useState } from "react";
import {
  Link,
  matchPath,
  Route,
  Switch,
  useHistory,
  useLocation,
  useRouteMatch,
} from "react-router-dom";
import useViewportSizes from "use-viewport-sizes";
import Logo from "../../Assets/workflow.png";
import ModeSwitch from "../../Components/Buttons/ModeSwitch/ModeSwitch";
import SignOutBtn from "../../Components/Buttons/SignOutBtn/SignOutBtn";
import Alerts from "../../Menus/SideMenus/Alerts";
import AssistantDashboard from "../../Menus/SideMenus/AssistantDashboard";
import Dashboard from "../../Menus/SideMenus/Dashboard";
import Doctors from "../../Menus/SideMenus/Doctors";
import Patients from "../../Menus/SideMenus/Patients";
import Reports from "../../Menus/SideMenus/Reports";
import Sequence from "../../Menus/SideMenus/Sequence";
import Staff from "../../Menus/SideMenus/Staff";
import DoctorsSelf from "../../Menus/TabMenus/DoctorsSelf";
import PatientInfo from "../PatientsInfo/PatientInfo";
import styles from "./ControlPanel.module.css";

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  drawer: {
    [theme.breakpoints.up("sm")]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  },
  appBar: {
    [theme.breakpoints.up("sm")]: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth,
    },
  },
  menuButton: {
    marginRight: theme.spacing(1),
    [theme.breakpoints.up("sm")]: {
      display: "none",
    },
  },
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: drawerWidth,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(1),
  },
}));

function ControlPanel({ window }) {
  const [vpWidth] = useViewportSizes();
  const { path, url } = useRouteMatch();
  const location = useLocation(); // Get location using useLocation hook
  const history = useHistory();
  const [mobileOpen, setMobileOpen] = useState(false);

  const classes = useStyles();
  const theme = useTheme();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const onCLickToggle = () => {
    if (vpWidth < 600) {
      handleDrawerToggle();
    }
  };

  const logOut = () => {
    sessionStorage.clear();
    history.push("/");
  };

  const navList = [
    {
      name: "Dashboard",
      url: `${url}/dashboard`,
      icon: faColumns,
    },
    {
      name: "Patients",
      url: `${url}/patients`,
      icon: faFileMedical,
    },
    {
      name: "Reports",
      url: `${url}/reports`,
      icon: faChartBar,
    },
    {
      name: "Roles",
      url: `${url}/Staff/doctors`,
      icon: faStethoscope,
    },
    {
      name: "Status",
      url: `${url}/alerts`,
      icon: faBell,
    },
    {
      name: "Resources",
      url: `${url}/sequence`,
      icon: faWaveSquare,
    },
  ];

  const drawer = (
    <div>
      <div className={classes.toolbar} />
      <Divider />
      <List>
        <div className={styles.sideBar} style={{ width: drawerWidth }}>
          <div className={styles.logo}>
            <img src={Logo} alt="Logo" />
            <h1>
              Care Sync <span>Flow</span>
            </h1>
          </div>
          <div className={styles.nav}>
            <ul className={styles.navList}>
              {navList.map((item) => (
                <li key={item.name} onClick={onCLickToggle}>
                  <Link
                    to={item.url}
                    className={
                      matchPath(location.pathname, {
                        path: item.url,
                        exact: true,
                      }) && styles.active
                    }
                  >
                    <FontAwesomeIcon
                      icon={item.icon}
                      size="1x"
                      className={styles.plusIcon}
                    />

                    <span className={styles.navText}>{item.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className={styles.signOutBtn}>
            <ModeSwitch />
            <SignOutBtn handleClick={logOut} />
          </div>
        </div>
      </List>
    </div>
  );

  const container =
    window !== undefined ? () => window().document.body : undefined;

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar position="fixed" id={styles.appBar} className={classes.appBar}>
        <Toolbar style={{ backgroundColor: "var(--color4)" }}>
          <Typography variant="h6">Care Sync</Typography>
          <IconButton
            style={{ marginLeft: "auto" }}
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            className={classes.menuButton}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <nav className={classes.drawer} aria-label="mailbox folders">
        <Hidden smUp implementation="css">
          <Drawer
            container={container}
            variant="temporary"
            anchor={theme.direction === "rtl" ? "right" : "left"}
            open={mobileOpen}
            onClose={handleDrawerToggle}
            classes={{
              paper: classes.drawerPaper,
            }}
            ModalProps={{
              keepMounted: true,
            }}
          >
            {drawer}
          </Drawer>
        </Hidden>
        <Hidden xsDown implementation="css">
          <Drawer
            classes={{
              paper: classes.drawerPaper,
            }}
            variant="permanent"
            open
          >
            {drawer}
          </Drawer>
        </Hidden>
      </nav>
      <main className={classes.content}>
        <div className={styles.main}>
          <Switch>
            <Route path={`${path}/dashboard`}>
              <Dashboard />
            </Route>
            <Route path={`${path}/assistant-dashboard`}>
              <AssistantDashboard />
            </Route>
            <Route path={`${path}/Staff`}>
              <Staff />
            </Route>
            <Route path={`${path}/alerts`}>
              <Alerts />
            </Route>
            <Route path={`${path}/sequence`}>
              <Sequence />
            </Route>
            <Route path={`${path}/patients`} exact>
              <Patients />
            </Route>
            <Route path={`${path}/patients/:date`} exact>
              <PatientInfo />
            </Route>
            <Route path={`${path}/doctors`}>
              <Doctors />
            </Route>
            <Route path={`${path}/self-sequence`}>
              <DoctorsSelf />
            </Route>
            <Route path={`${path}/reports`}>
              <Reports />
            </Route>
          </Switch>
        </div>
      </main>
    </div>
  );
}

export default ControlPanel;
