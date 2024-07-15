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
