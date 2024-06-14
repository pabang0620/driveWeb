import React from "react";

function Home() {
  return (
    <div className="home-container">
      <h1>Welcome to My Website</h1>
      <p>
        This is the home page. Here you can find various resources and links to
        other sections of the website.
      </p>

      <style jsx>{`
        .home-container {
          padding: 20px;
          text-align: center;
        }
        h1 {
          color: #3c5997;
        }
        p {
          color: #7388b6;
        }
      `}</style>
    </div>
  );
}

export default Home;
