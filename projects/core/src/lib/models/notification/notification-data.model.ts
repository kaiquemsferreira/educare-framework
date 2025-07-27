export interface NotificationDataModel {
  title: string;
  message: string;
  link?: string;
  linkText?: string;
  duration?: number;
  closeButton?: string;
  target?: string;
  scope?: string;
}
