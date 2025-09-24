// app/api/homeform/route.ts
import { NextResponse } from "next/server";
import HomeForm from "@/app/(api)/model/School";
import User from "@/app/(api)/model/User";
import { connectDB } from "@/utils/db_connection";
import { uploadToAzure } from "@/utils/azureUpload";

// Vercel serverless function configuration
export const config = {
    maxDuration: 300, // 5 minutes for file uploads
};

export async function POST(req: Request): Promise<Response> {
    try {
        // Add timeout handling for Vercel
        const timeoutPromise = new Promise<never>((_, reject) => {
            setTimeout(() => reject(new Error('Request timeout')), 280000); // 4.5 minutes
        });

        const processPromise = async (): Promise<Response> => {
            const formData = await req.formData();

            // Extract simple fields
            const schoolName = formData.get("schoolName") as string;
            const boardFile = formData.get("boardFile") as File | null;
            const state = formData.get("state") as string;
            const district = formData.get("district") as string;
            const block = formData.get("block") as string;
            const udiseCode = formData.get("udiseCode") as string;

            // ✅ Validate UDISE code and user
            if (!udiseCode || !/^\d{6,}$/.test(udiseCode)) {
                return NextResponse.json(
                    { success: false, error: "Invalid UDISE Code" },
                    { status: 400 }
                );
            }

            await connectDB();
            const user = await User.findOne({ udiseCode });
            if (!user) {
                return NextResponse.json(
                    { success: false, error: "User not found with the provided UDISE code" },
                    { status: 404 }
                );
            }

            // const existingSchool = await HomeForm.findOne({ udiseCode });
            // if (existingSchool) {
            //   return NextResponse.json(
            //     { success: false, error: "School inspection already exists for this UDISE code" },
            //     { status: 409 }
            //   );
            // }

            // ✅ Upload board file
            let boardFileUrl: string | null = null;
            if (boardFile) {
                const buffer = Buffer.from(await boardFile.arrayBuffer());
                boardFileUrl = await uploadToAzure(buffer, boardFile.name);
            }

            // ✅ Handle room image fields
            const roomImageFields = [
                "interiorCeiling",
                "interiorFrontWall",
                "interiorRightWall",
                "interiorBackWall",
                "interiorLeftWall",
                "interiorFloor",
                "exteriorFrontWall",
                "exteriorRightWall",
                "exteriorLeftWall",
                "exteriorBackWall",
                "surroundingAreaOfBackwall",
                "surroundingAreaOfLeftwall",
                "surroundingAreaOfFrontwall",
                "surroundingAreaOfRightwall",
                "roof",
            ];

            const processedRooms: Record<string, string[]>[] = [];

            for (let roomIndex = 0; ; roomIndex++) {
                let hasRoom = false;
                const processedRoom: Record<string, string[]> = {};

                for (const field of roomImageFields) {
                    const files = formData.getAll(`rooms[${roomIndex}][${field}]`) as File[];

                    if (files.length > 0) {
                        hasRoom = true;

                        // Upload all files in parallel for this field
                        const urls = await Promise.all(
                            files.map(async (file) => {
                                const buffer = Buffer.from(await file.arrayBuffer());
                                return uploadToAzure(buffer, file.name);
                            })
                        );

                        processedRoom[field] = urls;
                    } else {
                        processedRoom[field] = [];
                    }
                }

                if (!hasRoom) break;
                processedRooms.push(processedRoom);
            }


            // ✅ Save in DB
            const newForm = await HomeForm.create({
                schoolName,
                boardFile: boardFileUrl,
                state,
                district,
                block,
                udiseCode,
                rooms: processedRooms,
            });

            return NextResponse.json({ success: true, data: newForm }, { status: 201 });
        };

        // Race between processing and timeout
        return await Promise.race([processPromise(), timeoutPromise]);

    } catch (error: any) {
        console.error('Error in POST /api/school/inspection:', error);
        
        // Handle specific error types
        if (error.name === 'ValidationError') {
            return NextResponse.json(
                { success: false, error: 'Validation failed: ' + error.message },
                { status: 400 }
            );
        }
        
        if (error.code === 'LIMIT_FILE_SIZE') {
            return NextResponse.json(
                { success: false, error: 'File too large. Please reduce file size and try again.' },
                { status: 413 }
            );
        }
        
        if (error.message?.includes('timeout') || error.message?.includes('Request timeout')) {
            return NextResponse.json(
                { success: false, error: 'Request timeout. Please try again with smaller files.' },
                { status: 408 }
            );
        }
        
        // Vercel-specific error handling
        if (error.message?.includes('Function execution timed out')) {
            return NextResponse.json(
                { success: false, error: 'Server timeout. Please try again with fewer files.' },
                { status: 408 }
            );
        }
        
        return NextResponse.json(
            { success: false, error: 'Internal server error. Please try again.' },
            { status: 500 }
        );
    }
}
