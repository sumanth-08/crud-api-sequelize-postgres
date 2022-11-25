module.exports.RESPONSE = {
  SUCCESS: {
    code: 200,
    message: "Everything worked as expected",
  },
  UNKNOWN_ERROR: {
    code: 500,
    message: "Something went wrong. Please try again later",
  },
  INVALID_ID: {
    code: 202,
    message: "Invalid given id",
  },
  REQUIRED: {
    code: 203,
    message: "All fields are required",
  },
  ALREADY_EXISTS: {
    code: 204,
    message: "User Already Exist. Please Login",
  },
  PASSWORD_LENGTH: {
    code: 205,
    message: "Password is week",
  },
  INVALID_TOKEN: {
    code: 401,
    message: "Invalid token",
  },
  USER_NOT_FOUND: {
    code: 400,
    message: "Please provide autherisation token",
  },
  INVALID_INPUT_FORMAT: {
    code: 210,
    message: "Invalid input format",
  },
  PHONE_NO_ALREADY_EXISTS: {
    code: 211,
    message: "Phone no. already exists",
  },
  INVALID_IMAGE: {
    code: 226,
    message: "JEG/PNG/JPEG/HEIC file are allwored",
  },
  FILE_TOO_LARGE: {
    code: 227,
    message: "File size should be in less then 2MB",
  },
  NOT_MATCH: {
    code: 228,
    message: "Email and password does'nt match",
  },
  IMAGE_REQUIRED: {
    code: 229,
    message: "Image is required!",
  },
  FILE_ERRROR: {
    code: 230,
    message: "JPG/PNG/HEIC images are within 2MB is needed",
  },
  EMAIL_ALREADY_EXISTS: {
    code: 211,
    message: "Email address already exists, try another",
  },
  NO_RESULT_FOUND: {
    code: 212,
    message: "No result found!",
  },
};
