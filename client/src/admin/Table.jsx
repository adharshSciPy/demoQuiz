import React from 'react'
import Table from 'react-bootstrap/Table';
import "../assets/css/table.css"

function ReportTable() {
  return (
    <div>

      <Table striped>
        <thead >
          <tr>
            <th>#</th>
            <th>User Name</th>
            <th>Email</th>
            <th>Mark</th>
            <th>Rating</th>
            <th>Performance Category</th>
          </tr>
        </thead>
        <tbody >
          <tr>
            <td>1</td>
            <td>Mark</td>
            <td>Otto</td>
            <td>95</td>
            <td>Excellent</td>
            <td>Technical</td>
          </tr>
          <tr>
            <td>2</td>
            <td>Jacob</td>
            <td>Thornton</td>
            <td>85</td>
            <td>Good</td>
            <td>Non-Technical</td>
          </tr>
          <tr>
            <td>3</td>
            <td>Sarah</td>
            <td>Connor</td>
            <td>75</td>
            <td>Average</td>
            <td>Technical</td>
          </tr>
          <tr>
            <td>4</td>
            <td>Emily</td>
            <td>Blunt</td>
            <td>60</td>
            <td>Below Average</td>
            <td>Non-Technical</td>
          </tr>
          <tr>
            <td>5</td>
            <td>John</td>
            <td>Doe</td>
            <td>95</td>
            <td>Excellent</td>
            <td>Technical</td>
          </tr>
          <tr>
            <td>6</td>
            <td>Alice</td>
            <td>Smith</td>
            <td>80</td>
            <td>Good</td>
            <td>Non-Technical</td>
          </tr>

          <tr>
            <td>7</td>
            <td>Michael</td>
            <td>Johnson</td>
            <td>70</td>
            <td>Average</td>
            <td>Technical</td>
          </tr>
          <tr>
            <td>8</td>
            <td>Linda</td>
            <td>Williams</td>
            <td>55</td>
            <td>Below Average</td>
            <td>Non-Technical</td>
          </tr>
          <tr>
            <td>9</td>
            <td>Chris</td>
            <td>Evans</td>
            <td>92</td>
            <td>Excellent</td>
            <td>Technical</td>
          </tr>
          <tr>
            <td>10</td>
            <td>Olivia</td>
            <td>Brown</td>
            <td>88</td>
            <td>Good</td>
            <td>Non-Technical</td>
          </tr>
        </tbody>
        <br />
      </Table>


    </div>
  )
}

export default ReportTable
