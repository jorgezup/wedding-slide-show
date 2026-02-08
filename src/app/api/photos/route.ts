import { NextResponse } from "next/server";

interface DriveFile {
  id: string;
  name: string;
  mimeType: string;
}

interface DriveListResponse {
  files: DriveFile[];
}

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY || "";
const GOOGLE_DRIVE_FOLDER_ID = process.env.GOOGLE_DRIVE_FOLDER_ID || "";

export async function GET() {
  if (!GOOGLE_API_KEY || !GOOGLE_DRIVE_FOLDER_ID) {
    return NextResponse.json(
      {
        error: "Google API credentials not configured",
        photos: getDemoPhotos(),
      },
      { status: 200 }
    );
  }

  try {
    const query = `'${GOOGLE_DRIVE_FOLDER_ID}' in parents and mimeType contains 'image/' and trashed = false`;
    const url = `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(query)}&key=${GOOGLE_API_KEY}&fields=files(id,name,mimeType)&orderBy=createdTime desc&pageSize=100&corpora=user`;

    const response = await fetch(url, {
      next: { revalidate: 10 },
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error(`Google Drive API error: ${response.status}`, errorBody);
      throw new Error(`Google Drive API error: ${response.status} - ${errorBody}`);
    }

    const data: DriveListResponse = await response.json();

    const photos = data.files.map((file) => ({
      id: file.id,
      name: file.name,
      url: `https://drive.google.com/uc?export=view&id=${file.id}`,
      thumbnailUrl: `https://drive.google.com/thumbnail?id=${file.id}&sz=w1920`,
    }));

    return NextResponse.json({ photos });
  } catch (error) {
    console.error("Error fetching photos from Google Drive:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch photos",
        photos: getDemoPhotos(),
      },
      { status: 200 }
    );
  }
}

function getDemoPhotos() {
  return [
    {
      id: "demo-1",
      name: "Foto 1",
      url: "",
      thumbnailUrl: "",
      demo: true,
    },
    {
      id: "demo-2",
      name: "Foto 2",
      url: "",
      thumbnailUrl: "",
      demo: true,
    },
    {
      id: "demo-3",
      name: "Foto 3",
      url: "",
      thumbnailUrl: "",
      demo: true,
    },
  ];
}
