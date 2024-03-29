import "./globals.css";

import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import { ModalProvider } from "@/components/providers/modal-provider";
import { Open_Sans } from "next/font/google";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { cn } from "@/lib/utils";
import { dark } from "@clerk/themes";

const font = Open_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "Uchi Forces",
	description: "An educational platform.",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		// eslint-disable-next-line
		// @ts-ignore
		<ClerkProvider appearance={dark}>
			<html lang="en" suppressHydrationWarning>
				<body
					className={cn(font.className, "bg-white dark:bg-[#313338]")}
				>
					<ThemeProvider
						attribute="class"
						defaultTheme="dark"
						enableSystem
						storageKey="discord-theme"
					>
						<ModalProvider />
						{children}
					</ThemeProvider>
				</body>
			</html>
		</ClerkProvider>
	);
}
