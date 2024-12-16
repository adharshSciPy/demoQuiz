  import React, { useState } from "react";
  import useAuth from "../hooks/useAuth";
  import "react-toastify/dist/ReactToastify.css";
  import axios from 'axios'

  function EditAdmin() {
    const { loggedInUserId } = useAuth();
    console.log("User ID:", loggedInUserId);

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
      
        if (response.status >= 200 && response.status < 300) {
          console.log("Form submitted successfully!");
          setForm({
            fullName: "",
            schoolName: "",
            phoneNumber: "",
            address: "",
          });
          document.getElementById("image").value = "";
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
          <div className="mb-4">
            <label htmlFor="schoolName" className="form-label" style={{ color: "black" }}>
              School Name
            </label>
            <input
              id="schoolName"
              type="text"
              name="schoolName"
              value={form.schoolName}
              onChange={formChange}
              className="form-control"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="fullName" className="form-label" style={{ color: "black" }}>
              Full Name
            </label>
            <input
              id="fullName"
              type="text"
              name="fullName"
              value={form.fullName}
              onChange={formChange}
              className="form-control"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="address" className="form-label" style={{ color: "black" }}>
              Address
            </label>
            <input
              id="address"
              type="text"
              name="address"
              value={form.address}
              onChange={formChange}
              className="form-control"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="phoneNumber" className="form-label" style={{ color: "black" }}>
              Phone Number
            </label>
            <input
              id="phoneNumber"
              type="number"
              name="phoneNumber"
              value={form.phoneNumber}
              onChange={formChange}
              className="form-control"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="image" className="form-label" style={{ color: "black" }}>
              Image
            </label>
            <input
              id="image"
              type="file"
              name="image"
              onChange={handleFileChange}
              className="form-control"
            />
          </div>
          <button type="submit" className="btn btn-secondary">
            Submit
          </button>
        </form>
      </div>
    );
  }


  export default EditAdmin;
