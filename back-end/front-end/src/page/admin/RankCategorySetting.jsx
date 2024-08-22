import { useState, useEffect } from "react";
import axios from "axios";

const RankCategorySetting = () => {
  const [categories, setCategories] = useState([]);
  const [editMode, setEditMode] = useState(null);
  const [editedCategory, setEditedCategory] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("/api/rank/list");
        setCategories(response.data);
      } catch (error) {
        console.error("Failed to fetch categories", error);
        setError("카테고리를 불러오는데 실패했습니다.");
      }
    };

    fetchCategories();
  }, []);

  const updateCategory = async (id) => {
    if ([1, 2, 3].includes(editedCategory.show_number)) {
      const isPositionUsed = categories.some(
        (cat) => cat.id !== id && cat.show_number === editedCategory.show_number
      );
      if (isPositionUsed) {
        alert("선택한 위치는 이미 다른 카테고리에서 사용 중입니다.");
        return;
      }
    }

    try {
      setLoading(true);
      const response = await axios.put(`/api/rank/list/${id}`, editedCategory);
      setCategories(
        categories.map((cat) => (cat.id === id ? response.data : cat))
      );
      setEditMode(null);
    } catch (error) {
      console.error("카테고리 업데이트 중 오류가 발생했습니다.", error);
      setError("카테고리 업데이트 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const enterEditMode = (id) => {
    setEditMode(id);
    const category = categories.find((cat) => cat.id === id);
    setEditedCategory(category);
  };

  const handleCategoryNameChange = (e) => {
    setEditedCategory({ ...editedCategory, name: e.target.value });
  };

  const handleShowNumberChange = (e) => {
    setEditedCategory({
      ...editedCategory,
      show_number: parseInt(e.target.value),
    });
  };

  const getFilterLabel = (filterNumber) => {
    const filters = { 1: "직종 필터", 2: "연료 필터", 3: "차종 필터" };
    return filters[filterNumber] || "없음";
  };

  const getPositionLabel = (showNumber) => {
    const positions = { 0: "숨김", 1: "좌측", 2: "중앙", 3: "우측" };
    return positions[showNumber] || "숨김";
  };

  return (
    <div className="categorySettings">
      <h4>카테고리 관리 및 설정</h4>
      <table className="category-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>카테고리 이름</th>
            <th>상태</th>
            <th>필터</th>
            <th>작업</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((cat) => (
            <tr
              key={cat.id}
              className={cat.show_number === 0 ? "hidden-category" : ""}
            >
              <td>{cat.id}</td>
              <td>
                {editMode === cat.id ? (
                  <input
                    type="text"
                    value={editedCategory.name}
                    onChange={handleCategoryNameChange}
                  />
                ) : (
                  cat.name
                )}
              </td>
              <td>
                {editMode === cat.id ? (
                  <select
                    value={editedCategory.show_number}
                    onChange={handleShowNumberChange}
                  >
                    <option value="0">숨김</option>
                    <option value="1">좌측</option>
                    <option value="2">중앙</option>
                    <option value="3">우측</option>
                  </select>
                ) : (
                  getPositionLabel(cat.show_number)
                )}
              </td>
              <td>{getFilterLabel(cat.filter_number)}</td>
              <td>
                {editMode === cat.id ? (
                  <>
                    <button
                      className="save"
                      onClick={() => updateCategory(cat.id)}
                    >
                      저장
                    </button>
                    <button
                      className="cancel"
                      onClick={() => setEditMode(null)}
                    >
                      취소
                    </button>
                  </>
                ) : (
                  <button
                    className="edit"
                    onClick={() => enterEditMode(cat.id)}
                  >
                    수정
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <style jsx>{`
        .categorySettings {
          margin: 20px 0;
          border-radius: 8px;

          h4 {
            font-size: 16px;
            margin-bottom: 15px;
            color: #333;
          }

          .category-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
            tr {
              text-align: center;
              font-size: 14px;
              background-color: #fff;
              line-height: 25px;
              /* 숨김 상태인 카테고리에 대한 스타일 */
              &.hidden-category {
                background-color: #f0f0f0;

                td,
                p {
                  color: #888;
                }
              }
              th,
              td {
                border: 1px solid #ddd;
                font-size: 14px;
              }
              th {
                background-color: #f4f4f4;
                padding: 10px;
              }
              td {
                padding: 5px;
              }
            }
          }
          /*---------------------테이블 안 버튼 설정---------------------*/
          .category-table button {
            padding: 5px 10px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
            transition: background-color 0.3s;
            &:nth-of-type(even) {
              margin-left: 5px;
            }
          }

          .category-table button.edit {
            background-color: #2196f3;
            color: white;
          }
          .category-table button.delete {
            background-color: #f44336;
            color: white;
          }
          .category-table button.delete:hover {
            background-color: #d32f2f;
          }
          .category-table button.edit:hover {
            background-color: #1976d2;
          }

          .category-table button.save {
            background-color: #4caf50;
            color: white;
          }

          .category-table button.save:hover {
            background-color: #45a049;
          }

          .category-table button.cancel {
            background-color: #f44336;
            color: white;
          }

          .category-table button.cancel:hover {
            background-color: #d32f2f;
          }

          /*---------------------카테고리 추가---------------------*/
          .add-category {
            width: 100%;
            display: flex;
            justify-content: flex-end;
            margin-top: 10px;

            input {
              padding: 8px;
              font-size: 14px;
              margin-right: 10px;
              border: 1px solid #ccc;
              border-radius: 4px;
            }
            button {
              padding: 5px 10px;
              border: none;
              border-radius: 4px;
              cursor: pointer;
              font-size: 14px;
              background-color: #4caf50;
              color: white;
              transition: background-color 0.3s;
              &:hover {
                background-color: #45a049;
              }
            }
          }
        }
      `}</style>
    </div>
  );
};

export default RankCategorySetting;
