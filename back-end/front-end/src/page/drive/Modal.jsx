import "./drive.scss";

const Modal = ({
  showModal,
  closeModal,
  handlePrevClick,
  number,
  title,
  content,
}) => {
  return (
    <div className="NodriveModal">
      <div className="modal-inner">
        <div className="modal-header">
          {/* number가 1보다 클 때만 ← 버튼을 보여줌 */}
          {number > 1 && (
            <span className="prev-arrow" onClick={handlePrevClick}>
              &#x2190;
            </span>
          )}
          <h3>
            <span>{number}</span>
            {title}
          </h3>
          <span className="close" onClick={closeModal}>
            &times;
          </span>
        </div>
        <div className="modal-content">{content}</div>
        <style jsx>
          {`
            .NodriveModal {
              display: ${showModal ? "block" : "none"};
              position: fixed;
              z-index: 1;
              left: 0;
              top: 0;
              width: 100%;
              height: 100%;
              overflow: auto;
              background-color: rgba(0, 0, 0, 0.4);
              .modal-inner {
                width: 80%;
                max-width: 600px;
                position: relative;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background-color: #fefefe;
                border: 1px solid #888;
                border-radius: 10px;
                overflow: hidden;
              }
              .modal-header {
                display: flex;
                align-items: center;
                justify-content: center;
                background-color: #f3f4fb;
                padding: 10px 20px;
                h3 {
                  width: 100%;
                  text-align: center;
                  color: #4c4c4c;
                  font-size: 16px;
                  span {
                    display: inline-block;
                    background-color: #05aced;
                    width: 25px;
                    height: 25px;
                    margin-right: 3px;
                    border-radius: 100%;
                    color: white;
                  }
                }
                .prev-arrow {
                  margin-right: auto;
                  color: #05aced;
                  font-size: 20px;
                  cursor: pointer;
                }
                .close {
                  margin-left: auto;
                  color: #aaa;
                  font-size: 28px;
                  font-weight: bold;
                  cursor: pointer;
                  @media (max-width: 768px) {
                    font-size: 25px;
                  }
                }

                .close:hover,
                .close:focus {
                  color: black;
                  text-decoration: none;
                  cursor: pointer;
                }
              }
              .modal-content {
                width: 100%;
                padding: 20px;
              }
            }
          `}
        </style>
      </div>
    </div>
  );
};

export default Modal;
