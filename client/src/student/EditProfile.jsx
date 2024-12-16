import React, { useState } from "react";
import useAuth from "../hooks/useAuth";
import "react-toastify/dist/ReactToastify.css";
import axios from 'axios'
 

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
    <div>
      <form onSubmit={submitHandler} encType="multipart/form-data">
          <label htmlFor="schoolName" className="form-label" style={{ color: "black" }}>
            School Name
          </label>
          <div>
              <label>fullName:</label>
              <textarea
                name="fullName"
                value={form.fullName}
                onChange={formChange}
                placeholder="Enter your fullName"
                required
              />
            </div>
            <div>
              <label>Photo URL:</label>
              <input
                 id="image"
                 type="file"
                 name="image"
                 onChange={handleFileChange}
                 className="form-control"
              />
            </div>
            <div>
              <label>Address:</label>
              <textarea
                name="address"
                value={form.address}
                onChange={formChange}
                placeholder="Enter your address"
                required
              />
            </div>
            <div>
              <label>Phone Number:</label>
              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={formChange}
                placeholder="Enter your phone number"
                required
              />
            </div>
            <div>
              <label>batch:</label>
              <textarea
                name="batch"
                value={form.batch}
                onChange={formChange}
                placeholder="Enter your batch"
                required
              />
            </div>
            <button onClick={submitHandler} type="submit">Submit</button>
      </form>
    </div>
  );
}


export default EditProfile;