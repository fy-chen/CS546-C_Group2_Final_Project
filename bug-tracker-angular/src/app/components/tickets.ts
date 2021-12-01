
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
    assignedUsers: Array<string>,
    comment: Array<Object>,
    history: History[],
  }