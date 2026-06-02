class ApiError extends Error {
    statusCode: number;
    success: boolean = false;
    errors: unknown[] = [];
    data: null = null;

    constructor(
        statusCode: number = 500,
        message: string = "Something went wrong",
        errors: unknown[] = []
    ) {
        super(message);
        this.statusCode = statusCode;
        this.success = false;
        this.errors = errors;
        this.data = null;
        this.name = "ApiError";
    }
}

export default ApiError;