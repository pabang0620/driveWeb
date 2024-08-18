import { useState, useEffect } from "react";
import axios from "axios";

const CategorySetting = ({ categories, setCategories }) => {
  const [newCategory, setNewCategory] = useState("");
  const [editMode, setEditMode] = useState(null);
  const [editedCategory, setEditedCategory] = useState({});

  // API에서 카테고리 목록을 가져오는 함수
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("/api/admin/boards");
        setCategories(response.data);
      } catch (error) {
        console.error("Failed to fetch categories", error);
      }
    };

    fetchCategories();
  }, [setCategories]);

  const addCategory = async (name) => {
    try {
      const response = await axios.post("/api/admin/boards", {
        name,
        displayed: true,
      });
      setCategories([...categories, response.data]);
      setNewCategory("");
    } catch (error) {
      console.error("Failed to add category", error);
    }
  };

  const updateCategory = async (id) => {
    try {
      const response = await axios.put(`/api/admin/boards/${id}`, {
        ...editedCategory,
      });
      setCategories(
        categories.map((cat) => (cat.id === id ? response.data : cat))
      );
      setEditMode(null);
    } catch (error) {
      console.error("Failed to update category", error);
    }
  };

  const deleteCategory = async (id) => {
    const confirmed = window.confirm(
      "삭제 시 모든 게시물도 삭제됩니다. 삭제하시겠습니까?"
    );

    if (confirmed) {
      try {
        await axios.delete(`/api/admin/boards/${id}`);
        setCategories(categories.filter((cat) => cat.id !== id));
      } catch (error) {
        console.error("Failed to delete category", error);
      }
    }
  };

  const enterEditMode = (id) => {
    setEditMode(id);
    const category = categories.find((cat) => cat.id === id);
    setEditedCategory(category);
  };

  const handleCategoryNameChange = (e) => {
    setEditedCategory({
      ...editedCategory,
      name: e.target.value,
    });
  };

  const handleVisibilityChange = (e) => {
    setEditedCategory({
      ...editedCategory,
      displayed: e.target.value === "visible",
    });
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
            <th>작업</th>
          </tr>
        </thead>
        <tbody>
          {categories && categories.length > 0 ? (
            categories.map((cat) => (
              <tr
                key={cat.id}
                className={!cat.displayed ? "hidden-category" : ""}
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
                      value={editedCategory.displayed ? "visible" : "hidden"}
                      onChange={handleVisibilityChange}
                    >
                      <option value="visible">표시됨</option>
                      <option value="hidden">숨김</option>
                    </select>
                  ) : (
                    <p>{cat.displayed ? "표시됨" : "숨김"}</p>
                  )}
                </td>
                <td className="tdBtn">
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
                    <>
                      <button
                        className="edit"
                        onClick={() => enterEditMode(cat.id)}
                      >
                        수정
                      </button>
                      <button
                        className="delete"
                        onClick={() => deleteCategory(cat.id)}
                      >
                        삭제
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4">카테고리가 없습니다.</td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="add-category">
        <input
          type="text"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          placeholder="새 카테고리 이름"
        />
        <button onClick={() => addCategory(newCategory)}>추가</button>
      </div>
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
                select {
                  font-size: 14px;
                  padding: 3% 10%;
                  display: inline;
                }
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

          /*---------------------카터고리 추가---------------------*/
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
export default CategorySetting;
