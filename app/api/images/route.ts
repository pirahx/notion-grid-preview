import { NextResponse } from "next/server";

interface NotionFile {
  type: "file" | "external";
  name: string;
  file?: { url: string };
  external?: { url: string };
}

export async function GET() {
  try {
    const token = process.env.NOTION_API_TOKEN;
    const databaseId = process.env.NOTION_DATABASE_ID;

    if (!token || !databaseId) {
      throw new Error("Missing NOTION_API_TOKEN or NOTION_DATABASE_ID");
    }

    const response = await fetch(`https://api.notion.com/v1/databases/${databaseId}/query`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Notion-Version": "2022-06-28",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Notion API error:", errorData);
      throw new Error(`Notion API error: ${response.status} - ${errorData.message}`);
    }

    const data = await response.json();
    const images: any[] = [];

    for (const page of data.results) {
      const properties = page.properties || {};

      for (const [propName, property] of Object.entries(properties)) {
        if ((property as any).type === "files" && (property as any).files) {
          const files: NotionFile[] = (property as any).files;
          for (const file of files) {
            const imageUrl = file.type === "file" ? file.file?.url : file.external?.url;
            if (imageUrl) {
              images.push({
                id: `${page.id}-${file.name}`,
                src: imageUrl,
                alt: file.name || "Image from Notion",
                title: properties.Name ? (properties.Name as any).title?.[0]?.plain_text : "Untitled",
                date: page.created_time,
              });
            }
          }
        }
      }
    }

    return NextResponse.json(images);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Error in /api/images:", errorMessage);
    return NextResponse.json(
      { 
        error: "Failed to fetch images from Notion",
        details: errorMessage
      },
      { status: 500 }
    );
  }
}