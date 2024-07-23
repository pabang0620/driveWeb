// 휴대폰 번호 유효성 검사
export const validatePhone = (phone) => {
  const regex = /^\d{3}-\d{3,4}-\d{4}$/;
  return regex.test(phone);
};

// 이메일 유효성 검사
export const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

// 날짜 유효성 검사 (YYYY-MM-DD 형식)
// 날짜 유효성 검사 (YYYY-MM-DD 형식)
export const validateDate = (date) => {
  let formattedDate = date;

  // YYYYMMDD 형식일 경우 YYYY-MM-DD 형식으로 변환
  if (/^\d{8}$/.test(date)) {
    formattedDate = date.replace(/(\d{4})(\d{2})(\d{2})/, "$1-$2-$3");
  }

  // YYYY-MM-DD 형식을 검사하는 정규 표현식
  const regex = /^\d{4}-\d{2}-\d{2}$/;

  // 정규 표현식과 일치하는지 확인
  if (!regex.test(formattedDate)) {
    return false;
  }

  // Date 객체를 이용해 유효한 날짜인지 확인
  const parsedDate = new Date(formattedDate);
  const year = parsedDate.getFullYear();
  const month = parsedDate.getMonth() + 1; // getMonth()는 0부터 시작하므로 1을 더함
  const day = parsedDate.getDate();

  // 입력된 값이 실제 유효한 날짜인지 확인
  const [inputYear, inputMonth, inputDay] = formattedDate
    .split("-")
    .map(Number);
  const isValidDate =
    inputYear === year && inputMonth === month && inputDay === day;

  return isValidDate ? formattedDate : false;
};
