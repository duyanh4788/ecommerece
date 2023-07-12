import { SubscriptionStatus } from 'interface/Subscriptions.model';

export const handleColorTier = (tier: string) => {
  switch (tier) {
    case 'starter':
      return '#382fab';
    case 'premium':
      return '#ff0000';
    case 'pro':
      return '#56ab2f';
    default:
      break;
  }
};

export const handleColorStatus = (status: string) => {
  switch (status) {
    case SubscriptionStatus.APPROVAL_PENDING:
      return '#03b8fd';
    case SubscriptionStatus.SUSPENDED:
      return '#ab0880';
    case SubscriptionStatus.CANCELLED:
      return '#c00404';
    case SubscriptionStatus.ACTIVE:
      return '#36b301';
    case SubscriptionStatus.WAITING_SYNC:
      return '#b9af14';
    default:
      break;
  }
};
