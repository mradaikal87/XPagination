import "./App.css";
import React, { useEffect, useState } from "react";

export default function App() {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState(null);
  const rowsPerPage = 10;

  useEffect(() => {
    const fetchData = async () => {
      try {
        let response = await fetch(
          "https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json"
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        let json = await response.json();
        setData(json);
      } catch (err) {
        setError(err.message);
        alert("failed to fetch data");
      }
    };
    fetchData();
  }, []);

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = data.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.ceil(data.length / rowsPerPage);

  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  return (
    <div className="container">
      <h2>Employee Data Table</h2>

      {error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : (
        <>
          <div className="table-container">
            <table className="employee-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                </tr>
              </thead>
              <tbody>
                {currentRows.length > 0 ? (
                  currentRows.map((employee) => (
                    <tr key={employee.id}>
                      <td>{employee.id}</td>
                      <td>{employee.name}</td>
                      <td>{employee.email}</td>
                      <td>{employee.role}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" style={{ textAlign: "center" }}>
                      Loading...
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="pagination">
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </button>

            <button className="active">{currentPage}</button>

            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}
