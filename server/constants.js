export const ROLES = {
	"Quản trị viên": "Quản trị viên",
	"Nhân viên": "Nhân viên",
	"Khách hàng": "Khách hàng",
};

export const APPOINTMENT_STATUS = {
	"Đã đặt": "Đã đặt",
	"Đã hủy": "Đã hủy",
	"Đã hoàn thành": "Đã hoàn thành",
	"Đã xác nhận": "Đã xác nhận",
};

// export const PAYMENT_METHOD = {
// 	Cash: "Cash",
// 	"Credit cards": "Credit cards",
// 	"Gift cards": "Gift cards",
// };

// export const PAYMENT_STATUS = {
// 	Approved: "Approved",
// 	Created: "Created",
// 	Failed: "Failed",
// 	Refunded: "Refunded",
// };

export const GiFT_CARD_STATUS = {
	"Đang hoạt động": "Đang hoạt động",
	"Chưa hoạt động": "Chưa hoạt động",
};

// export const TRANSACTION_STATUS = {
// 	Completed: "Completed",
// 	Pending: "Pending",
// 	Refunded: "Refunded",
// };

export const PROMOTION_TYPE = {
	"Tỷ lệ phần trăm": "Tỷ lệ phần trăm",
	"Tỷ lệ cố định": "Tỷ lệ cố định",
};

export const SCHEDULE_TYPE = {
	"Đang làm việc": "Đang làm việc",
	"Đang nghỉ việc": "Đang nghỉ việc",
};

export const ACCESS_TOKEN_EXPIRES_IN = "7d";
export const REFRESH_TOKEN_EXPIRES_IN = "7d";

export const formatDateTime = "HH:mm - DD/MM/YYYY";
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
export const durationConstraint = {
	duration: {
		numericality: {
			onlyInteger: false,
			greaterThan: 0,
		},
	},
};
export const priceConstraint = {
	price: {
		numericality: {
			onlyInteger: true,
			greaterThanOrEqualTo: 0,
		},
	},
};
export const startDateConstraint = {
	startDate: {
		datetime: true,
	},
};
export const endDateConstraint = {
	endDate: {
		datetime: true,
	},
};
export const maxUsesConstraint = {
	maxUses: {
		numericality: {
			onlyInteger: true,
			greaterThanOrEqualTo: 1,
		},
	},
};
export const promotionTypesConstraint = {
	type: {
		inclusion: {
			within: PROMOTION_TYPE,
		},
	},
};
export const valueConstraint = {
	value: {
		numericality: {
			onlyInteger: true,
			greaterThanOrEqualTo: 1,
		},
	},
};
export const expirationDateConstraint = {
	expirationDate: {
		datetime: true,
	},
};
export const statusConstraint = {
	status: {
		inclusion: { within: GiFT_CARD_STATUS },
	},
};
export const statusAppointmentConstraint = {
	status: {
		presence: { allowEmpty: false },
		inclusion: { within: APPOINTMENT_STATUS },
	},
};
export const typeConstraint = {
	status: {
		inclusion: { within: SCHEDULE_TYPE },
	},
};
