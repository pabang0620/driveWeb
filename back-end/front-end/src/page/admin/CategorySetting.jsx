import { useState } from "react";

const CategorySetting = ({ categories, setCategories }) => {
  const [newCategory, setNewCategory] = useState("");
  const [editMode, setEditMode] = useState(null);
  const [editedCategory, setEditedCategory] = useState({});

  const addCategory = (name) => {
    setCategories([
      ...categories,
      { id: categories.length + 1, name, visible: true },
    ]);
    setNewCategory("");
  };

  const toggleCategoryVisibility = (id) => {
    setCategories(
      categories.map((cat) =>
        cat.id === id ? { ...cat, visible: !cat.visible } : cat
      )
    );
  };

  const removeCategory = (id) => {
    setCategories(categories.filter((cat) => cat.id !== id));
  };

  const updateCategory = (id, newName) => {
    setCategories(
      categories.map((cat) => (cat.id === id ? { ...cat, name: newName } : cat))
    );
  };

  const enterEditMode = (id) => {
    setEditMode(id);
    const category = categories.find((cat) => cat.id === id);
    setEditedCategory(category);
  };

  const saveCategory = () => {
    setCategories(
      categories.map((cat) =>
        cat.id === editedCategory.id ? editedCategory : cat
      )
    );
    setEditMode(null);
  };
  const handleNameChange = (id, e) => {
    updateCategory(id, e.target.textContent);
  };
  const handleVisibilityChange = (e) => {
    setEditedCategory({
      ...editedCategory,
      visible: e.target.value === "visible",
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
          {categories.map((cat) => (
            <tr key={cat.id}>
              <td>{cat.id}</td>
              <td>
                {editMode === cat.id ? (
                  <input
                    type="text"
                    value={editedCategory.name}
                    onChange={handleNameChange}
                    style={{ width: "100%" }}
                  />
                ) : (
                  cat.name
                )}
              </td>
              <td>
                {editMode === cat.id ? (
                  <select
                    value={editedCategory.visible ? "visible" : "hidden"}
                    onChange={handleVisibilityChange}
                  >
                    <option value="visible">표시됨</option>
                    <option value="hidden">숨김</option>
                  </select>
                ) : (
                  <span>{cat.visible ? "표시됨" : "숨김"}</span>
                )}
              </td>
              <td className="tdBtn">
                {editMode === cat.id ? (
                  <>
                    <button className="save" onClick={saveCategory}>
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
                      className="remove"
                      onClick={() => removeCategory(cat.id)}
                    >
                      삭제
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
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

              &:hover {
                background-color: #f9f9f9;
              }
              th,
              td {
                border: 1px solid #ddd;
                font-size: 14px;
                input[type="text"] {
                  border: none;
                  text-align: center;
                  font-size: 14px;
                  display: inline;
                  width: 100%;
                  box-sizing: border-box;
                }
                select {
                  font-size: 14px;
                  width: auto;
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

          .category-table button.remove {
            background-color: #f44336;
            color: white;
          }

          .category-table button.remove:hover {
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
