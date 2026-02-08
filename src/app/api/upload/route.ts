import { NextRequest, NextResponse } from "next/server";
import { google } from "googleapis";
import { Readable } from "stream";

const GOOGLE_DRIVE_FOLDER_ID = process.env.GOOGLE_DRIVE_FOLDER_ID || "";

// Service account credentials from environment variable
function getServiceAccountCredentials() {
  const credentials = process.env.GOOGLE_SERVICE_ACCOUNT_CREDENTIALS;
  if (!credentials) {
    throw new Error("GOOGLE_SERVICE_ACCOUNT_CREDENTIALS not configured");
  }
  try {
    return JSON.parse(credentials);
  } catch {
    throw new Error("Invalid GOOGLE_SERVICE_ACCOUNT_CREDENTIALS format");
  }
}

// Create Google Drive client with service account
async function getDriveClient() {
  const credentials = getServiceAccountCredentials();
  
  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ["https://www.googleapis.com/auth/drive.file"],
  });

  const drive = google.drive({ version: "v3", auth });
  return drive;
}

// Convert Web ReadableStream to Node.js Readable stream
// This is necessary because Next.js uses Web Streams API (standard for modern web)
// but googleapis library requires Node.js streams
async function webStreamToNodeStream(webStream: ReadableStream): Promise<Readable> {
  const reader = webStream.getReader();
  const readable = new Readable({
    async read() {
      try {
        const { done, value } = await reader.read();
        if (done) {
          this.push(null);
        } else {
          this.push(Buffer.from(value));
        }
      } catch (error) {
        this.destroy(error as Error);
      }
    },
  });
  return readable;
}

export async function POST(request: NextRequest) {
  try {
    // Check if service account is configured
    if (!process.env.GOOGLE_SERVICE_ACCOUNT_CREDENTIALS) {
      return NextResponse.json(
        {
          error: "Service account not configured. Please set GOOGLE_SERVICE_ACCOUNT_CREDENTIALS environment variable.",
        },
        { status: 500 }
      );
    }

    if (!GOOGLE_DRIVE_FOLDER_ID) {
      return NextResponse.json(
        {
          error: "Google Drive folder ID not configured",
        },
        { status: 500 }
      );
    }

    // Parse form data
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    // Validate file type (only images)
    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "Only image files are allowed" },
        { status: 400 }
      );
    }

    // Get Drive client
    const drive = await getDriveClient();

    // Convert file to stream
    const fileStream = await webStreamToNodeStream(file.stream());

    // Upload file to Google Drive
    const fileMetadata = {
      name: file.name,
      parents: [GOOGLE_DRIVE_FOLDER_ID],
    };

    const media = {
      mimeType: file.type,
      body: fileStream,
    };

    const response = await drive.files.create({
      requestBody: fileMetadata,
      media: media,
      fields: "id,name,mimeType,createdTime",
    });

    return NextResponse.json({
      success: true,
      file: {
        id: response.data.id,
        name: response.data.name,
        mimeType: response.data.mimeType,
        createdTime: response.data.createdTime,
      },
    });
  } catch (error) {
    console.error("Error uploading file:", error);
    
    // Return a generic error message to the client to avoid exposing internal details
    const errorMessage = error instanceof Error && error.message.includes("GOOGLE_SERVICE_ACCOUNT_CREDENTIALS")
      ? "Service account not configured properly"
      : "Failed to upload file";
    
    return NextResponse.json(
      {
        error: errorMessage,
      },
      { status: 500 }
    );
  }
}
