import { mediaApiRequest } from "@/apiRequest/media"
import { useMutation } from "@tanstack/react-query"

export const useUploadMediaMutation = () => {
    return useMutation({
        mutationFn: ({ folderType, file }: { folderType: string, file: FormData }) => mediaApiRequest.upload(folderType, file)
    })
}