   
export interface Ticket {
    _id: string,
    title: string,
    description: string,
    priority: number,
    creator: string,
    project: string,
    status: string,
    createdTime: string,
    errorType: string,
    assignedUsers: Array<string>,
    comment: Array<Object>,
    history: Array<Object>,
  }