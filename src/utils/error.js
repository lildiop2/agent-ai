import HttpStatus from "./httpStatus.js";
import { Whatsapp } from "@wppconnect-team/wppconnect";

class IllegalArgumentException extends Error {
    constructor(message) {
        super(message);
    }
}

class HttpError extends Error {
    constructor(statusCode, message) {
        super(message);
        this.statusCode = statusCode;
    }
}

class ResourceNotFoundError extends HttpError {
    constructor(message) {
        super(HttpStatus.NOT_FOUND, message || "Resource not found");
    }
}

class ValidationError extends HttpError {
    constructor(message, errors) {
        super(HttpStatus.BAD_REQUEST, message || "Validation failed");
        this.errors = errors;
    }
}

class WhatsappError extends HttpError {
    constructor(message = "Whatsapp error", status = HttpStatus.BAD_REQUEST) {
        super(status, message);
    }
}

class InternalServerError extends HttpError {
    constructor(message) {
        super(
            HttpStatus.INTERNAL_SERVER_ERROR,
            message || "Internal server error"
        );
    }
}
class UnauthorizedError extends HttpError {
    constructor(message) {
        super(
            HttpStatus.UNAUTHORIZED,
            message || "You are not authorized to access this resource."
        );
    }
}
class NotFoundError extends HttpError {
    constructor(message) {
        super(
            HttpStatus.NOT_FOUND,
            message || "The resource you requested could not be found."
        );
    }
}
class ForbiddenError extends HttpError {
    constructor(message) {
        super(
            HttpStatus.FORBIDDEN,
            message || "You don't have permission to access this resource."
        );
    }
}
class ConflictError extends HttpError {
    constructor(message) {
        super(
            HttpStatus.CONFLICT,
            message || "This resource have already on the system"
        );
    }
}

class BadRequestError extends HttpError {
    constructor(message) {
        super(HttpStatus.BAD_REQUEST, message || "Bad request");
    }
}
class UnprocessableEntityError extends HttpError {
    constructor(message) {
        super(
            HttpStatus.UNPROCESSABLE_ENTITY,
            message || "Unprocessable entity"
        );
    }
}
class TooManyRequestsError extends HttpError {
    constructor(message) {
        super(HttpStatus.TOO_MANY_REQUESTS, message || "Too many requests");
    }
}
export {
    ConflictError,
    ForbiddenError,
    IllegalArgumentException,
    InternalServerError,
    NotFoundError,
    ResourceNotFoundError,
    UnauthorizedError,
    ValidationError,
    BadRequestError,
    UnprocessableEntityError,
    TooManyRequestsError,
    WhatsappError
};
