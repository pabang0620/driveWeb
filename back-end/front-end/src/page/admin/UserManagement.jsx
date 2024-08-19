import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import TitleBox from "../../components/TitleBox";
import SearchBox from "./SearchBox";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const usersPerPage = 10;
  const [editMode, setEditMode] = useState({});

  /*----------검색----------*/
  const [filters, setFilters] = useState({
    searchTerm: "",
    statusFilter: "",
    permissionFilter: "",
    jobFilter: "",
    startDateFilter: "",
    endDateFilter: "",
  });
  const filterFields = [
    {
      id: "searchTerm",
      label: "검색어:",
      type: "text",
    },
    {
      id: "dateRangeFilter",
      label: "기간:",
      type: "dateRange",
      startDateKey: "startDateFilter",
      endDateKey: "endDateFilter",
    },
    {
      id: "statusFilter",
      label: "상태:",
      type: "select",
      options: [
        { value: "", label: "전체" },
        { value: "Active", label: "Active" },
        { value: "Inactive", label: "Inactive" },
      ],
    },
    {
      id: "permissionFilter",
      label: "회원권한:",
      type: "select",
      options: [
        { value: "", label: "전체" },
        { value: "1", label: "Admin" },
        { value: "2", label: "Moderator" },
        { value: "3", label: "Contributor" },
        { value: "4", label: "Premium" },
        { value: "5", label: "Member" },
      ],
    },
    {
      id: "jobFilter",
      label: "직업:",
      type: "select",
      options: [
        { value: "", label: "전체" },
        { value: "택시", label: "택시" },
        { value: "배달", label: "배달" },
        { value: "화물", label: "화물" },
      ],
    },
  ];
  /*--------------------------*/

  const navigate = useNavigate();
  const fetchUsers = async (page) => {
    try {
      const response = await axios.get("/api/admin/users", {
        params: {
          page,
          limit: usersPerPage,
        },
      });

      if (response.data && response.data.users) {
        const usersWithParsedPermission = response.data.users.map((user) => ({
          ...user,
          permission: parseInt(user.permission, 10), // permission을 숫자로 변환
          jobtype: parseInt(user.jobtype, 10), // jobtype도 숫자로 변환
        }));

        setUsers(usersWithParsedPermission);
        setFilteredUsers(usersWithParsedPermission);
        setTotalPages(response.data.totalPages);
      } else {
        console.error("Unexpected API response:", response);
        setUsers([]);
        setFilteredUsers([]);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      setUsers([]);
      setFilteredUsers([]);
    }
  };
  useEffect(() => {
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

  /*----------검색핸들----------*/
  const handleFilterChange = (name, value) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearchClick = () => {
    console.log(filters);
    const {
      searchTerm,
      statusFilter,
      permissionFilter,
      startDateFilter,
      endDateFilter,
    } = filters;

    const startDate = startDateFilter ? new Date(startDateFilter) : null;
    const endDate = endDateFilter ? new Date(endDateFilter) : null;

    const newFilteredUsers = users.filter((user) => {
      const createdDate = new Date(user.createdAt);

      const isWithinDateRange =
        (!startDate || createdDate >= startDate) &&
        (!endDate || createdDate <= endDate);

      const matchesSearchTerm =
        (user.nickname &&
          user.nickname.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (user.username &&
          user.username.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (user.user_profiles?.name &&
          user.user_profiles.name.includes(searchTerm)) ||
        (user.user_profiles?.phone &&
          user.user_profiles.phone.includes(searchTerm));

      const matchesStatusFilter = !statusFilter || user.status === statusFilter;
      const matchesPermissionFilter =
        !permissionFilter || user.permission.toString() === permissionFilter;

      return (
        matchesSearchTerm &&
        matchesStatusFilter &&
        matchesPermissionFilter &&
        isWithinDateRange
      );
    });

    setFilteredUsers(newFilteredUsers);
  };

  const handleResetFilters = () => {
    setFilters({
      searchTerm: "",
      statusFilter: "",
      permissionFilter: "",
      startDateFilter: "",
      endDateFilter: "",
    });
    setFilteredUsers(users);
    setCurrentPage(1); // 필터 초기화 후 페이지 1로 리셋
  };

  /*--------------------------*/
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
    setFilteredUsers((prevFilteredUsers) =>
      prevFilteredUsers.map((user) =>
        user.id === id
          ? field.startsWith("user_profiles.")
            ? {
                ...user,
                user_profiles: {
                  ...user.user_profiles,
                  [field.split(".")[1]]: newValue,
                },
              }
            : { ...user, [field]: newValue }
          : user
      )
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
      permission: parseInt(userToSave.permission, 10),
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
      alert("회원 정보 수정에 성공했습니다.");
      fetchUsers();
    } catch (error) {
      console.error("Error saving user information:", error);
      alert("에러가 발생했습니다.");
    }
  };

  const formatPermission = (permission) => {
    switch (permission) {
      case 1:
        return "Admin";
      case 2:
        return "Moderator";
      case 3:
        return "Contributor";
      case 4:
        return "Premium";
      case 5:
        return "Member";
      default:
        return "알 수 없음";
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
      <SearchBox
        filters={filters}
        filterFields={filterFields}
        handleFilterChange={handleFilterChange}
        handleSearchClick={handleSearchClick}
        handleResetFilters={handleResetFilters}
      />
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
            <th>운행일지</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(filteredUsers) && filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
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
                      <option value={1}>Admin</option>
                      <option value={2}>Moderator</option>
                      <option value={3}>Contributor</option>
                      <option value={4}>Premium</option>
                      <option value={5}>Member</option>
                    </select>
                  ) : (
                    formatPermission(user.permission)
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
