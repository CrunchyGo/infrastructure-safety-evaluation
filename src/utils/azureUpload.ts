// utils/azureUpload.ts
import { BlobServiceClient } from "@azure/storage-blob";
import { v4 as uuidv4 } from "uuid";

const AZURE_STORAGE_CONNECTION_STRING = process.env.NEXT_PUBLIC_AZURE_STORAGE_CONNECTION_STRING;
const CONTAINER_NAME = process.env.NEXT_PUBLIC_AZURE_CONTAINER_NAME;

if (!AZURE_STORAGE_CONNECTION_STRING || !CONTAINER_NAME) {
  throw new Error("Azure storage config missing in environment variables");
}

const blobServiceClient = BlobServiceClient.fromConnectionString(AZURE_STORAGE_CONNECTION_STRING);
const containerClient = blobServiceClient.getContainerClient(CONTAINER_NAME);

/**
 * Uploads a file buffer to Azure Blob Storage with Vercel optimization.
 * @param fileBuffer - File data (Buffer/Uint8Array)
 * @param originalName - Original file name
 * @returns URL of the uploaded file
 */
export const uploadToAzure = async (fileBuffer: Buffer, originalName: string): Promise<string> => {
  try {
    const blobName = `${uuidv4()}-${originalName}`;
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);

    // Vercel-optimized upload with timeout
    const uploadPromise = blockBlobClient.uploadData(fileBuffer, {
      blobHTTPHeaders: { blobContentType: "image/jpeg" },
    });

    // Add timeout for Vercel serverless functions
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Azure upload timeout')), 30000); // 30 seconds
    });

    await Promise.race([uploadPromise, timeoutPromise]);
    return blockBlobClient.url;
  } catch (error) {
    console.error('Azure upload error:', error);
    throw new Error(`Failed to upload file: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};
