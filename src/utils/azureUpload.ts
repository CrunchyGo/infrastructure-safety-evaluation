// utils/azureUpload.ts
import { BlobServiceClient } from "@azure/storage-blob";
import { v4 as uuidv4 } from "uuid";


const AZURE_STORAGE_CONNECTION_STRING = process.env.AZURE_STORAGE_CONNECTION_STRING;
const CONTAINER_NAME = process.env.AZURE_CONTAINER_NAME;

if (!AZURE_STORAGE_CONNECTION_STRING || !CONTAINER_NAME) {
  throw new Error("Azure storage config missing in environment variables");
}

const blobServiceClient = BlobServiceClient.fromConnectionString(AZURE_STORAGE_CONNECTION_STRING);
const containerClient = blobServiceClient.getContainerClient(CONTAINER_NAME);

/**
 * Uploads a file buffer to Azure Blob Storage.
 * @param fileBuffer - File data (Buffer/Uint8Array)
 * @param originalName - Original file name
 * @returns URL of the uploaded file
 */
export const uploadToAzure = async (fileBuffer: Buffer, originalName: string): Promise<string> => {
  const blobName = `${uuidv4()}-${originalName}`;
  const blockBlobClient = containerClient.getBlockBlobClient(blobName);

  await blockBlobClient.uploadData(fileBuffer, {
    blobHTTPHeaders: { blobContentType: "image/jpeg" }, // set mime type (can adjust later)
  });

  return blockBlobClient.url;
};
