import React from "react";
import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
} from "@coreui/react";
import { useNavigate } from "react-router-dom";
import { server_url } from "../../constants/variables";
import CIcon from "@coreui/icons-react";
import { cilLockLocked, cilUser } from "@coreui/icons";
import { useState } from "react";
import moment from "moment/moment";
import { useEffect } from "react";
import axios from "axios";

const Register = () => {
  let navigate = useNavigate();
  // Once submitted then show validation
  const [userObj, setUserObj] = useState("");
  const [IsOnceSubmitted, setIsOnceSubmitted] = useState(false);
  const [confirmEmail, setConfirmEmail] = useState(false);
  const [isValid, setValidation] = useState({
    isNameValid: false,
    isEmailValid: false,
    isPasswordValid: false,
    isConfirmPassWordValid: false,
    isDOBValid: false,
  });
  const isInputValid = () => {
    return (
      isValid.isConfirmPassWordValid &&
      isValid.isDOBValid &&
      isValid.isEmailValid &&
      isValid.isPasswordValid &&
      isValid.isNameValid
    );
  };

  //creating function to load ip address from the API
  const getData = async () => {
    const res = await axios.get("https://geolocation-db.com/json/");
    console.log(res.data);
    setUserObj((oldObj) => ({ ...oldObj, ["ip"]: res.data }));
  };

  useEffect(() => {
    //   //passing getData method to the lifecycle method
    getData();
  }, []);
  const handleForm = (e) => {
    const { target } = e;
    const name = target.name;
    const value = target.value;
    // set fields
    setUserObj((oldObj) => ({ ...oldObj, [name]: value }));
    switch (name) {
      case "name": {
        let namExp = /^[A-Za-z ]+$/;
        if (!namExp.test(value)) {
          setValidation((oldObj) => ({
            ...oldObj,
            ["isNameValid"]: false,
          }));
          break;
        }

        setValidation((oldObj) => ({
          ...oldObj,
          ["isNameValid"]: true,
        }));
        break;
      }
      case "email": {
        let emailExp = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,15}/g;
        if (!emailExp.test(value)) {
          setValidation((oldObj) => ({
            ...oldObj,
            ["isEmailValid"]: false,
          }));
          break;
        }

        setValidation((oldObj) => ({
          ...oldObj,
          ["isEmailValid"]: true,
        }));

        break;
      }
      case "password": {
        let passwordExp =
          /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/;
        if (!passwordExp.test(value)) {
          setValidation((oldObj) => ({
            ...oldObj,
            ["isPasswordValid"]: false,
          }));
          break;
        }
        setValidation((oldObj) => ({
          ...oldObj,
          ["isPasswordValid"]: true,
        }));
        break;
      }
      case "confirmPassword": {
        if (userObj.password !== value) {
          setValidation((oldObj) => ({
            ...oldObj,
            ["isConfirmPassWordValid"]: false,
          }));
          break;
        }
        setValidation((oldObj) => ({
          ...oldObj,
          ["isConfirmPassWordValid"]: true,
        }));
        break;
      }
      case "dateOfBirth": {
        const dtDob = moment(value).format("MM/DD/YYYY");
        let currYear = new Date().getFullYear();
        let dobYear = parseInt(dtDob.split("/")[2]);
        if (dobYear >= currYear) {
          setValidation((oldObj) => ({
            ...oldObj,
            ["isDOBValid"]: false,
          }));
          break;
        }
        setValidation((oldObj) => ({
          ...oldObj,
          ["isDOBValid"]: true,
        }));
        break;
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsOnceSubmitted(true);
    console.log(userObj);
    console.log(server_url);
    if (!isInputValid()) {
      console.log("invalid inputs");
      return;
    }

    const userData = await axios.post(server_url + "auth/signup", userObj);
    if (userData.data.newUser.success === true) {
      setConfirmEmail(true);
      // navigate("/login");
    } else navigate("/500");
  };
  return (
    <div className="bg-light min-vh-100 d-flex flex-row align-items-center">
      {!confirmEmail ? (
        <CContainer>
          <CRow className="justify-content-center">
            <CCol md={9} lg={7} xl={6}>
              <CCard className="mx-4">
                <CCardBody className="p-4">
                  <CForm onSubmit={handleSubmit}>
                    <h1>Register</h1>
                    <p className="text-medium-emphasis">Create your account</p>
                    <CInputGroup className="mb-3">
                      <CInputGroupText>
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <CFormInput
                        placeholder="Name"
                        autoComplete="name"
                        onChange={handleForm}
                        required={true}
                        name="name"
                        feedbackInvalid="Please provide a valid name."
                        invalid={!isValid.isNameValid && IsOnceSubmitted}
                      />
                    </CInputGroup>
                    <CInputGroup className="mb-3">
                      <CInputGroupText>@</CInputGroupText>
                      <CFormInput
                        placeholder="Email"
                        autoComplete="email"
                        onChange={handleForm}
                        required
                        name="email"
                        feedbackInvalid="Please provide a valid email."
                        invalid={!isValid.isEmailValid && IsOnceSubmitted}
                      />
                    </CInputGroup>
                    <CInputGroup className="mb-3">
                      <CInputGroupText>
                        <CIcon icon={cilLockLocked} />
                      </CInputGroupText>
                      <CFormInput
                        type="password"
                        placeholder="Password"
                        autoComplete="new-password"
                        onChange={handleForm}
                        required={true}
                        name="password"
                        feedbackInvalid="Password should be atleast 6 characters long, with atleast 1 special character and atleast one number."
                        invalid={!isValid.isPasswordValid && IsOnceSubmitted}
                      />
                    </CInputGroup>
                    <CInputGroup className="mb-4">
                      <CInputGroupText>
                        <CIcon icon={cilLockLocked} />
                      </CInputGroupText>
                      <CFormInput
                        type="password"
                        placeholder="Repeat password"
                        autoComplete="new-password"
                        onChange={handleForm}
                        required
                        name="confirmPassword"
                        feedbackInvalid="Password did not match."
                        invalid={
                          !isValid.isConfirmPassWordValid && IsOnceSubmitted
                        }
                      />
                    </CInputGroup>
                    <CInputGroup className="mb-3">
                      <CInputGroupText>DOB</CInputGroupText>
                      <CFormInput
                        feedbackInvalid="Please provide a valid date of birth."
                        invalid={!isValid.isDOBValid && IsOnceSubmitted}
                        type="date"
                        name="dateOfBirth"
                        required
                        onChange={handleForm}
                      />
                    </CInputGroup>
                    <div className="d-grid">
                      <CButton type="submit" color="success">
                        Create Account
                      </CButton>
                    </div>
                  </CForm>
                </CCardBody>
              </CCard>
            </CCol>
          </CRow>
        </CContainer>
      ) : (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100vw",
            height: "100vh",
          }}
        >
          Please check your email inbox and click on the given link to verify
          and then login.
        </div>
      )}
    </div>
  );
};

export default Register;
