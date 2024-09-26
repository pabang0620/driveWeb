import React from "react";
import axios from "axios";
import "./user.scss";

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
    </div>
  );
};

export default JobTypeComponent;
