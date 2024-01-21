import { auth } from "@clerk/nextjs";
import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

const handleAuth = () => {
	const { userId } = auth();
	if (!userId) throw new Error("Unauthorized");
	return { userId };
};

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
	taskImages: f({ image: { maxFileSize: "4MB", maxFileCount: 3 } })
		.middleware(() => handleAuth())
		.onUploadComplete(() => {}),
  solutionImages: f({image: {maxFileSize: "4MB", maxFileCount: 3}})
  .middleware(() => handleAuth())
  .onUploadComplete(() => {}),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
