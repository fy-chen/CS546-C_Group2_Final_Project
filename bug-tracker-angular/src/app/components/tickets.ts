
import { History } from "./history";

export interface Ticket {
    _id: string,
    title: string,
    description: string,
    priority: number,
    creator: string,
    project: string,
    status: string,
    createdTime: number,
    errorType: string,
    assignedUsers: AssignedUsers[],
    comment: Array<Object>,
    history: History[],
}

export interface TicketTable {
  No: number,
  _id: any,
  title: any,
  description: any,
  creator: any,
  status: any,
  createdTime: any,
}

export interface AssignedUsers {
  _id: any,
  username: any
}