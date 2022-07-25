import joi from "joi";

const rentalsBodySchema = joi.object({
    customerId: joi.number().integer().required(),
    gameId: joi.number().integer().required(),
    daysRented: joi.number().greater(0).integer().required()
});

export { rentalsBodySchema };