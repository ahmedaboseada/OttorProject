export const validation = (schema) => {
    return (req, res, next) => {
        const dataToValidate = {
            body: req.body,
            query: req.query,
            params: req.params,
        };

        const { error } = schema.validate(dataToValidate, {
            abortEarly: false, // collect all errors
            allowUnknown: true, // allow additional fields (optional)
            stripUnknown: true, // remove unknown fields (optional)
        });

        if (error) {
            const resultErrors = error.details.map(detail => detail.message);
            return res.status(400).json({
                message: "Validation Error",
                errors: resultErrors,
            });
        }

        next();
    };
};
