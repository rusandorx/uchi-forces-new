"use client";

import "@uploadthing/react/styles.css";

import { UploadButton, UploadDropzone } from "@/lib/uploadthing";

import { FilesEndPoints } from "@/types";
import Image from "next/image";
import { X } from "lucide-react";
import { useCallback } from "react";

interface FilesUploadProps {
	onChange: (urls?: string[]) => void;
	value?: string[];
	endpoint: FilesEndPoints;
}

interface FileViewProps {
	value?: string;
	onChange: (url: string) => void;
	endpoint: FilesEndPoints;
}

export const FileView = ({ onChange, value, endpoint }: FileViewProps) => {
	const fileType = value?.split(".").pop();

	if (value && fileType !== "pdf") {
		return (
			<div className="relative h-20 w-20">
				<Image fill src={value} alt="Upload" className="rounded-sm" />
				<button
					onClick={() => onChange("")}
					className="bg-rose-500 text-white p-1 rounded-sm absolute top-0 right-0 shadow-sm"
					type="button"
				>
					<X className="h-4 w-4" />
				</button>
			</div>
		);
	}
};

export const FilesUpload = ({
	onChange,
	value: values,
	endpoint,
}: FilesUploadProps) => {
	const onSingleItemChange = useCallback(
		(index: number, url?: string) => {
			if (values)
				onChange(
					[
						...values.slice(0, index - 1),
						url,
						...values.slice(index + 1),
					].filter((value): value is string => !!value)
				);
		},
		[values, onChange]
	);

	if (!values?.length)
		return (
			<UploadDropzone
				endpoint={endpoint}
				onClientUploadComplete={(res) => {
					onChange(res?.map((response) => response.url) ?? []);
				}}
				onUploadError={console.log}
			/>
		);

	return (
		<div className="flex gap-2">
			{values?.map((value, i) => (
				<FileView
					value={value}
					onChange={(url) => onSingleItemChange(i, url)}
					endpoint={endpoint}
					key={value}
				/>
			))}
		</div>
	);
};
