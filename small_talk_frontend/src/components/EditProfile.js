import React, { useContext, useState } from "react";
import { UserContext } from "../contexts/UserContext";
import Joi from "joi-browser";

/* 	
	Must have a number
	Must contain at least one upper-case
	Must contain at least one lower-case
	Must contain any of the following symbols [@$!%*?&]
	Should be at least 8 characters long
*/
const regEx = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

function EditProfile() {
  const { user, getCurrentUserInfo } = useContext(UserContext);
  const [disabledInputs, setDisabled] = useState(true);
  const [validationErrorClass, setErrorClass] = useState("register-validation-error");
  const [popupClass, setPopupClass] = useState("st-popup");
  const [saveBtnClass, setSaveClass] = useState("st-button hide");
  const [editBtnClass, setEditClass] = useState("st-button edit");
  const [errorMsgs, setErrorMsgs] = useState([]);
  const [confirmPass, setConfirmPass] = useState("");
  const [userInfo, setUserInfo] = useState({
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    pass: "",
  });

  // validation schema
  const schema = {
    firstName: Joi.string().required().label("First Name"),
    lastName: Joi.string().required().label("Last Name"),
    email: Joi.string().email().required().label("Email"),
    pass: Joi.string().regex(regEx).required().label("Password"),
  };

  // user validation
  const userValidation = () => {
    let tempArray = [];
    let joiArray = [];

    const result = Joi.validate(userInfo, schema, {
      abortEarly: false,
    });

    // if Joi validation was not satisfied then add requirements to the joiArray
    if (result.error) {
      setErrorClass("register-validation-error show-edit");

      tempArray = result.error.details.map((obj) => obj.message);
      tempArray.forEach((str) => {
        if (str.includes("required pattern")) {
          joiArray.push(
            <div>
              <p>"Password" must satisfy the following requirements:</p>
              <ul>
                <li>Must have a number</li>
                <li>Must contain at least one upper-case</li>
                <li>Must contain at least one lower-case</li>
                <li>Must contain any of the following symbols: @$!%*?&</li>
                <li>Must be at least 8 characters long</li>
              </ul>
            </div>
          );
        } else joiArray.push(str);
      });

      if (userInfo.pass !== confirmPass) {
        joiArray.push("Please make sure your passwords match");
      }
      setErrorMsgs(joiArray);
      return false;
    } else {
      // checks to see if confirmation password matches
      if (userInfo.pass !== confirmPass) {
        joiArray.push("Please make sure your passwords match");
        setErrorClass("register-validation-error show-edit");
        setErrorMsgs(joiArray);
        return false;
      } else {
        setErrorClass("register-validation-error");
        setErrorMsgs([]);
        return true;
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (userValidation()) {
      fetch(`${process.env.REACT_APP_API_URL}/users/update-profile/${user._id}`, {
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          "x-auth-token": localStorage.getItem("token"),
        },
        method: "PUT",
        body: JSON.stringify(userInfo),
      }).then(() => {
        setTimeout(() => {
          setPopupClass("st-popup");
        }, 3500);

        setDisabled(true);
        setPopupClass("st-popup show");
        setErrorClass("register-validation-error");
        setErrorMsgs([]);
        setConfirmPass("");
        setSaveClass("st-button hide");
        setEditClass("st-button edit");
        setUserInfo({ ...userInfo, pass: "" });

        getCurrentUserInfo(user._id);
      });
    }
  };

  const handleChange = (e) => {
    setUserInfo({
      ...userInfo,
      [e.target.name]: e.target.value,
    });
  };

  const handleConfirmChange = (e) => {
    setConfirmPass(e.target.value);
  };

  const handleEditClick = () => {
    setDisabled(false);
    setSaveClass("st-button edit");
    setEditClass("st-button hide");
  };

  const handleCancelClick = () => {
    setDisabled(true);
    setErrorClass("register-validation-error");
    setSaveClass("st-button hide");
    setEditClass("st-button edit");
    setConfirmPass("");
    setUserInfo({ ...user, pass: "" });
  };

  return (
    <div>
      <h1 className="st-h1">Edit Profile</h1>

      <div className={validationErrorClass}>
        {errorMsgs.map((msg) => (
          <div
            key={(Math.random() * 1000).toString()}
            style={{ paddingTop: "15px", paddingBottom: "15px" }}
          >
            {msg}
          </div>
        ))}
      </div>

      <form className="edit-form" onSubmit={handleSubmit}>
        <div className="edit-name-container">
          <input
            className="edit-input name"
            type="text"
            name="firstName"
            placeholder="First Name"
            disabled={disabledInputs}
            value={userInfo.firstName}
            onChange={handleChange}
          />
          <input
            className="edit-input name"
            type="text"
            name="lastName"
            placeholder="Last Name"
            disabled={disabledInputs}
            value={userInfo.lastName}
            onChange={handleChange}
          />
        </div>

        <input
          className="edit-input"
          type="text"
          name="email"
          placeholder="Email"
          disabled={disabledInputs}
          value={userInfo.email}
          onChange={handleChange}
        />
        <input
          className="edit-input"
          type="password"
          name="pass"
          placeholder="Password"
          disabled={disabledInputs}
          value={userInfo.pass}
          onChange={handleChange}
        />
        <input
          className="edit-input"
          type="password"
          placeholder="Confirm Password"
          disabled={disabledInputs}
          value={confirmPass}
          onChange={handleConfirmChange}
        />

        <div className="edit-button-container">
          <button className={saveBtnClass} type="submit">
            Save
          </button>
          <button className={editBtnClass} type="button" onClick={handleEditClick}>
            Edit
          </button>
          <button className="st-button edit" type="button" onClick={handleCancelClick}>
            Cancel
          </button>
        </div>
      </form>

      <div className={popupClass}>Profile Updated.</div>
    </div>
  );
}

export default EditProfile;
