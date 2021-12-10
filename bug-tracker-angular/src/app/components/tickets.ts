
import { ObjectId } from "bson";
import { History } from "./history";

export interface Ticket {
    _id: string,
    title: string,
    description: string,
    priority: number,
    creator: string,
    project: string,
    status: string,
    createdTime: string | null,
    errorType: string,
    assignedUsers: AssignedUsers[],
    comment: Array<Object>,
    history: History[],
}

export interface TicketTable {
  No: number,
  _id: string,
  title: any,
  description: any,
  creator: any,
  status: any,
  project: any,
  errorType: any,
  createdTime: any,
}

export interface user{
  _id : String,
  username : String,
  role : number,
  assignedProjects : Array<Project>,
  createdTickets: Array<Ticket>,
  assignedTickets: Array<Ticket>
}

export interface Project {
  _id: string,
  projectName: string,
  description: string,
  tickets: Array<string>,
}

export interface AssignedUsers {
  _id: any,
  username: any
}

export interface searchResult {
  notFound?: boolean,
  tickets?: Ticket[]
}

export interface deletResult {
  deleted?: boolean,
}