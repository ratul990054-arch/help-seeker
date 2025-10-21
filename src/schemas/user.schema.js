
import Joi from 'joi';

export const getAllUsersSchema = Joi.object({
  // No body validation needed for this route
});

export const updateUserLocationSchema = Joi.object({
  lat: Joi.number().required(),
  lng: Joi.number().required(),
});
