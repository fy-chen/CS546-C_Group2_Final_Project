   
export interface Ticket {
    _id: string;
    title: string;
    description: string;
    creator: string;
    project: string;
    errorType: string;
    priority: number;
    status: string;
    createdTime: string;
    assignedUsers: Array<string>;
    comment: Array<Object>;
    history: Array<Object>;
  }