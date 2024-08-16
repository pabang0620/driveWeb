import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import TitleBox from "../../components/TitleBox";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const usersPerPage = 10;
  const [selectedUserId, setSelectedUserId] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [permissionFilter, setPermissionFilter] = useState("");
  const [startDateFilter, setStartDateFilter] = useState("");
  const [endDateFilter, setEndDateFilter] = useState("");
  const [editMode, setEditMode] = useState({});

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async (page) => {
      try {
        const response = await axios.get("/api/admin/users", {
          params: {
            page,
            limit: usersPerPage,
          },
        });

        if (response.data && response.data.users) {
          setUsers(response.data.users);
          setTotalPages(response.data.totalPages);
        } else {
          console.error("Unexpected API response:", response);
          setUsers([]);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
        setUsers([]);
      }
    };

    fetchUsers(currentPage);
  }, [currentPage]);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  const handleSearchClick = () => {
    const filteredUsers = users.filter((user) => {
      return true;
    });
    setUsers(filteredUsers);
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setSearchTerm("");
    setStatusFilter("");
    setPermissionFilter("");
    setStartDateFilter("");
    setEndDateFilter("");
    setCurrentPage(1);
  };

  const handleChange = (id, field, newValue) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) => {
        if (user.id === id) {
          if (field.startsWith("user_profiles.")) {
            const profileField = field.split(".")[1];
            return {
              ...user,
              user_profiles: {
                ...user.user_profiles,
                [profileField]: newValue,
              },
            };
          } else {
            return { ...user, [field]: newValue };
          }
        }
        return user;
      })
    );
  };

  const toggleEditMode = (id) => {
    setEditMode((prevEditMode) => ({
      ...prevEditMode,
      [id]: !prevEditMode[id],
    }));
  };

  const handleSave = async (id) => {
    const userToSave = users.find((user) => user.id === id);
    const updatedUser = {
      ...userToSave,
      jobtype: parseInt(userToSave.jobtype, 10),
    };

    try {
      await axios.put(`/api/admin/users/${id}`, updatedUser);
      setUsers((prevUsers) =>
        prevUsers.map((user) => (user.id === id ? updatedUser : user))
      );
      setEditMode((prevEditMode) => ({
        ...prevEditMode,
        [id]: false,
      }));
      alert("User information saved successfully.");
    } catch (error) {
      console.error("Error saving user information:", error);
      alert("Failed to save user information.");
    }
  };

  const formatJobType = (jobtype) => {
    switch (jobtype) {
      case 1:
        return "택시";
      case 2:
        return "배달";
      case 3:
        return "기타";
      default:
        return "알 수 없음";
    }
  };

  const handleNavigate = (userId) => {
    navigate(`/driving_log/${userId}`);
  };

  return (
    <div className="userManagement_container">
      <TitleBox title="관리자페이지" subtitle="회원관리" />
      <div className="searchBox">{/* 검색 및 필터링 UI */}</div>
      <table className="user_table">
        <thead>
          <tr>
            <th>ID</th>
            <th>아이디</th>
            <th>닉네임</th>
            <th>이름</th>
            <th>전화번호</th>
            <th>생년월일</th>
            <th>상태</th>
            <th>회원 권한</th>
            <th>질문</th>
            <th>직업</th>
            <th>작업</th>
            <th>운행일지</th> {/* 새로운 항목 추가 */}
          </tr>
        </thead>
        <tbody>
          {Array.isArray(users) && users.length > 0 ? (
            users.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td style={{ width: "3%" }}>
                  {editMode[user.id] ? (
                    <input
                      type="text"
                      value={user.username}
                      onChange={(e) =>
                        handleChange(user.id, "username", e.target.value)
                      }
                    />
                  ) : (
                    user.username || "없음"
                  )}
                </td>
                <td>
                  {editMode[user.id] ? (
                    <input
                      type="text"
                      value={user.nickname}
                      onChange={(e) =>
                        handleChange(user.id, "nickname", e.target.value)
                      }
                    />
                  ) : (
                    user.nickname || "없음"
                  )}
                </td>
                <td>
                  {editMode[user.id] ? (
                    <input
                      type="text"
                      value={user.user_profiles?.name || ""}
                      onChange={(e) =>
                        handleChange(
                          user.id,
                          "user_profiles.name",
                          e.target.value
                        )
                      }
                    />
                  ) : (
                    user.user_profiles?.name || "없음"
                  )}
                </td>
                <td>
                  {editMode[user.id] ? (
                    <input
                      type="text"
                      value={user.user_profiles?.phone || ""}
                      onChange={(e) =>
                        handleChange(
                          user.id,
                          "user_profiles.phone",
                          e.target.value
                        )
                      }
                    />
                  ) : (
                    user.user_profiles?.phone || "없음"
                  )}
                </td>
                <td>
                  {editMode[user.id] ? (
                    <input
                      type="text"
                      value={user.user_profiles?.birth_date || ""}
                      onChange={(e) =>
                        handleChange(
                          user.id,
                          "user_profiles.birth_date",
                          e.target.value
                        )
                      }
                    />
                  ) : (
                    user.user_profiles?.birth_date || "없음"
                  )}
                </td>
                <td style={{ paddingLeft: "10px", paddingRight: "10px" }}>
                  {editMode[user.id] ? (
                    <select
                      value={user.status}
                      onChange={(e) =>
                        handleChange(user.id, "status", e.target.value)
                      }
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  ) : (
                    user.status
                  )}
                </td>
                <td style={{ paddingLeft: "10px", paddingRight: "10px" }}>
                  {editMode[user.id] ? (
                    <select
                      value={user.permission}
                      onChange={(e) =>
                        handleChange(user.id, "permission", e.target.value)
                      }
                    >
                      <option value="Admin">Admin</option>
                      <option value="Moderator">Moderator</option>
                      <option value="Contributor">Contributor</option>
                      <option value="Premium">Premium</option>
                      <option value="Member">Member</option>
                    </select>
                  ) : (
                    user.permission
                  )}
                </td>
                <td>{user.userQuestion || "없음"}</td>
                <td style={{ width: "5%" }}>
                  {editMode[user.id] ? (
                    <select
                      value={user.jobtype}
                      onChange={(e) =>
                        handleChange(user.id, "jobtype", e.target.value)
                      }
                    >
                      <option value={1}>택시</option>
                      <option value={2}>배달</option>
                      <option value={3}>기타</option>
                    </select>
                  ) : (
                    formatJobType(user.jobtype)
                  )}
                </td>
                <td>
                  {editMode[user.id] ? (
                    <button onClick={() => handleSave(user.id)}>저장</button>
                  ) : (
                    <button onClick={() => toggleEditMode(user.id)}>
                      수정
                    </button>
                  )}
                </td>
                <td>
                  <button onClick={() => handleNavigate(user.id)}>
                    이동하기
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="12">No users found</td>
            </tr>
          )}
        </tbody>
      </table>
      <div className="pagination">
        <button onClick={handlePrevPage} disabled={currentPage === 1}>
          이전
        </button>
        <span>
          {currentPage} / {totalPages}
        </span>
        <button onClick={handleNextPage} disabled={currentPage === totalPages}>
          다음
        </button>
      </div>
      <style jsx>
        {`
          .userManagement_container {
            width: 75%;
            max-width: 1200px;
            margin: 0 auto;
            padding: 100px 0;
            @media (max-width: 768px) {
              width: 85%;
              padding: 50px 0;
            }

            .user_table {
              width: 100%;
              border-collapse: collapse;
              margin: 20px 0;
              tr:nth-child(even) {
                background-color: #f9f9f9;
              }
              th,
              td {
                border: 1px solid #ddd;
              }

              th {
                background-color: #f4f4f4;
                font-size: 14px;
                padding: 10px 0;
                white-space: nowrap;

                @media (max-width: 768px) {
                  font-size: 12px;
                  padding: 5px;
                }
              }

              td {
                font-size: 14px;
                padding: 3px 2px;
                text-align: center;
                white-space: nowrap;

                @media (max-width: 768px) {
                  font-size: 12px;
                  padding: 2px;
                }

                input {
                  width: 60%;
                  padding: 3px 0;
                  font-size: 14px;
                  @media (max-width: 768px) {
                    font-size: 12px;
                  }
                }
                select {
                  width: 100%;
                  padding: 3px 0;
                  font-size: 14px;
                  margin: 0 5px @media (max-width: 768px) {
                    font-size: 12px;
                  }
                }
              }

              button {
                margin: 5px;
                padding: 8px 16px;
                border: none;
                border-radius: 5px;
                background-color: #3c5997;
                color: white;
                cursor: pointer;
                font-size: 14px;
                transition: background-color 0.3s;
                white-space: nowrap;
                &:hover {
                  background-color: #7388b6;
                }
                @media (max-width: 768px) {
                  font-size: 12px;
                  padding: 5px 10px;
                  white-space: nowrap;
                }
              }
            }
            .pagination {
              display: flex;
              justify-content: center;
              margin-top: 20px;
            }
            .pagination button {
              margin: 0 10px;
              padding: 8px 16px;
              border: none;
              border-radius: 5px;
              background-color: #3c5997;
              color: white;
              cursor: pointer;
              font-size: 14px;
              transition: background-color 0.3s;
            }
            .pagination button:disabled {
              background-color: #c0c0c0;
              cursor: not-allowed;
            }
            .pagination button:hover:not(:disabled) {
              background-color: #7388b6;
            }
            .pagination span {
              align-self: center;
            }
          `}
      </style>
    </div>
  );
};

export default UserManagement;
