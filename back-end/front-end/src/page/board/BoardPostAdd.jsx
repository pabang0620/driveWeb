import React, { useState, useRef, useEffect } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import axios from "axios";
import TitleBox from "../../components/TitleBox";
import { useLocation, useNavigate, useParams } from "react-router-dom";

const BoardPostAdd = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const quillRef = useRef(null);

  useEffect(() => {
    const quill = new Quill(quillRef.current, {
      theme: "snow",
      modules: {
        toolbar: {
          container: [
            [{ header: "1" }, { header: "2" }, { font: [] }],
            [{ size: [] }],
            ["bold", "italic", "underline", "strike", "blockquote"],
            [{ list: "ordered" }, { list: "bullet" }],
            ["link", "image", "video"],
            ["clean"],
            ["code-block"],
          ],
          handlers: {
            image: imageHandler,
          },
        },
      },
    });

    quill.on("text-change", () => {
      setContent(quill.root.innerHTML);
    });

    quillRef.current = quill;

    if (id) {
      fetchPostData(id);
    }
  }, [id]);
  // id 가 있을때만 불러옴
  const fetchPostData = async (postId) => {
    try {
      const response = await axios.get(`/api/post/${postId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const postData = response.data;
      setTitle(postData.title);
      quillRef.current.root.innerHTML = postData.content;
      setContent(postData.content);
    } catch (error) {
      console.error("게시글 데이터를 불러오는 중 오류가 발생했습니다.", error);
      alert("게시글 데이터를 불러오는 중 오류가 발생했습니다.");
    }
  };

  const imageHandler = () => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();
    input.onchange = async () => {
      const file = input.files[0];
      if (file) {
        const formData = new FormData();
        formData.append("image", file);

        const reader = new FileReader();
        reader.onload = (e) => {
          const quill = quillRef.current;
          const range = quill.getSelection();
          quill.insertEmbed(range.index, "image", e.target.result);
        };
        reader.readAsDataURL(file);
      }
    };
  };

  const handleSave = async () => {
    try {
      const postData = {
        title,
        content: quillRef.current.root.innerHTML,
        boardId: id,
      };

      let response;
      if (id) {
        response = await axios.put(`/api/post/${id}`, postData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
      } else {
        response = await axios.post("/api/post", postData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
      }

      if (response.status === 201 || response.status === 200) {
        alert("게시글이 성공적으로 저장되었습니다.");
        navigate(`/board/post/${id}`);
      }
    } catch (error) {
      console.error("게시글 저장 중 오류가 발생했습니다.", error);
      alert("게시글 저장 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="BoardPostAdd">
      <TitleBox title="게시판" subtitle={id ? "글 수정" : "글쓰기"} />
      <div className="boardPostHeader">
        <button
          className="writeButton"
          onClick={() => navigate(`/board/list/${id || ""}`)}
        >
          목록
        </button>
        <button className="writeButton" onClick={handleSave}>
          저장
        </button>
      </div>
      <section className="BoardPostSection">
        <div className="BoardPostHeader">
          <input
            type="text"
            className="PostTitle"
            id="title"
            value={title}
            placeholder="제목을 입력해주세요"
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="EditorWrapper">
          <div ref={quillRef} />
        </div>
      </section>

      <style jsx>{`
        .BoardPostAdd {
          width: 70%;
          max-width: 1200px;
          margin: 0 auto;
          padding: 100px 0 200px;
        }
        .BoardPostSection {
          border: 1px solid #999;
          border-radius: 10px;
          padding: 30px 30px 100px;
        }
        .boardPostHeader {
          display: flex;
          justify-content: flex-end;
          align-items: center;
          padding: 10px 0px 10px 20px;
        }
        .writeButton {
          padding: 8px 16px;
          background-color: #05aced;
          color: #fff;
          border: none;
          border-radius: 5px;
          margin: 0 0 0 10px;
          cursor: pointer;
          font-size: 16px;
          font-weight: bold;
          outline: none;
        }
        .PostTitle {
          height: 75px;
          font-size: 32px;
          border: none;
          padding: 0 0 0 25px;
        }
        .BoardPostHeader {
          padding-bottom: 10px;
          border-bottom: 1px solid #d9d9d9;
          display: flex;
          flex-direction: row;
          justify-content: space-between;
        }
        .EditorWrapper {
          margin-top: 20px;
          height: 700px; /* 높이 600픽셀로 설정 */
        }

        .EditorWrapper .ql-container {
          height: 100%; /* 부모 높이에 맞게 설정 */
        }
      `}</style>
    </div>
  );
};

export default BoardPostAdd;
