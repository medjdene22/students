import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


// Helper function to determine file extension from MIME type
// function getFileExtension(mimeType: string): string {
//   const mimeToExt: Record<string, string> = {
//     'image/jpeg': 'jpg',
//     'image/png': 'png',
//     'image/gif': 'gif',
//     'application/pdf': 'pdf',
//     'text/plain': 'txt',
//     // Add more MIME types as needed
//   };
  
//   return mimeToExt[mimeType] || 'bin';
// }