import http from "@/lib/http";
import { UploadImageResType } from "@/schemaValidations/media.schema";

export const mediaApiRequest = {
  upload: (folderType: string, file: FormData) =>
    http.post<UploadImageResType>(`/v1/files/upload/${folderType}`, file),
};
