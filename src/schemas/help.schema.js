import Joi from 'joi';

export const askHelpSchema = Joi.object({
  latitude: Joi.number().required(),
  longitude: Joi.number().required(),
});
