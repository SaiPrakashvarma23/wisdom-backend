import { addSingleRecord, getRecordByColumn, updateSingleRecord, deleteSingleRecord, updateRecordByField } from '../dbClient/dbClient';
import { interactions } from '../schemas/interaction';
import { NewInteraction } from '../schemas/interaction';
import { DBTable } from '../utils/types';

export class InteractionService {
  private tableName: DBTable = interactions;

  async createInteraction(data: NewInteraction) {
    return await addSingleRecord(this.tableName, data);
  }

  async getInteractionById(id: number) {
    return await getRecordByColumn(this.tableName, 'id', id);
  }

  async getInteractionsByCustomer(customerId: number) {
    return await getRecordByColumn(this.tableName, 'customer_id', customerId);
  }

  async updateInteraction(id: number, data: NewInteraction) {
    return await updateSingleRecord(this.tableName,data, id);
  }

  async updateInteractionByField(fieldName: string, fieldValue: any, data: NewInteraction) {
    return await updateRecordByField(this.tableName, data, fieldValue, fieldName);
  }

  async deleteInteraction(id: number) {
    return await deleteSingleRecord(this.tableName, id);
  }
}
