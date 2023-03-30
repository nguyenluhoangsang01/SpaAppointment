export const ROLES = {
	Admin: "Admin",
	Staff: "Staff",
	Customer: "Customer",
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

export const ACCESS_TOKEN_EXPIRES_IN = "7d";
export const REFRESH_TOKEN_EXPIRES_IN = "7d";

export const formatDateTime = "HH:mm DD/MM/YYYY";
export const formatDateOnly = "DD/MM/YYYY";

export const passwordRegex =
	/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/;
export const phoneRegex =
	/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;

export const avatarOptions = {
	folder: "avatar",
	unique_filename: true,
	resource_type: "image",
	use_filename: true,
	overwrite: true,
};
export const serviceOptions = {
	folder: "service",
	unique_filename: true,
	resource_type: "image",
	use_filename: true,
	overwrite: true,
};

export const RATES = {
	0: 0,
	1: 1,
	2: 2,
	3: 3,
	4: 4,
	5: 5,
	6: 6,
	7: 7,
	8: 8,
	9: 9,
	10: 10,
};

export const emailConstraint = {
	email: { email: true },
};
export const phoneConstraint = {
	phone: { format: { pattern: phoneRegex } },
};
export const roleConstraint = {
	role: { inclusion: { within: ROLES } },
};
export const newPasswordConstraint = {
	newPassword: {
		length: { minimum: 8 },
		format: { pattern: passwordRegex },
	},
};
export const passwordConstraint = {
	password: {
		length: {
			minimum: 8,
		},
		format: {
			pattern: passwordRegex,
		},
	},
};