// app/api/homeform/route.ts
import { NextResponse } from "next/server";
import HomeForm from "@/app/(api)/model/School";
import User from "@/app/(api)/model/User";
import { connectDB } from "@/utils/db_connection";
import { uploadToAzure } from "@/utils/azureUpload";

export async function POST(req: Request) {
    try {
        try {

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
        } catch (error) {
            console.error('Error in POST /api/school/inspection:', error);
            return NextResponse.json({ success: false, error: error }, { status: 400 });
        }
        // Parse multipart/form-data
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}
