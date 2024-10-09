/* eslint-disable import/no-cycle */
import { createContext, useEffect, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { Toaster } from "react-hot-toast";
import PatientsInformationProvider from "./context/PatientsInformationContext";
import ErrorFallback from "./ErrorFallback";
import MainRouter from "./MainRouter";

// Create Contexts
export const ApiContext = createContext();
export const GlobalContext = createContext();
export const DataContext = createContext();
export const ModalContext = createContext();
export const UserContext = createContext();
export const AuthContext = createContext();
export const PatientsContext = createContext();

const App = () => {
  // State management for different contexts
  const [patients, setPatients] = useState([]);
  const [loggedInUser, setLoggedInUser] = useState({});
  const [globalData, updateGlobalData] = useState({});
  const [auth, setAuth] = useState({
    provider: "",
    collection: "",
    address: "",
  });
  const [info, setInfo] = useState({});
  const [mod, setMod] = useState({});
  const [header, setHeader] = useState([
    { name: "", email: "", phone: "" },
    { bg: "", border: "" },
    { id: "" },
    { type: "", collection: "", document: "", method: "" },
    { modal: "" },
  ]);

  useEffect(() => {
    const sessionUser = sessionStorage.getItem("user");
    if (sessionUser) {
      setLoggedInUser({ email: sessionUser }); // Populate UserContext from sessionStorage
    }
  }, []);

  const CombinedContextProvider = ({ children }) => (
    <UserContext.Provider value={[loggedInUser, setLoggedInUser]}>
      <ApiContext.Provider value={[header, setHeader]}>
        <GlobalContext.Provider value={[globalData, updateGlobalData]}>
          <DataContext.Provider value={[info, setInfo]}>
            <ModalContext.Provider value={[mod, setMod]}>
              <AuthContext.Provider value={[auth, setAuth]}>
                <PatientsContext.Provider value={[patients, setPatients]}>
                  {children}
                </PatientsContext.Provider>
              </AuthContext.Provider>
            </ModalContext.Provider>
          </DataContext.Provider>
        </GlobalContext.Provider>
      </ApiContext.Provider>
    </UserContext.Provider>
  );

  return (
    <>
      <Toaster />
      <ErrorBoundary
        FallbackComponent={ErrorFallback}
        onReset={() => {
          console.log("Resetting application state after error...");
        }}
      >
        <PatientsInformationProvider>
          <CombinedContextProvider>
            <MainRouter />
          </CombinedContextProvider>
        </PatientsInformationProvider>
      </ErrorBoundary>
    </>
  );
};

export default App;
