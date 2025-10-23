import Joi from 'joi';

export const setHelpRadiusSchema = Joi.object({
  helpRadius: Joi.number().required().greater(0),
});

export const updateLocationSchema = Joi.object({
  lat: Joi.number().required(),
  lng: Joi.number().required(),
});
