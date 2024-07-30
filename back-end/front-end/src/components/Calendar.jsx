import React, { Component, useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import { ko } from "date-fns/locale";
import "react-datepicker/dist/react-datepicker.css";

const Calendar = ({
  dateRange,
  setDateRange,
  handleDateChange,
  setLoading,
  setError,
}) => {
  // startDate	Date?	시작날짜(기간이 아닐때는 이 값이 기본값이 됨)
  // endDate	Date?	종료날짜(기간선택일 때만 사용)
  // isClearable	bool?	초기화할 수 있도록 초기화 버튼을 추가하는지에 대한 여부
  // placeholderText	String?	값이 없을 때 가이드텍스트
  // minDate	Date?	선택할 수 있는 날짜의 최소값
  // maxDate	Date?	선택할 수 있는 날짜의 최대값
  // selectsRange	bool?	기간선택을 할지 안할지에 대한 여부
  // onChange	event?	선택한 날짜가 바뀌면 실행되는 콜백 함수(보통 여기에 setState 함수를 넣음)
  // excludeDates	[Date]	리스트에 들어있는 날짜들을 선택할 수 없도록 제외함
  //open 달력 항상 열어두기
  return (
    <div className="calendar_container">
      <DatePicker
        selectsRange={true}
        className="datepicker"
        locale={ko}
        dateFormat="yyyy년 MM월 dd일"
        selected={dateRange.startDate}
        startDate={dateRange.startDate}
        endDate={dateRange.endDate}
        // maxDate={new Date()}
        onChange={(update) => {
          handleDateChange({ startDate: update[0], endDate: update[1] });
        }}
        open={true}
      />
      <style jsx>{`
        .calendar_container {
          display: block;
          position: relative;
          display: flex;
          flex-direction: row;
          align-items: flex-start;
          justify-content: center;
          width: 50%;
          aspect-ratio: 1 / 1.05;
          /*------------- 상단 인풋 박스 -------------*/
          .react-datepicker-wrapper {
            width: 80%;
          }

          .datepicker {
            border: 1px solid #ddd;
            border-radius: 5px;
            padding: 10px;
            background-color: #fff;
            font-size: 14px;
            color: #333;
            width: 100%;
            text-align: center;
          }

          /*------------- 하단 달력 -------------*/
          .react-datepicker {
            width: 100%;
          }
          .react-datepicker-popper {
            position: static;
            transform: translate(0, 0);
            width: 80%;
            .react-datepicker__month-container {
              width: 100%;
              /*------------- 달력헤더 -------------*/
              .react-datepicker__header {
                background-color: #05aced; // 파란색 배경
                color: #fff; // 흰색 글자
              }
              .react-datepicker__year-read-view--down-arrow,
              .react-datepicker__month-read-view--down-arrow,
              .react-datepicker__month-year-read-view--down-arrow,
              .react-datepicker__navigation-icon::before {
                border-color: gold;
              }
              .react-datepicker__current-month {
                font-size: 16px;
                font-weight: 600;
                color: white;
                padding-bottom: 10px;
              }
              .react-datepicker__day-names {
                background-color: #69c2ef;
                .react-datepicker__day-name {
                  color: white;
                  width: 2.2rem;
                  line-height: 2.2rem;
                  text-align: center;
                  margin: 0.14rem;
                }
              }

              /*------------- 달력바디 -------------*/

              .react-datepicker__week {
                margin: 0;
              }
              .react-datepicker__day {
                border-radius: 20%; //선택된 날짜
              }
              .react-datepicker__day,
              .react-datepicker__day--030,
              .react-datepicker__day--weekend,
              .react-datepicker__day--outside-month {
                width: 2.2rem;
                line-height: 2.2rem;
                text-align: center;
                margin: 0.14rem;
              }
              .react-datepicker__day:hover {
                background-color: #e6f0ff; // 마우스 오버 시 밝은 파란색
              }

              .react-datepicker__day--disabled {
                color: #ccc; // 비활성화된 날짜 회색
              }

              .react-datepicker__navigation--next,
              .react-datepicker__navigation--previous {
                color: white; // 화살표 색상 파란색

                &::before {
                  color: white; // 화살표 아이콘 파란색
                }
              }
            }
          }
        }
      `}</style>
    </div>
  );
};

export default Calendar;
