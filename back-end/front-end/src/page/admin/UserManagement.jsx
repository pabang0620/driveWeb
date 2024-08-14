import React, { useState } from "react";
import { dummyusers } from "../../components/dummy";
import TitleBox from "../../components/TitleBox";

const UserManagement = () => {
  const [users, setUsers] = useState(dummyusers);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [boardLevelFilter, setBoardLevelFilter] = useState("");
  const [permissionFilter, setPermissionFilter] = useState("");
  const [startDateFilter, setStartDateFilter] = useState("");
  const [endDateFilter, setEndDateFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;

  const [filteredUsers, setFilteredUsers] = useState(users);
  const [editMode, setEditMode] = useState({});

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

  const handleFilterChange = (e, filterSetter) => {
    filterSetter(e.target.value);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchClick = () => {
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

      const matchesStatus = !statusFilter || user.status === statusFilter;
      const matchesBoardLevel =
        !boardLevelFilter || user.boardLevel === boardLevelFilter;
      const matchesPermission =
        !permissionFilter || user.permission === permissionFilter;

      return (
        matchesSearchTerm &&
        matchesStatus &&
        matchesBoardLevel &&
        matchesPermission &&
        isWithinDateRange
      );
    });

    setFilteredUsers(newFilteredUsers);
    setCurrentPage(1); // 검색 후 페이지를 1로 리셋
  };

  const handleResetFilters = () => {
    setSearchTerm("");
    setStatusFilter("");
    setBoardLevelFilter("");
    setPermissionFilter("");
    setStartDateFilter("");
    setEndDateFilter("");
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
      <div className="searchBox">
        <div className="filter_container search_container">
          <label htmlFor="search" className="filter_label">
            검색
          </label>
          <input
            id="search"
            type="text"
            placeholder="검색어 입력"
            value={searchTerm}
            onChange={handleSearchChange}
            className="search_input"
          />
        </div>
        <div className="filter_container">
          <label htmlFor="statusFilter" className="filter_label">
            상태
          </label>
          <select
            id="statusFilter"
            value={statusFilter}
            onChange={(e) => handleFilterChange(e, setStatusFilter)}
            className="filter_select"
          >
            <option value="">선택하세요</option>
            {statusSetting.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>

        <div className="filter_container permissionfilter_container">
          <label htmlFor="permissionFilter" className="filter_label">
            회원 권한
          </label>
          <select
            id="permissionFilter"
            value={permissionFilter}
            onChange={(e) => handleFilterChange(e, setPermissionFilter)}
            className="filter_select"
          >
            <option value="">선택하세요</option>
            {permissionSetting.map((permission) => (
              <option key={permission} value={permission}>
                {permission}
              </option>
            ))}
          </select>
        </div>
        <div className="filter_container datefilter_container">
          <label htmlFor="startDateFilter" className="filter_label">
            가입일
          </label>
          <input
            id="startDateFilter"
            type="date"
            value={startDateFilter}
            onChange={(e) => handleFilterChange(e, setStartDateFilter)}
            className="date_input"
          />
          ~
          <input
            id="endDateFilter"
            type="date"
            value={endDateFilter}
            onChange={(e) => handleFilterChange(e, setEndDateFilter)}
            className="date_input"
          />
        </div>
      </div>
      <div className="searchBtnBox">
        <button onClick={handleSearchClick} className="search_button">
          검색
        </button>
        <button onClick={handleResetFilters} className="reset_button">
          초기화
        </button>
      </div>
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
