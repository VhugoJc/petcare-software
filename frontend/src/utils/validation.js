const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^[\d\s\-\+\(\)]*$/;

export const isValidEmail = (email) => EMAIL_REGEX.test(email);

export const isValidPhone = (phone) => phone === '' || PHONE_REGEX.test(phone);

export const validateUserData = (userData) => {
  const errors = {};

  if (!userData.name?.trim()) {
    errors.name = 'Name is required';
  }

  if (!userData.email?.trim()) {
    errors.email = 'Email is required';
  } else if (!isValidEmail(userData.email)) {
    errors.email = 'Invalid email format';
  }

  if (userData.phone && !isValidPhone(userData.phone)) {
    errors.phone = 'Invalid phone format';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
