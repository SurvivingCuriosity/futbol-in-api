import { ok } from '@/utils/ApiResponse';
import * as spotService from '@/services/futbolin.service';

export const getAll = async () => {
  const spots = await spotService.getAll();
  return ok(spots, 'Lista de futbolines');
};
