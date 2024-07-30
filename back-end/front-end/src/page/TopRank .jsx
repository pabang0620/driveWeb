import React, { useState, useEffect } from "react";
import axios from "axios";
import TitleBox from "../components/TitleBox";
import PostBox from "./PostBox"; // 새로 만든 PostBox 컴포넌트를 사용합니다.

const TopRank = () => {
  const [topViewedPosts, setTopViewedPosts] = useState([]);
  const [topLikedPosts, setTopLikedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTopRank = async () => {
      try {
        const response = await axios.get("/api/rank/topRank");
        setTopViewedPosts(response.data.topViewedPosts);
        setTopLikedPosts(response.data.topLikedPosts);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchTopRank();
  }, []);

  const formatRelativeDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffHours = (now - date) / (1000 * 60 * 60);

    if (diffHours < 1) {
      return `${Math.floor(diffHours * 60)}분 전`;
    } else if (diffHours < 24) {
      return `${Math.floor(diffHours)}시간 전`;
    } else if (diffHours < 48) {
      return "1일 전";
    } else if (diffHours < 72) {
      return "2일 전";
    } else if (diffHours < 168) {
      return `${Math.floor(diffHours / 24)}일 전`;
    } else {
      return date.toLocaleDateString();
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="topRank">
      <TitleBox title="인기 게시글" subtitle=" 전체" />
      <div className="topRankSection">
        <h2>Top Viewed Posts</h2>
        <div className="postList">
          {topViewedPosts.map((post) => (
            <PostBox
              key={post.id}
              id={post.id}
              postTitle={post.title}
              commentsCount={post._count.comments}
              date={formatRelativeDate(post.createdAt)}
            />
          ))}
        </div>
      </div>
      <div className="topRankSection">
        <h2>Top Liked Posts</h2>
        <div className="postList">
          {topLikedPosts.map((post) => (
            <PostBox
              key={post.id}
              id={post.id}
              postTitle={post.title}
              commentsCount={post._count.comments}
              date={formatRelativeDate(post.createdAt)}
            />
          ))}
        </div>
      </div>
      <style jsx>{`
        .topRank {
          width: 70%;
          max-width: 1200px;
          margin: 0 auto;
          padding: 100px 0;
        }
        .topRankSection {
          margin: 50px 0;
        }
        .postList {
          display: flex;
          flex-direction: row;
          flex-wrap: wrap;
          gap: 20px;
        }
      `}</style>
    </div>
  );
};

export default TopRank;
