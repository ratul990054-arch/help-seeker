
import Joi from 'joi';

export const createHelpRequestSchema = Joi.object({
  lat: Joi.number().required(),
  lng: Joi.number().required(),
});

export const respondToHelpRequestSchema = Joi.object({
  helpRequestId: Joi.string().required(),
  action: Joi.string().valid('accept', 'reject').required(),
});
