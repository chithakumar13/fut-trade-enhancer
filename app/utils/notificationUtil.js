export const sendUINotification = function (message, notificationType) {
  notificationType = notificationType || enums.UINotificationType.POSITIVE
  services.Notification.queue([message, notificationType])
}
