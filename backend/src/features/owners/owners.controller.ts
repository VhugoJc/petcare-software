import type { Request, Response } from 'express';
import { asyncHandler } from '../../middleware/asyncHandler';
import { createOwnerSchema, updateOwnerSchema, ownerQuerySchema } from './owners.validation';
import * as ownersService from './owners.service';

export const createOwner = asyncHandler(async (req: Request, res: Response) => {
  const input = createOwnerSchema.parse(req.body);
  const owner = await ownersService.createOwner(input);

  res.status(201).json({
    success: true,
    data: owner,
    message: 'Owner created successfully',
  });
});

export const getOwnerById = asyncHandler(async (req: Request, res: Response) => {
  const owner = await ownersService.getOwnerById(req.params.id as string);

  res.status(200).json({
    success: true,
    data: owner,
  });
});

export const listOwners = asyncHandler(async (req: Request, res: Response) => {
  const filters = ownerQuerySchema.parse(req.query);
  const result = await ownersService.listOwners(filters);

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

export const updateOwner = asyncHandler(async (req: Request, res: Response) => {
  const input = updateOwnerSchema.parse(req.body);
  const owner = await ownersService.updateOwner(req.params.id as string, input);

  res.status(200).json({
    success: true,
    data: owner,
    message: 'Owner updated successfully',
  });
});

export const deleteOwner = asyncHandler(async (req: Request, res: Response) => {
  await ownersService.deleteOwner(req.params.id as string);

  res.status(200).json({
    success: true,
    message: 'Owner deleted successfully',
  });
});