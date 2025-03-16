import z from "zod";

export const UploadImageRes = z.object({
  data: z.object({
    file_name: z.string(),
    file_url: z.string(),
  }),
  message: z.string(),
});

export type UploadImageResType = z.TypeOf<typeof UploadImageRes>;
