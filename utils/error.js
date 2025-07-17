class ApiError extends Error {
  constructor(message, code,stack ){
    super(message)
    this.code = code
    this.success = (code >= 400 && code < 500) ? "Error" : "Fail";
    this.stack = stack
  }
}

export default  new ApiError()
