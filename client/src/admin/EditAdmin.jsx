import React, { useState } from "react";
import useAuth from "../hooks/useAuth";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import FilledInput from "@mui/material/FilledInput";
import { Button } from "@mui/material";
import styles from "../assets/css/signup.module.css";
import Navbar from "../navbar/Navbar";
import Footer from "../footer/Footer";
import { ToastContainer, toast } from "react-toastify";

function EditAdmin() {
  const { loggedInUserId } = useAuth();
  const notifyError = (message) => toast.error(message);
  const notifySucess = (message) => toast.success(message);

  const [file, setFile] = useState(null);
  const initialFormState = {
    fullName: "",
    schoolName: "",
    phoneNumber: "",
    address: "",
  };
  const [form, setForm] = useState(initialFormState);

  const formChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("fullName", form.fullName);
      formData.append("schoolName", form.schoolName);
      formData.append("phoneNumber", form.phoneNumber);
      formData.append("address", form.address);
      formData.append("image", file);

      // Example: Sending formData to a server using fetch
      const response = await axios.patch(
        `http://localhost:8000/api/v1/admin/editWithUpload/${loggedInUserId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        notifySucess("Profile updated successfully");
        setForm({
          fullName: "",
          schoolName: "",
          phoneNumber: "",
          address: "",
        });
        document.getElementById("image").value = "";
      } else {
        notifyError("Error submitting form");
        throw new Error(`Failed to submit form: ${response.statusText}`);

       
      }
    } catch (error) {
      notifyError("Error submitting form");
      console.error("Error submitting form:", error.message || error);
    }
  };

  return (
    <div className={styles.body}>
      <ToastContainer
        position="bottom-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        pauseOnHover
      />
      <Navbar />
      <div className={styles.container}>
        <div className={styles.dashboard}>
          <div className={styles.button}>
            <form
              className={styles.landingForm}
              onSubmit={submitHandler}
              encType="multipart/form-data"
            >
              <FormControl
                sx={{
                  m: 1,
                  width: { xs: "80%" },
                }}
                variant="filled"
              >
                <InputLabel htmlFor="filled-adornment-email">
                  FullName
                </InputLabel>
                <FilledInput
                  id="FullName"
                  type="text"
                  name="fullName"
                  value={form.fullName}
                  onChange={formChange}
                  required="true"
                />
              </FormControl>
              <FormControl
                sx={{
                  m: 1,
                  width: { xs: "80%" },
                }}
                variant="filled"
              >
                <InputLabel htmlFor="filled-adornment-email">
                  Address
                </InputLabel>
                <FilledInput
                  id="Address"
                  multiline
                  rows={3}
                  name="address"
                  value={form.address}
                  onChange={formChange}
                  required="true"
                />
              </FormControl>
              <FormControl
                sx={{
                  m: 1,
                  width: { xs: "80%" },
                }}
                variant="filled"
              >
                <InputLabel htmlFor="filled-adornment-email">
                  PhoneNumber
                </InputLabel>
                <FilledInput
                  id="phoneNumber"
                  type="text"
                  name="phoneNumber"
                  value={form.phoneNumber}
                  onChange={formChange}
                  required="true"
                />
              </FormControl>
              <FormControl
                sx={{
                  m: 1,
                  width: { xs: "80%" },
                }}
                variant="filled"
              >
                <InputLabel htmlFor="filled-adornment-email">
                  SchoolName
                </InputLabel>
                <FilledInput
                  id="schoolname"
                  type="text"
                  name="schoolName"
                  value={form.schoolName}
                  onChange={formChange}
                  required="true"
                />
              </FormControl>
              <FormControl
                sx={{
                  m: 1,
                  width: { xs: "80%" },
                }}
                variant="filled"
              >
                <FilledInput
                  id="image"
                  type="file"
                  name="image"
                  onChange={handleFileChange}
                  required="true"
                />
              </FormControl>
              <FormControl
                sx={{
                  m: 1,
                  width: { xs: "80%" },
                }}
                variant="filled"
              >
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  sx={{ m: 1 }}
                >
                  Submit
                </Button>
              </FormControl>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default EditAdmin;
