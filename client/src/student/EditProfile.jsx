import React, { useState } from "react";
import useAuth from "../hooks/useAuth";
import "react-toastify/dist/ReactToastify.css";
import axios from 'axios'
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import FilledInput from "@mui/material/FilledInput";
import styles from "../assets/css/signup.module.css";
import NavbarStudent from "../navbar/NavbarStudent";
import Footer from '../footer/Footer';

function EditProfile() {
  const { loggedInUserId } = useAuth();
  console.log("User ID:", loggedInUserId);

  const [file, setFile] = useState('');
  const initialFormState = {
    fullName:"",
    photo: "",
    address: "",
    phone: "",
    batch:"",
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
      formData.append("address", form.address);
      formData.append("phone", form.phone);
      formData.append("batch", form.batch);
      formData.append("image",file)
      // Example: Sending formData to a server using fetch
      const response = await axios.patch(
        `http://localhost:8000/api/v1/user/uploads/${loggedInUserId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
    
      if (response.status >= 200 && response.status < 300) {
        console.log("Form submitted successfully!");
        setForm({
          fullName:"",
          photo: "",
          address: "",
          phone: "",
          batch: ""
        });
        setFile('');
      } else {
        throw new Error(`Failed to submit form: ${response.statusText}`);
      }
    } catch (error) {
      console.error("Error submitting form:", error.message || error);
    }
  };
  return (
    
    <div className={styles.body}>
      <NavbarStudent
       />
<div className={styles.container}>
  <div className={styles.dashboard}>
    <div className={styles.button}>
  <form className={styles.landingForm} onSubmit={submitHandler} encType="multipart/form-data">
    <FormControl
      sx={{
        m: 1,
        width: { xs: "50%" },
      }}
      variant="filled"
    >
      <InputLabel htmlFor="filled-adornment-email">FullName</InputLabel>
      <FilledInput
        id="fullName"
        type="text"
        name="fullName"
        value={form.fullName}
        onChange={formChange}
      />
    </FormControl>
    <FormControl
      sx={{
        m: 1,
        width: { xs: "50%" },
      }}
      variant="filled"
    >
      <InputLabel htmlFor="filled-adornment-email">Address</InputLabel>
      <FilledInput
        id="address"
        multiline
        rows={3}
        name="address"
        value={form.address}
        onChange={formChange}
      />
    </FormControl>
    <FormControl
      sx={{
        m: 1,
        width: { xs: "50%" },
      }}
      variant="filled"
    >
      <InputLabel htmlFor="filled-adornment-email">PhoneNumber</InputLabel>
      <FilledInput
        id="phone"
        type="text"
        name="phone"
        value={form.phone}
        onChange={formChange}
      />
    </FormControl>
    <FormControl
      sx={{
        m: 1,
        width: { xs: "50%" },
      }}
      variant="filled"
    >
      <InputLabel htmlFor="filled-adornment-email">Batch</InputLabel>
      <FilledInput
        id="batch"
        type="text"
        name="batch"
        value={form.batch}
        onChange={formChange}
      />
    </FormControl>
    <FormControl
      sx={{
        m: 1,
        width: { xs: "50%" },
      }}
      variant="filled"
    >
      <FilledInput
        id="image"
        type="file"
        name="image"
        onChange={handleFileChange} 
      />
    </FormControl>
    <FormControl
      sx={{
        m: 1,
        width: { xs: "50%" },
      }}
      variant="filled"
    >
      <button onClick={submitHandler} type="submit">Submit</button>
    </FormControl>
  </form>
  
</div>

</div>

</div>
<Footer/>
</div>
);
  
}


export default EditProfile;