import Joi from "joi"

// Create/Update product validation schema
export const productSchema = Joi.object({
  name: Joi.string().max(100).required().messages({
    "string.max": "Product name cannot exceed 100 characters",
    "any.required": "Product name is required",
  }),
  description: Joi.string().max(1000).required().messages({
    "string.max": "Description cannot exceed 1000 characters",
    "any.required": "Product description is required",
  }),
  price: Joi.number().min(0).required().messages({
    "number.min": "Price must be positive",
    "any.required": "Price is required",
  }),
  stock: Joi.number().min(0).required().messages({
    "number.min": "Stock cannot be negative",
    "any.required": "Stock is required",
  }),
  tags: Joi.array().items(Joi.string()).default([]),
})

// Update schema (all fields optional)
export const productUpdateSchema = Joi.object({
  name: Joi.string().max(100),
  description: Joi.string().max(1000),
  price: Joi.number().min(0),
  stock: Joi.number().min(0),
  tags: Joi.array().items(Joi.string()),
}).min(1) // At least one field required

// Validation middleware
export const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false })

    if (error) {
      const errors = error.details.map((detail) => detail.message)
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors,
      })
    }

    next()
  }
}
