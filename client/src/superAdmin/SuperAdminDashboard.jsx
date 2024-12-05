import React, { useEffect, useState } from 'react';
import SuperAdminNav from './SuperAdminNav';
import styles from './SuperAdminDash.module.css'
import axios from 'axios';

function SuperAdminDashboard() {
  const[details,setDetails]=useState([]);
  const fetchAdminData=async()=>{
    try {
      const response=await axios.get(`http://localhost:8000/api/v1/superadmin/getalladmins`);
      console.log("Admins list",response.data.response);
      setDetails(response.data.response)
    } catch (error) {
      
    }

  }
  useEffect(()=>{
    fetchAdminData()
  },[])
  return (
    <div>
    <SuperAdminNav/>
    <div className={styles.main}>
      <table>
        <thead>
        <tr>
          <th>Sl.No</th>
          <th>Name</th>
          <th>Email</th>
          <th>Status</th>

        </tr>
        </thead>
        <tbody>
          {details.map((item,index)=>(

    
          <tr key={item._id}>
            <th>{index+1}</th>
            <th>{item.fullName}</th>
            <th>{item.email}</th>
            <th><button>Active</button></th>


          </tr>
                ))}
        </tbody>


      </table>
    </div>
    

      
    </div>
  )
}

export default SuperAdminDashboard
