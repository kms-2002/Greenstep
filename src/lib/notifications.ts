export type ActivityNotification={
  id:string;title:string;body:string;created_at:string;read_at:string|null;
};
export type NotificationInbox={items:ActivityNotification[];unread:number};
