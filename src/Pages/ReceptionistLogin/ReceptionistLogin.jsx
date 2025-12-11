/* eslint-disable no-alert */
/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { Container } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowAltCircleLeft } from '@fortawesome/free-solid-svg-icons';
import { db } from '../../API/firebase';
import styles from './ReceptionistLogin.module.css';

const ReceptionistLogin = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    async function queryData() {
      const ref = db.collection('receptionists');
      const queryRef = ref.where('email', '==', data.email);
      await queryRef.get().then((res) => {
        if (res.empty) {
          toast.error('Not registered');
        } else if (!res.empty) {
          toast.success('Successful');
        }
      });
    }

    queryData();
  };

  return (
    <Container fluid className={styles.ReceptionistLoginContainer}>
      <div className={styles.backgroundGradient}></div>
      <div className={styles.glowEffect}></div>
      <div className={styles.floatingShapes}>
        <div className={styles.shape1}></div>
        <div className={styles.shape2}></div>
      </div>

      <div className={styles.ReceptionistLoginWrapper}>
        <div className={styles.loginHeader}>
          <h1>Receptionist Login</h1>
          <p>Enter your email to access the receptionist dashboard</p>
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

          <div className={styles.submitSection}>
            <input type='submit' value='Sign In' className={styles.submitBtn} />
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

export default ReceptionistLogin;
