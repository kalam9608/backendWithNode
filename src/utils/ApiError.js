class ApiError extends Error {
  constructor(
    statusCode,
    mesaage = "somethig went wrong",
    errors = [],
    stack = "",
  ) {
    super(mesaage);
    this.statusCode = statusCode;
    this.message = mesaage;
    this.data = null;
    this.success = false;
    this.errors = errors;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.cunstructor);
    }
  }
}

export {ApiError}