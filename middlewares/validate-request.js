import { validationResult } from 'express-validator';

const validateRequest = (req, res, next) => {
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
        console.log("🔴 VALIDATION ERRORS FOUND:");
        console.log("Raw errors:", errors.array());
        
        const formattedErrors = errors.array().map(error => {
            return {
                type: "field",
                value: error.value || null,
                msg: error.msg || 'Validation error',
                path: error.path || error.param || 'unknown',
                location: error.location || 'body'
            };
        });
        
        return res.status(400).json({
            success: false,
            code: 400,
            error: formattedErrors
        });
    }
    
    next();
};

export default validateRequest;
