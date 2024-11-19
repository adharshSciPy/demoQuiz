import { React, useState, useEffect } from 'react';
// import { Link, NavLink } from 'react-router-dom';
// import { SidebarData } from './SidebarData';
// import { IconContext } from 'react-icons';
// import * as FaIcons from "react-icons/fa";
// import * as AiIcons from "react-icons/ai";
import '../assets/css/adminPage.css';
// import Question from './Question';
import Chart from 'react-apexcharts'
import Navbar from '../navbar/Navbar';
import Footer from '../footer/Footer';
import Card from 'antd/es/card/Card';
import axios from 'axios';

function AdminPage() {

  const [user, setUser] = useState([])
  const [section, setSection] = useState([])
  const [isLoading, setIsLoading] = useState(true);


  useEffect(() => {

    const details = async () => {
      const response = await axios.get("http://localhost:8000/api/v1/section/getsections")
      setSection(response.data.data)
      const userResponse = await axios.get("http://localhost:8000/api/v1/user/getUsers")
      setUser(userResponse.data.data)
      setIsLoading(false);
    }
    details()
    // Polling every 10 seconds
    const interval = setInterval(details, 3000);

    // Cleanup on component unmount
    return () => clearInterval(interval);


  }, [])

  let sectionLength = section.length;
  let userLength = user.length;



  return (
    <div className='main'>
      <Navbar />
      <div className='chartpie'>
        <div className='containerpie'>
          <Card
            style={{
              width: '100%',
              maxWidth: '600px',
              height: 'auto',
              margin: '20px auto',
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
              borderRadius: '8px',
              padding: '20px',
              background: '#fff'
            }}
          >
            <Chart type="pie"
              // width={700}
              height={300}
              series={[userLength, sectionLength]}
              options={{
                title: { text: "Assessment PieChart" },
                noData: { text: "Empty Data" },
                labels: ["No of Users", "No of Sections"]
              }}
            >
            </Chart>
          </Card>

        </div>
        <div className='containerpie'>
          <Card
            style={{
              width: '100%',
              maxWidth: '600px',
              height: 'auto',
              margin: '20px auto',
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
              borderRadius: '8px',
              padding: '20px',
              background: '#fff'
            }}
          >
            <Chart type="pie"
              // width={700}
              height={300}
              series={[24, 25, 35, 10]}
              options={{
                title: { text: "User Performance" },
                noData: { text: "Empty Data" },
                labels: ["Low", "High", "Medium", 'Disqualified']
              }}
            >
            </Chart>
          </Card>

        </div>
      </div>
      <Footer />
    </div>



  );
}

export default AdminPage;
