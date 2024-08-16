const SearchBox = ({
  filters,
  filterFields,
  categories,
  handleFilterChange,
  handleSearchClick,
  handleResetFilters,
}) => {
  return (
    <div className="searchBoxContainer">
      <div className="searchBox">
        {filterFields.map((field) => (
          <div
            key={field.id}
            className={`filter_container ${
              field.id === "dateRangeFilter"
                ? "dateRange_filter_container"
                : field.id === "searchTerm"
                ? "search_container"
                : ""
            }`}
          >
            <label htmlFor={field.id}>{field.label}</label>

            {field.type === "select" ? (
              <select
                id={field.id}
                value={filters[field.id]}
                onChange={(e) => handleFilterChange(field.id, e.target.value)}
              >
                {field.options.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            ) : field.type === "dateRange" ? (
              <>
                <input
                  id={field.startDateKey}
                  type="date"
                  value={filters[field.startDateKey] || ""}
                  onChange={(e) =>
                    handleFilterChange(field.startDateKey, e.target.value)
                  }
                />
                {` `}~{` `}
                <input
                  id={field.endDateKey}
                  type="date"
                  value={filters[field.endDateKey] || ""}
                  onChange={(e) =>
                    handleFilterChange(field.endDateKey, e.target.value)
                  }
                />
              </>
            ) : (
              <input
                id={field.id}
                type={field.type}
                value={filters[field.id]}
                onChange={(e) => handleFilterChange(field.id, e.target.value)}
              />
            )}
          </div>
        ))}
      </div>
      <div className="searchBtnBox">
        <button className="search_button" onClick={handleSearchClick}>
          검색
        </button>
        <button className="reset_button" onClick={handleResetFilters}>
          초기화
        </button>
      </div>
      <style jsx>{`
        .searchBoxContainer {
          .searchBox {
            border: 1px solid #ddd;
            padding: 2%;
            display: flex;
            margin-top: 10px;
            gap: 10px 30px;
            flex-wrap: wrap;

            .filter_container {
              display: flex;
              align-items: center;
              height: auto; /* 필요에 따라 조정 */

              &.search_container,
              &.datefilter_containter {
                width: 45%;
                input {
                  width: 80%;
                }
              }

              label {
                font-size: 14px;
                margin-right: 10px;
              }

              input,
              select {
                padding: 3px 5px;
                font-size: 14px;
              }
            }
          }
          /*-------------------------검색 초기화 버튼-------------- */

          .searchBtnBox {
            width: 100%;
            display: flex;
            justify-content: flex-end;
            gap: 5px;
            margin-top: 10px;
            button {
              padding: 5px 10px;
              border: none;
              border-radius: 4px;
              cursor: pointer;
              font-size: 14px;
              transition: background-color 0.3s;
            }
            .search_button {
              color: white;
              background-color: #2196f3;
              color: white;
              &:hover {
                background-color: #1976d2;
              }
            }
            .reset_button {
              background-color: #e0e0e0; /* 회색 계열 배경색 */
              color: #333; /* 어두운 텍스트 색상 */
              &:hover {
                background-color: #b0b0b0; /* 호버 시 조금 어두운 회색 */
              }
            }
          }
        }
      `}</style>
    </div>
  );
};
export default SearchBox;
