import { Context } from 'hono';
import { InteractionService } from '../services/interactionService';
import { ResponseHelper } from '../helpers/responseHelper';
import interactionSchema from '../validations/interactionValidation';

const interactionService = new InteractionService();

export class InteractionController {
  async createInteraction(c: Context) {
    try {
      const reqData = await c.req.json();
      const { error } = interactionSchema.validate(reqData);

      if (error) {
        return ResponseHelper.sendErrorResponse(c, 400, error.details[0].message);
      }

      const newInteraction = await interactionService.createInteraction(reqData);
      return ResponseHelper.sendSuccessResponse(c, 201, 'Interaction logged successfully.', newInteraction);
    } catch (error: any) {
      return ResponseHelper.sendErrorResponse(c, 500, error.message);
    }
  }

  async getInteractions(c: Context) {
    try {
      const customerId = +c.req.param('customer_id');
      if (!customerId) {
        return ResponseHelper.sendErrorResponse(c, 400, 'Customer ID is required.');
      }

      const interactions = await interactionService.getInteractionsByCustomer(customerId);
      return ResponseHelper.sendSuccessResponse(c, 200, 'Interactions retrieved successfully.', interactions);
    } catch (error: any) {
      return ResponseHelper.sendErrorResponse(c, 500, error.message);
    }
  }

  async updateInteraction(c: Context) {
    try {
      const interactionId = +c.req.param('id');
      const reqData = await c.req.json();
      const { error } = interactionSchema.validate(reqData);

      if (error) {
        return ResponseHelper.sendErrorResponse(c, 400, error.details[0].message);
      }

      const updatedInteraction = await interactionService.updateInteraction(interactionId, reqData);
      return ResponseHelper.sendSuccessResponse(c, 200, 'Interaction updated successfully.', updatedInteraction);
    } catch (error: any) {
      return ResponseHelper.sendErrorResponse(c, 500, error.message);
    }
  }

  async deleteInteraction(c: Context) {
    try {
      const interactionId = +c.req.param('id');
      await interactionService.deleteInteraction(interactionId);
      return ResponseHelper.sendSuccessResponse(c, 200, 'Interaction deleted successfully.');
    } catch (error: any) {
      return ResponseHelper.sendErrorResponse(c, 500, error.message);
    }
  }
}
