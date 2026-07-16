import type { Request, Response } from 'express';
import { asyncHandler } from '../../middleware/asyncHandler';
import { createPetSchema, updatePetSchema, petQuerySchema } from './pets.validation';
import * as petsService from './pets.service';

export const createPet = asyncHandler(async (req: Request, res: Response) => {
  const input = createPetSchema.parse(req.body);
  const pet = await petsService.createPet(input);

  res.status(201).json({
    success: true,
    data: pet,
    message: 'Pet created successfully',
  });
});

export const getPetById = asyncHandler(async (req: Request, res: Response) => {
  const pet = await petsService.getPetById(req.params.id as string);

  res.status(200).json({
    success: true,
    data: pet,
  });
});

export const listPets = asyncHandler(async (req: Request, res: Response) => {
  const filters = petQuerySchema.parse(req.query);
  const result = await petsService.listPets(filters);

  res.status(200).json({
    success: true,
    data: result.data,
    meta: {
      page: result.page,
      limit: result.pageSize,
      total: result.total,
      totalPages: result.totalPages,
    },
  });
});

export const updatePet = asyncHandler(async (req: Request, res: Response) => {
  const input = updatePetSchema.parse(req.body);
  const pet = await petsService.updatePet(req.params.id as string, input);

  res.status(200).json({
    success: true,
    data: pet,
    message: 'Pet updated successfully',
  });
});

export const deletePet = asyncHandler(async (req: Request, res: Response) => {
  await petsService.deletePet(req.params.id as string);

  res.status(200).json({
    success: true,
    message: 'Pet deleted successfully',
  });
});