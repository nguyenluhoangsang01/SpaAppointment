export const ROLES = {
  Admin: "Admin",
  Staff: "Staff",
  Customer: "Customer",
  Manager: "Manager",
  Receptionist: "Receptionist",
};

export const APPOINTMENT_STATUS = {
  Booked: "Booked",
  Cancelled: "Cancelled",
  Completed: "Completed",
  Confirmed: "Confirmed",
};

export const PAYMENT_METHOD = {
  Cash: "Cash",
  "Credit cards": "Credit cards",
  "Gift cards": "Gift cards",
};

export const PAYMENT_STATUS = {
  Approved: "Approved",
  Created: "Created",
  Failed: "Failed",
  Refunded: "Refunded",
};

export const GiFT_CARD_STATUS = {
  Active: "Active",
  Redeemed: "Redeemed",
};

export const TRANSACTION_STATUS = {
  Completed: "Completed",
  Pending: "Pending",
  Refunded: "Refunded",
};

export const PROMOTION_TYPE = {
  Percentage: "Percentage",
  Fixed: "Fixed",
};

export const formatTime = "MMM Do YYYY, h:mm:ss A";

export const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/;

export const phoneRegex =
  /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;