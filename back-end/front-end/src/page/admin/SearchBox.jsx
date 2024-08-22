const SearchBox = ({
  filters,
  handleFilterChange,
  handleSearchClick,
  handleResetFilters,
}) => {
  return (
    <div className="searchBox">
      <div className="filterRow">
        {/* 첫 줄: 아이디, 닉네임 */}
        <div className="filterField">
          <label className="filterLabel">아이디</label>
          <input
            className="filterInput"
            type="text"
            value={filters.username}
            onChange={(e) => handleFilterChange("username", e.target.value)}
          />
        </div>
        <div className="filterField">
          <label className="filterLabel">닉네임</label>
          <input
            className="filterInput"
            type="text"
            value={filters.nickname}
            onChange={(e) => handleFilterChange("nickname", e.target.value)}
          />
        </div>
      </div>

      <div className="filterRow">
        {/* 둘째 줄: 이름, 전화번호 */}
        <div className="filterField">
          <label className="filterLabel">이름</label>
          <input
            className="filterInput"
            type="text"
            value={filters.name}
            onChange={(e) => handleFilterChange("name", e.target.value)}
          />
        </div>
        <div className="filterField">
          <label className="filterLabel">전화번호</label>
          <input
            className="filterInput"
            type="text"
            value={filters.phone}
            onChange={(e) => handleFilterChange("phone", e.target.value)}
          />
        </div>
      </div>

      <div className="filterRow">
        {/* 셋째 줄: 생년월일, 회원 권한 */}
        <div className="filterField">
          <label className="filterLabel">생년월일</label>
          <input
            className="filterInput"
            type="text"
            value={filters.birth_date}
            onChange={(e) => handleFilterChange("birth_date", e.target.value)}
          />
        </div>
        <div className="filterField">
          <label className="filterLabel">회원 권한</label>
          <select
            className="filterSelect"
            value={filters.permission}
            onChange={(e) => handleFilterChange("permission", e.target.value)}
          >
            <option value="">선택하세요</option>
            <option value="1">Admin</option>
            <option value="2">Moderator</option>
            <option value="3">Contributor</option>
            <option value="4">Premium</option>
            <option value="5">Member</option>
          </select>
        </div>
      </div>

      <div className="filterRow">
        {/* 넷째 줄: 직업 */}
        <div className="filterField">
          <label className="filterLabel">직업</label>
          <select
            className="filterSelect"
            value={filters.jobtype}
            onChange={(e) => handleFilterChange("jobtype", e.target.value)}
          >
            <option value="">선택하세요</option>
            <option value="1">택시</option>
            <option value="2">배달</option>
            <option value="3">기타</option>
          </select>
        </div>
      </div>

      <div className="buttonGroup">
        <button className="searchButton" onClick={handleSearchClick}>
          검색
        </button>
        <button className="resetButton" onClick={handleResetFilters}>
          초기화
        </button>
      </div>

      <style jsx>{`
        .searchBox {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin: 20px 0;
          background-color: #f7f7f7;
          padding: 16px;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .filterRow {
          display: flex;
          gap: 16px;
        }

        .filterField {
          display: flex;
          flex-direction: column;
          flex: 1;
        }

        .filterLabel {
          margin-bottom: 8px;
          font-size: 14px;
          font-weight: bold;
          color: #333;
        }

        .filterInput,
        .filterSelect {
          padding: 8px;
          font-size: 14px;
          border: 1px solid #ccc;
          border-radius: 4px;
          width: 100%;
          box-sizing: border-box;
        }

        .buttonGroup {
          display: flex;
          gap: 10px;
          margin-top: 20px;
          justify-content: center;
          width: 100%;
        }

        .searchButton,
        .resetButton {
          padding: 10px 20px;
          font-size: 14px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          background-color: #3c5997;
          color: #fff;
          transition: background-color 0.3s ease;
        }

        .searchButton:hover,
        .resetButton:hover {
          background-color: #2c4372;
        }

        .resetButton {
          background-color: #e74c3c;
        }

        .resetButton:hover {
          background-color: #c0392b;
        }

        @media (max-width: 768px) {
          .filterRow {
            flex-direction: column;
          }
          .searchBox {
            gap: 4px;
            padding: 12px;
          }

          .filterRow {
            gap: 6px;
          }

          .filterLabel {
            margin-bottom: 8px;
            font-size: 12px;
            font-weight: bold;
            color: #333;
          }

          .filterInput,
          .filterSelect {
            padding: 8px;
            font-size: 11px;
            border: 1px solid #ccc;
            border-radius: 4px;
            width: 100%;
            box-sizing: border-box;
          }

          .buttonGroup {
            display: flex;
            gap: 10px;
            margin-top: 10px;
            justify-content: center;
            width: 100%;
          }

          .searchButton,
          .resetButton {
            padding: 6px 12px;
            font-size: 12px;
          }
        }
      `}</style>
    </div>
  );
};

export default SearchBox;
