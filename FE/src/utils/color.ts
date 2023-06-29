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
    case 'APPROVAL_PENDING':
      return '#03b8fd';
    case 'SUSPENDED':
      return '#ab0880';
    case 'CANCELLED':
      return '#c00404';
    case 'ACTIVE':
      return '#36b301';
    case 'WAITING_SYNC':
      return '#b9af14';
    default:
      break;
  }
};
