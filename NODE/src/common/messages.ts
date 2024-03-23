import { Reasons } from '../interface/ShopInterface';

export enum Messages {
  // ERROR
  NOT_AVAILABLE = 'Item is not available.',
  NOT_REQ_AVAILABLE = 'Request is not available!',
  IN_REQ = 'Invalid request!',
  CODE_INVALID = 'Invalid code!',
  UPLOAD_FAILED = 'Upload failed.',
  TOKEN_EXP = 'Your token has expired. Please log in again!',
  PAYLOAD_AVAILABLE = 'Payload not available.',
  NOT_EMPTY = 'cannot be empty.',
  SHOP_NONE_SUBS = 'Shop does not have any subscriptions.',
  PROD_NONE_REG = 'Product is not registered.',
  ITEM_RESOURCE_END = 'Item count is zero. Please upgrade your subscription or wait for the next payment cycle.',
  ROLE_AD = 'You do not have admin permissions!',
  ROLE_OW = 'You do not have owner permissions!',
  MAP_ITEMS_ERR = 'Unsupported items.',

  // PAYPAL
  GET_BILL_ERR = 'Failed to retrieve subscription information from PayPal.',
  SYS_PAYPAL_BUSY = 'System is busy. Please try again later or contact the admin.',
  CANCEL_SUB_ERR = 'Failed to cancel this subscription.',
  SUSPEND_SUB_ERR = 'Failed to suspend this subscription.',
  ACTIVE_SUB_ERR = 'Failed to activate this subscription.',
  SHOP_NEED_SUBS = 'You need to subscribe to the previous shop before registering a new one. Please subscribe via PayPal.',
  SHOP_HAS_SUBS = 'You need to subscribe to the previous shop before registering a new one. Please subscribe via PayPal.',
  ALREADY_ACTIVE = 'User is already active!',
  NONE_SUBSCRIPTION = 'Cannot subscribe!',
  SUBSCRIPTION_SUSPENDED = 'Your payment for at least one previous billing cycle failed. Please check your PayPal account.',
  CHANGE_SUBSCRIPTION = 'You cannot change subscription. Please contact the admin!',
  PLAN_DUPLICATE = 'Please choose another plan!',
  PLEASE_UPDATE_BILLING = 'Please refresh this page to get the latest subscription details!',
  PLEASE_WAITING_SYNC = 'Please wait for system synchronization with PayPal!',
  NONE_SUB_TO_CANCEL = 'No active subscription to cancel.',
  SUB_NOT_AVAILABLE = 'Subscription not available.',

  // USERS
  ACC_NOT_FOUND = 'Account not found!',
  ACC_DISABLED = 'Account is disabled!',
  PASS_WRONG = 'Incorrect password!',
  LOGIN_LIMIT = 'You have reached the maximum login limit (5 devices). Please log in again!',
  LOGIN_FAILED = 'Sign-in failed. Please try logging in again!',
  EMAIL_EXT = 'Sign-in failed. Please try logging in again!',
  RESEND_FORGOT_PASS_ERR = 'You cannot request a password reset!',

  // SUCCESS
  POST_OK = 'Created successfully.',
  PUT_OK = 'Updated successfully.',
  DEL_OK = 'Deleted successfully.',
  APPROVED_OK = 'Approved successfully.',
  CANCEL_SUBS_SHOP_OK = 'Canceled successfully. Please wait for system synchronization with PayPal!',
  WAIT_SYNC_PAYPAL = 'Please wait for system synchronization with PayPal!',
  UPLOAD_OK = 'Uploaded successfully.',
  DEL_FILE_OK = 'Removed successfully.',
  SIGNIN_OK = 'Sign-in successful!',
  SIGNUP_OK = 'Sign-up successful!',
  SIGNOUT_OK = 'Sign-out successful!',
  HAS_SEND_AUTH_CODE = 'We have sent an authentication code to your email. Please check your email or resend the code!',
  HAS_SEND_OR_TRY_AUTH_CODE = 'We have sent an authentication code to your email. Please check your email or try again after 1 hour!'
}

export const handleMsgEmptyWithField = (field: string) => {
  return `${field} ${Messages.NOT_EMPTY}`;
};

export const handleMsgNotValidWithField = (field: string) => {
  return `${field} is not available.`;
};

export const handleMsgWithItemResource = (field: number) => {
  return `You can only update the product with ${field} items.`;
};

export const handleMessagePublish = (status: boolean, reasons: string, nameShop: string) => {
  if (status) {
    if (reasons === Reasons.SUBSCRIPTION) return `Shop ${nameShop} has been activated.`;
    if (reasons === Reasons.INVOICES) return `Shop ${nameShop} invoices have been checked on the page and emailed.`;
    if (reasons === Reasons.ADMIN) return `Shop ${nameShop} has been activated as an admin.`;
  }
  if (!status) {
    if (reasons === Reasons.SUBSCRIPTION) return `Shop ${nameShop} has been disabled.`;
    if (reasons === Reasons.ADMIN) return `Shop ${nameShop} has been disabled as an admin.`;
  }
};
