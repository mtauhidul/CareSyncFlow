/* eslint-disable import/no-cycle */
/* eslint-disable no-alert */
/* eslint-disable consistent-return */
/* eslint-disable react/jsx-props-no-spreading */
import { faArrowAltCircleLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import CircularProgress from '@material-ui/core/CircularProgress';
import { useContext, useState } from 'react';
import { Container } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useHistory } from 'react-router';
import { Link } from 'react-router-dom';
import { db } from '../../API/firebase';
import { AuthContext, UserContext } from '../../App';
import styles from './AdminLogin.module.css';

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

  const historyCheck = () => {
    if (auth.provider === '') {
      history.push('/');
    }
  };

  historyCheck();

  const pageRedirect = () => {
    history.push(`${auth.address}`);
  };

  const onSubmit = (data) => {
    setLoading(true);

    async function queryData() {
      const ref = db.collection(auth.collection);
      if (auth.provider === 'Admin') {
        ref
          .doc('administrator')
          .get()
          .then((doc) => {
            if (
              doc.data().email === data.email &&
              doc.data().password === data.password
            ) {
              toast.success('Sign In Successful!');
              window.sessionStorage.setItem('user', doc.data().email);
              pageRedirect();
              setLoading(false);
            } else {
              toast.error('Error: Not registered!');
              setLoading(false);
            }
          });
      } else {
        const queryRef = ref.where('email', '==', data.email);
        await queryRef.get().then((res) => {
          if (res.empty) {
            toast.error('Not registered');
            setLoading(false);
          } else if (!res.empty) {
            toast.success('Successful');
            res.forEach((doc) => {
              window.sessionStorage.setItem('user', doc.data().email);
              pageRedirect();
            });
            setLoading(false);
          }
        });
      }
    }

    queryData();
  };

  return (
    <Container fluid className={styles.AdminLoginContainer}>
      <div className={styles.backgroundGradient}></div>
      <div className={styles.glowEffect}></div>
      <div className={styles.floatingShapes}>
        <div className={styles.shape1}></div>
        <div className={styles.shape2}></div>
      </div>

      <div className={styles.AdminLoginWrapper}>
        <div className={styles.loginHeader}>
          <h1>
            <span>{auth.provider}</span> Login
          </h1>
          <p>Enter your credentials to access your dashboard</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className={styles.inputGroup}>
            <label>Email Address</label>
            <input
              type='text'
              placeholder='Enter your email'
              {...register('email', { required: true })}
            />
          </div>

          {auth.provider === 'Admin' && (
            <div className={styles.inputGroup}>
              <label>Password</label>
              <input
                type='password'
                placeholder='Enter your password'
                {...register('password', { required: true })}
              />
            </div>
          )}

          <div className={styles.submitSection}>
            {loading && (
              <div className={styles.loadingWrapper}>
                <CircularProgress />
              </div>
            )}
            <input
              type='submit'
              value='Sign In'
              disabled={loading}
              className={styles.submitBtn}
              style={{
                cursor: loading ? 'not-allowed' : 'pointer',
                display: loading ? 'none' : 'block',
              }}
            />
          </div>
        </form>
      </div>

      <Link to='/' className={styles.exitBtn} type='button'>
        <FontAwesomeIcon
          className={styles.plusIcon}
          icon={faArrowAltCircleLeft}
          size='1x'
        />
        Back to Home
      </Link>
    </Container>
  );
};

export default AdminLogin;
