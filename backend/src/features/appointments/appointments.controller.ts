import type { Request, Response } from 'express';
import { asyncHandler } from '../../middleware/asyncHandler';
import {
  createAppointmentSchema,
  updateAppointmentSchema,
  updateAppointmentStatusSchema,
  appointmentQuerySchema,
} from './appointments.validation';
import * as appointmentsService from './appointments.service';

export const createAppointment = asyncHandler(async (req: Request, res: Response) => {
  const input = createAppointmentSchema.parse(req.body);
  const appointment = await appointmentsService.createAppointment(input);

  res.status(201).json({
    success: true,
    data: appointment,
    message: 'Appointment created successfully',
  });
});

export const getAppointmentById = asyncHandler(async (req: Request, res: Response) => {
  const appointment = await appointmentsService.getAppointmentById(req.params.id as string);

  res.status(200).json({
    success: true,
    data: appointment,
  });
});

export const listAppointments = asyncHandler(async (req: Request, res: Response) => {
  const filters = appointmentQuerySchema.parse(req.query);
  const result = await appointmentsService.listAppointments(filters);

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

export const updateAppointment = asyncHandler(async (req: Request, res: Response) => {
  const input = updateAppointmentSchema.parse(req.body);
  const appointment = await appointmentsService.updateAppointment(req.params.id as string, input);

  res.status(200).json({
    success: true,
    data: appointment,
    message: 'Appointment updated successfully',
  });
});

export const updateAppointmentStatus = asyncHandler(async (req: Request, res: Response) => {
  const input = updateAppointmentStatusSchema.parse(req.body);
  const appointment = await appointmentsService.updateAppointmentStatus(req.params.id as string, input);

  res.status(200).json({
    success: true,
    data: appointment,
    message: 'Appointment status updated successfully',
  });
});

export const deleteAppointment = asyncHandler(async (req: Request, res: Response) => {
  await appointmentsService.deleteAppointment(req.params.id as string);

  res.status(200).json({
    success: true,
    message: 'Appointment deleted successfully',
  });
});