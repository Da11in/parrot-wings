import Joi from "joi";

export const createTransactionSchema = Joi.object({
  amount: Joi.number().greater(0).required(),
  recipientId: Joi.number().required(),
});
