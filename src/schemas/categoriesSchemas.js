import joi from "joi";

const categoriesBodySchema = joi.object({
  name: joi.string().required()});

export { categoriesBodySchema };