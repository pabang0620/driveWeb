import React, { useState } from "react";
import { dummyusers } from "../../components/dummy";
import TitleBox from "../../components/TitleBox";
import SearchBox from "./SearchBox";

const UserManagement = () => {
  const [users, setUsers] = useState(dummyusers);
  const [filteredUsers, setFilteredUsers] = useState(users);

  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;

  const [editMode, setEditMode] = useState({});

  /*------------ */
  const [filters, setFilters] = useState({
    searchTerm: "",
    userStatusFilter: "",
    userPermissionFilter: "",
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
      id: "userStatusFilter",
      label: "상태:",
      type: "select",
      options: [
        { value: "", label: "전체" },
        { value: "Active", label: "Active" },
        { value: "Inactive", label: "Inactive" },
      ],
    },
    {
      id: "userPermissionFilter",
      label: "권한:",
      type: "select",
      options: [
        { value: "", label: "전체" },
        { value: "Admin", label: "Admin" },
        { value: "Moderator", label: "Moderator" },
        { value: "Contributor", label: "Contributor" },
        { value: "Premium", label: "Premium" },
        { value: "Member", label: "Member" },
      ],
    },
  ];
  /*------------ */

  const statusSetting = ["Active", "Inactive"];

  const permissionSetting = [
    /*-------관리자페이지-----------------*/
    "Admin", // 0 최고 권한
    "Moderator", // 1 중간 권한, 콘텐츠 관리 및 사용자 관리
    /*-------관리자페이지 : 운행일지, 랭킹, 게시글 관리(통계, 회원관리 제외)-----*/
    "Contributor", // 2 콘텐츠 기여자, 게시물 작성 가능
    /*-------회원-------------- */
    "Premium", // 3 유로회원, 유로 콘텐츠 열람 가능
    "Member", // 4 회원, 일반 사용자,
  ];

  const handleFilterChange = (name, value) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearchClick = () => {
    const {
      searchTerm,
      userStatusFilter,
      userPermissionFilter,
      startDateFilter,
      endDateFilter,
    } = filters;

    const startDate = startDateFilter ? new Date(startDateFilter) : null;
    const endDate = endDateFilter ? new Date(endDateFilter) : null;

    const newFilteredUsers = users.filter((user) => {
      const joinDate = new Date(user.joinDate);

      const isWithinDateRange =
        (!startDate || joinDate >= startDate) &&
        (!endDate || joinDate <= endDate);

      const matchesSearchTerm =
        (user.username &&
          user.username.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (user.nickname &&
          user.nickname.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesStatus =
        !userStatusFilter || user.status === userStatusFilter;
      const matchesPermission =
        !userPermissionFilter || user.permission === userPermissionFilter;

      return (
        matchesSearchTerm &&
        matchesStatus &&
        matchesPermission &&
        isWithinDateRange
      );
    });

    setFilteredUsers(newFilteredUsers);
    setCurrentPage(1); // 검색 후 페이지를 1로 리셋
  };

  const handleResetFilters = () => {
    setFilters({
      searchTerm: "",
      userStatusFilter: "",
      userPermissionFilter: "",
      startDateFilter: "",
      endDateFilter: "",
    });
    setFilteredUsers(users);
    setCurrentPage(1); // 필터 초기화 후 페이지를 1로 리셋
  };
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const handleChange = (id, field, newValue) => {
    setUsers(
      users.map((user) =>
        user.id === id ? { ...user, [field]: newValue } : user
      )
    );
  };

  const toggleEditMode = (id) => {
    setEditMode((prevEditMode) => ({
      ...prevEditMode,
      [id]: !prevEditMode[id],
    }));
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
            <th>가입일</th>
            <th>상태</th>
            <th>회원 권한</th>
            <th>작업</th>
          </tr>
        </thead>
        <tbody>
          {currentUsers.map((user) => (
            <tr key={user.id}>
              <td className="id">{user.id}</td>
              <td className="username">{user.username}</td>
              <td className="nickname">{user.nickname}</td>
              <td className="joinDate">{user.joinDate}</td>
              <td className="status">
                <select
                  value={user.status} // 사용자의 현재 역할을 설정
                  onChange={(e) =>
                    handleChange(user.id, "status", e.target.value)
                  } // 역할 변경 처리
                >
                  {statusSetting.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </td>
              <td className="permission">
                <select
                  value={user.permission}
                  onChange={(e) =>
                    handleChange(user.id, "permission", e.target.value)
                  }
                >
                  {permissionSetting.map((permission) => (
                    <option key={permission} value={permission}>
                      {permission}
                    </option>
                  ))}
                </select>
              </td>
              <td>
                <button onClick={() => toggleEditMode(user.id)}>
                  {editMode[user.id] ? "완료" : "수정"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="pagination">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          이전
        </button>
        <span>
          {currentPage} / {totalPages}
        </span>
        <button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
        >
          다음
        </button>
      </div>
      <style jsx>{`
        .userManagement_container {
          width: 75%;
          max-width: 1200px;
          margin: 0 auto;
          padding: 100px 0;
          @media (max-width: 768px) {
            width: 85%;
            padding: 50px 0;
          }

          /*------------------유저테이블------------------*/
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
              @media (max-width: 768px) {
                font-size: 12px;
                padding: 5px;
              }
            }

            td {
              font-size: 14px;
              padding: 3px 0;
              text-align: center;
              @media (max-width: 768px) {
                font-size: 12px;
                padding: 2px;
              }
              select {
                width: 80%;
                padding: 3px 0;
                font-size: 14px;
                @media (max-width: 768px) {
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
        }
      `}</style>
    </div>
  );
};

export default UserManagement;
