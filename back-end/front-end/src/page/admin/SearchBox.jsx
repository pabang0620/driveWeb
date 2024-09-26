import "./admin.scss";

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
    </div>
  );
};

export default SearchBox;
