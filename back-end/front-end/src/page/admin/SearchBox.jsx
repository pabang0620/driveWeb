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
              field.type === "dateRange" ? "dateRange_filter_container" : ""
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
                ~
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

        <div className="searchBtnBox">
          <button className="search_button" onClick={handleSearchClick}>
            검색
          </button>
          <button className="reset_button" onClick={handleResetFilters}>
            필터 초기화
          </button>
        </div>
      </div>
      <style jsx>{`
        .searchBoxContainer {
          .searchBox {
            border: 1px solid #ddd;
            padding: 2%;
            margin: 20px 0 5px 0;
            display: flex;
            margin-top: 10px;
            gap: 10px 30px;
            flex-wrap: wrap;

            label {
              font-size: 14px;
              margin-right: 5px;
              min-width: 65px;
            }

            input,
            select {
              padding: 3px 5px;
              font-size: 14px;
            }

            .filter_container {
              display: flex;
              align-items: center;
              &.search_container {
                width: 100%;
                input {
                  width: 100%;
                }
              }

              &.datefilter_containter {
                width: 100%;
                input:nth-of-type(1) {
                  margin-right: 10px;
                }
                input:nth-of-type(2) {
                  margin-left: 10px;
                }
              }
            }
          }

          .searchBtnBox {
            width: 100%;
            display: flex;
            justify-content: flex-end;
            gap: 5px;
            button {
              padding: 5px 10px;
              border: none;
              border-radius: 5px;
              cursor: pointer;
              font-size: 12px;
              transition: background-color 0.3s;
            }
            .search_button {
              color: white;
              background-color: #3c5997;
              &:hover {
                background-color: #7388b6;
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

/*------------------검색박스------------------*/
