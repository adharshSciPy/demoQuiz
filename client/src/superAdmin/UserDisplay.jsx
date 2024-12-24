import React, { useEffect, useState } from 'react'
import SuperAdminNav from './SuperAdminNav';
import Table from 'react-bootstrap/Table';
import styles from './SuperAdminDash.module.css';
import axios from 'axios';

function UserDisplay() {
  const [userDetails, SetUserDetails] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [active, setActive] = useState('');

  const getAllUsers = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/v1/user/getUsers');
      SetUserDetails(response.data.data);
      setFilteredUsers(response.data.data); // Initially show all users
    } catch (error) {
      console.log('Error', error);
    }
  };

  useEffect(() => {
    getAllUsers();
  }, []);

  const formatDate = (inputDate) => {
    const date = new Date(inputDate);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const filterData = (event) => {
    const status = event.target.value;
    setActive(status);
    if (status === 'active') {
      setFilteredUsers(userDetails.filter((user) => user.isEnabled));
    } else if (status === 'inactive') {
      setFilteredUsers(userDetails.filter((user) => !user.isEnabled));
    } else {
      setFilteredUsers(userDetails); // Show all users if no filter
    }
  };

  return (
    <div>
      <SuperAdminNav />
      <div className={styles.main}>
        
        <div className={styles.dropdownDiv}>
          <label htmlFor="activityStatus" className={styles.formLabel}> Status</label>
          <select
            id="activityStatus"
            className={styles.formSelect}
            value={active}
            onChange={filterData}
          >
            <option className={styles.selectOptions} value="">All</option>
            <option className={styles.selectOptions} value="active">Active</option>
            <option className={styles.selectOptions} value="inactive">Inactive</option>
          </select>
        </div>

        <Table striped>
          <thead className={styles.tableHeader}>
            <tr>
              <th className={styles.tableHeader}>Sl.No</th>
              <th className={styles.tableHeader}>User Name</th>
              <th className={styles.tableHeader}>Email</th>
              <th className={styles.tableHeader}>Created At</th>
              <th className={styles.tableHeader}>Phone No</th>
              <th className={styles.tableHeader}>Activity Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((item, index) => (
              <tr key={item.id} className={styles.tableCenter}>
                <td className={`fs-6 ${styles.tableCenter}`}>{index + 1}</td>
                <td className={`fs-6  ${styles.tableCenter}`}>{item.fullName}</td>
                <td className={`fs-6 ${styles.tableCenter}`}>{item.email}</td>
                <td className={`fs-6 ${styles.tableCenter}`}>{formatDate(item.date)}</td>
                <td className={`fs-6 ${styles.tableCenter}`}>{item.phone ? item.phone : 'N/A'}</td>
                <td
                  className={styles.tableCenter}
                  style={{ color: item.isEnabled ? 'green' : 'red' }}
                >
                  {item.isEnabled ? 'Active' : 'Inactive'}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </div>
  );
}

export default UserDisplay;
