import React, { Component, useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import { ko } from "date-fns/locale";
import "react-datepicker/dist/react-datepicker.css";
import "./components.scss";

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
    </div>
  );
};

export default Calendar;
