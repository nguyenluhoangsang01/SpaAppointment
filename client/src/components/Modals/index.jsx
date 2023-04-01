import { Modal } from "antd";
import React from "react";

const Modals = ({ title, open, onOk, confirmLoading, onCancel, children }) => {
	return (
		<Modal
			title={title}
			open={open}
			onOk={onOk}
			onCancel={onCancel}
			confirmLoading={confirmLoading}
		>
			{children}
		</Modal>
	);
};

export default Modals;