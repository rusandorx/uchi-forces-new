"use client";

import {
	Check,
	Gavel,
	Loader2,
	MoreVertical,
	Shield,
	ShieldAlert,
	ShieldCheck,
	ShieldQuestion,
} from "lucide-react";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuPortal,
	DropdownMenuSeparator,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu";

import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { Role } from "@prisma/client";
import { ScrollArea } from "@/components/ui/scroll-area";
import { UserAvatar } from "@/components/user-avatar";
import axios from "axios";
import qs from "query-string";
import { useModal } from "@/hooks/use-modal-store";
import { useRouter } from "next/navigation";
import { useState } from "react";

const roleIconMap = {
	USER: null,
	ADMIN: <ShieldCheck className="h-4 w-4 ml-2 text-indigo-500" />,
	CREATOR: <ShieldAlert className="h-4 w-4 text-rose-500" />,
};

export const ProfilesModal = () => {
	const router = useRouter();
	const { onOpen, isOpen, onClose, type, data } = useModal();
	const [loadingId, setLoadingId] = useState("");

	const isModalOpen = isOpen && type === "profiles";
	const { profiles } = data;

	const onRoleChange = async (profileId: string, role: Role) => {
		try {
			setLoadingId(profileId);
			const url = qs.stringifyUrl({
				url: `/api/profiles/${profileId}`,
			});

			await axios.patch(url, { role });

			router.refresh();
      const newProfiles = profiles?.map(profile => (profile.id === profileId ? {...profile, role} : profile)); 
			onOpen("profiles", { profiles: newProfiles });
		} catch (error) {
			console.log(error);
		} finally {
			setLoadingId("");
		}
	};

	return (
		<Dialog open={isModalOpen} onOpenChange={onClose}>
			<DialogContent className="bg-white text-black overflow-hidden">
				<DialogHeader className="pt-8 px-6">
					<DialogTitle className="text-2xl text-center font-bold">
						Пользователи
					</DialogTitle>

					<DialogDescription className="text-center text-zinc-500">
						Здесь можно менять роли пользователей.
					</DialogDescription>
				</DialogHeader>
				<ScrollArea className="mt-8 max-h-[420px] pr-6">
					{profiles?.map((profile) => (
						<div
							key={profile.id}
							className="flex items-center gap-x-2 mb-6"
						>
							<UserAvatar src={profile.imageUrl} />
							<div className="flex flex-col gap-y-1">
								<div className="text-xs font-semibold flex items-center gap-x-1">
									{profile.name}
									{roleIconMap[profile.role]}
								</div>
								<p className="text-xs text-zinc-500">
									{profile.email}
								</p>
							</div>
							{profile.role !== Role.CREATOR &&
								loadingId !== profile.id && (
									<div className="ml-auto">
										<DropdownMenu>
											<DropdownMenuTrigger>
												<MoreVertical className="h-4 w-4 text-zinc-500" />
												<DropdownMenuContent side="left">
													<DropdownMenuSub>
														<DropdownMenuSubTrigger className="flex items-center">
															<ShieldQuestion className="w-4 h-4 mr-2" />
															<span>Роль</span>
														</DropdownMenuSubTrigger>
														<DropdownMenuPortal>
															<DropdownMenuSubContent>
																<DropdownMenuItem
																	onClick={() =>
																		onRoleChange(
																			profile.id,
																			"USER"
																		)
																	}
																>
																	<Shield className="h-4 w-4 mr-2" />
																	Пользователь
																	{profile.role ===
																		"USER" && (
																		<Check className="h-4 w-4 ml-auto" />
																	)}
																</DropdownMenuItem>
																<DropdownMenuItem
																	onClick={() =>
																		onRoleChange(
																			profile.id,
																			"ADMIN"
																		)
																	}
																>
																	<ShieldCheck className="h-4 w-4 mr-2" />
																	Составитель задач
																	{profile.role ===
																		"ADMIN" && (
																		<Check className="h-4 w-4 ml-auto" />
																	)}
																</DropdownMenuItem>
															</DropdownMenuSubContent>
														</DropdownMenuPortal>
													</DropdownMenuSub>
												</DropdownMenuContent>
											</DropdownMenuTrigger>
										</DropdownMenu>
									</div>
								)}
							{loadingId === profile.id && (
								<Loader2 className="animate-spin text-zinc-500 ml-auto h-4 w-4" />
							)}
						</div>
					))}
				</ScrollArea>
			</DialogContent>
		</Dialog>
	);
};
