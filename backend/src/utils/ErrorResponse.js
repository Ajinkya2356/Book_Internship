class ErrorResponse extends Error{
    constructor(message, statusCode){
        super(message);
        this.statusCode = statusCode;
        this.message=message;
        this.success=false;
    }
}
export default ErrorResponse;