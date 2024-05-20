export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhoneNumber = (phoneNumber) => {
  const phoneRegex = /^\+?1?[-.\s()]?\(?\d{3}\)?[-.\s()]?\d{3}[-.\s()]?\d{4}$/;
  return phoneRegex.test(phoneNumber);
};

export const normalizePhoneNumber = (phoneNumber) => {
  const digits = phoneNumber.replace(/\D/g, "");

  let defaultCountryCode = "+1";
  let areaCode, centralOfficeCode, lineNumber;

  if (digits.length === 10) {
    areaCode = digits.slice(0, 3);
    centralOfficeCode = digits.slice(3, 6);
    lineNumber = digits.slice(6);
  } else if (digits.length === 11 && digits[0] === "1") {
    defaultCountryCode = `+${digits[0]}`;
    areaCode = digits.slice(1, 4);
    centralOfficeCode = digits.slice(4, 7);
    lineNumber = digits.slice(7);
  } else {
    return "Invalid number format";
  }

  // Format into standard style +1 (123)-456-7890
  return `${defaultCountryCode} (${areaCode})-${centralOfficeCode}-${lineNumber}`;
};
