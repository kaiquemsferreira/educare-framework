export interface NotificationDataModel {
  title: string;
  message: string;
  link?: string;
  linkText?: string;
  duration?: number;
  closeButton?: string;
  scope?: string;
}
