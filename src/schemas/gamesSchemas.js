import joi from "joi";

const gamesBodySchema = joi.object({
  name: joi.string().required(),
  image: joi.string().required(),
  stockTotal: joi.number().greater(0).integer().required(),
  categoryId: joi.number().greater(0).integer().required(),
  pricePerDay: joi.number().min(0).integer().required(),
});

export { gamesBodySchema };
