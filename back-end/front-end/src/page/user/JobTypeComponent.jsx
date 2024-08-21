import React from "react";
import axios from "axios";

const JobTypeComponent = () => {
  const updateJobType = async (newJobType) => {
    try {
      const response = await axios.put(
        "/api/user/jobtype",
        { jobType: newJobType },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Get the existing token from localStorage
          },
        }
      );

      console.log("Updated Job Type:", response.data);
      //   alert(`Job Type has been updated to: ${response.data.updatedJobType}`);
      window.location.reload();

      // Assuming the server returns the new token in the response
      localStorage.setItem("token", response.data.token); // Save the new token to localStorage
      alert("Token updated and saved to local storage.");
    } catch (error) {
      console.error("Failed to update job type:", error);
      alert("Failed to update job type. Check console for details.");
    }
  };

  return (
    <div className="container">
      <h2>업종을 선택해주세요</h2>
      <div className="button-group">
        <button onClick={() => updateJobType(1)}>택시</button>
        <button onClick={() => updateJobType(2)}>배달</button>
        <button onClick={() => updateJobType(3)}>기타</button>
      </div>
      <style jsx>{`
        .container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 67vh;
          min-width: 300px;
          h2 {
            color: #333;
            font-family: "Arial", sans-serif;
            font-size: 24px;
            text-align: center;
            margin-bottom: 20px;
          }
          .button-group button {
            padding: 10px 20px;
            margin: 5px;
            font-size: 16px;
            cursor: pointer;
            background-color: #f0f0f0;
            border: none;
            border-radius: 5px;
            transition: background-color 0.3s, color 0.3s;
          }
          .button-group button:hover {
            background-color: #0056b3;
            color: white;
          }
        }
      `}</style>
    </div>
  );
};

export default JobTypeComponent;
