class ApiResponse<T> {
  statusCode: number;
  data: T;
  message: string;
  success: boolean;

  constructor(statusCode: number = 200, data: T, message = "Success") {
    this.statusCode = statusCode;
    this.data = data;
    this.message = message;
    this.success = statusCode < 400;
  }
}

export default ApiResponse;