import React, { useState, useRef, useEffect } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import axios from "axios";
import TitleBox from "../../components/TitleBox";
import { useLocation, useNavigate } from "react-router-dom";

const BoardPostAdd = () => {
  const location = useLocation();
  const navigate = useNavigate();
  // const { boardId } = location.state || {};
  const boardId = 1;
  const [title, setTitle] = useState("");
  const [content, setContent] = useState(""); // content 상태 추가
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
            image: imageHandler, // 이미지 핸들러 추가
          },
        },
      },
    });

    quill.on("text-change", () => {
      setContent(quill.root.innerHTML);
    });

    quillRef.current = quill;
  }, []);

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

        // 로컬 파일 미리보기
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
      const response = await axios.post(
        "/api/post",
        {
          title,
          content: quillRef.current.root.innerHTML, // Quill 에디터의 내용 가져오기
          boardId,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.status === 201) {
        alert("게시글이 성공적으로 저장되었습니다.");
        navigate(`/board/${boardId}`);
      }
    } catch (error) {
      console.error("게시글 저장 중 오류가 발생했습니다.", error);
      alert("게시글 저장 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="BoardPostAdd">
      <TitleBox title="게시판" subtitle="글쓰기" />
      <div className="boardPostHeader">
        <button
          className="writeButton"
          onClick={() => navigate(`/board/list/${boardId}`)}
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
          padding: 30px;
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
        }
      `}</style>
    </div>
  );
};

export default BoardPostAdd;
