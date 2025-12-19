import Joi from "joi"

// Schema de validation pour creer un produit
export const productSchema = Joi.object({
  name: Joi.string().max(100).required().messages({
    "string.max": "Le nom ne peut pas depasser 100 caracteres",
    "any.required": "Le nom du produit est obligatoire"
  }),
  description: Joi.string().max(1000).required().messages({
    "string.max": "La description ne peut pas depasser 1000 caracteres",
    "any.required": "La description est obligatoire"
  }),
  price: Joi.number().min(0).required().messages({
    "number.min": "Le prix doit etre positif",
    "any.required": "Le prix est obligatoire"
  }),
  stock: Joi.number().min(0).required().messages({
    "number.min": "Le stock ne peut pas etre negatif",
    "any.required": "Le stock est obligatoire"
  }),
  category: Joi.string().required().messages({
    "any.required": "La categorie est obligatoire"
  }),
  tags: Joi.array().items(Joi.string()).default([]),
  image: Joi.string().allow("").default("")
})

// Schema pour la mise a jour (tous les champs optionnels)
export const productUpdateSchema = Joi.object({
  name: Joi.string().max(100),
  description: Joi.string().max(1000),
  price: Joi.number().min(0),
  stock: Joi.number().min(0),
  category: Joi.string(),
  tags: Joi.array().items(Joi.string()),
  image: Joi.string().allow("")
}).min(1) // il faut au moins un champ

// Middleware de validation
export const validate = (schema) => {
  return (req, res, next) => {
    const result = schema.validate(req.body, { abortEarly: false })
    
    if (result.error) {
      // on recupere tous les messages d'erreur
      const erreurs = result.error.details.map(err => err.message)
      
      return res.status(400).json({
        success: false,
        message: "Erreur de validation",
        errors: erreurs
      })
    }
    
    next()
  }
}