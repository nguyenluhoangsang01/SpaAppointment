import React, { memo, useCallback } from "react";
import { useDropzone } from "react-dropzone";

const Dropzone = ({ setAvatar }) => {
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
			<input {...getInputProps()} />

			{isDragReject ? (
				<p>Sorry, This app only supports images</p>
			) : isDragActive ? (
				<p>Drop file here to upload</p>
			) : (
				<p>You can drag and drop file here to add them</p>
			)}
		</div>
	);
};

export default memo(Dropzone);