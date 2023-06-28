import React, { forwardRef, useCallback } from "react";
import { useDropzone } from "react-dropzone";

const Dropzone = forwardRef((props, ref) => {
	const { setAvatar } = props;

	const onDrop = useCallback(
		(acceptedFile) => {
			setAvatar(acceptedFile[0]);
		},
		[setAvatar]
	);

	const { getRootProps, getInputProps, isDragActive, isDragReject } =
		useDropzone({
			onDrop,
			multiple: false,
			accept: {
				"image/*": [".png", ".jpeg", ".jpg"],
			},
		});

	return (
		<div
			{...getRootProps()}
			className={`h-[32px] px-[11px] py-[4px] border-[1px] text-[#000000e0] text-[14px] w-full bg-[#fff] border-[#d9d9d9] rounded-md transition hover:border-[#4096ff] cursor-pointer font-[Segoe UI] ${
				isDragReject ? "!border-red-500" : ""
			} ${isDragActive ? "border-green-500" : ""}`}
		>
			<input {...getInputProps()} ref={ref} />

			{isDragReject ? (
				<p>Xin lỗi, ứng dụng này chỉ hỗ trợ hình ảnh</p>
			) : isDragActive ? (
				<p>Thả tập tin vào đây để tải lên</p>
			) : (
				<p>
					Bạn có thể kéo và thả tệp hình ảnh vào đây để làm hình ảnh đại diện
				</p>
			)}
		</div>
	);
});

export default Dropzone;