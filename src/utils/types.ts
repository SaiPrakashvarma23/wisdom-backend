import { NewCustomer,Customer,CustomerTable } from "../schemas/customer";
import { NewInteraction, Interaction, InteractionTable } from "../schemas/interaction";
import { NewUser, User, UserTable } from "../schemas/user";

export type DBRecord = User | Customer | Interaction
export type NewDBRecord = NewUser | NewCustomer | NewInteraction
export type DBTable = UserTable | CustomerTable | InteractionTable
