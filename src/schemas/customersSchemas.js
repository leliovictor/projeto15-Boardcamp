import BaseJoi from 'joi';
import JoiDate from '@joi/date';
import dayjs from "dayjs";

const joi = BaseJoi.extend(JoiDate);

const customerBodySchema = joi.object({
  name: joi.string().required(),
  phone: joi.string().pattern(/^[0-9]{10,11}$/).required(),
  cpf: joi.string().pattern(/^[0-9]{11}$/).required(),
  birthday: joi.date().format("YYYY-MM-DD").max(dayjs().format("YYYY-MM-DD")).iso().required(),
});

export { customerBodySchema };