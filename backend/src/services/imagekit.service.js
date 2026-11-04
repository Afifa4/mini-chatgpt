import ImageKit, { toFile } from "@imagekit/nodejs";

const imagekit = new ImageKit({
  privateKey: process.env.IMG_KIT_KEY,
});

export async function uploadPdfToImageKit(buffer, fileName) {
  const response = await imagekit.files.upload({
    file: await toFile(buffer, fileName),
    fileName,
    folder: "/pdfs",
    isPrivateFile: true,
  });

  return {
    fileUrl: response.url,
    fileId: response.fileId,
  };
}

export async function deleteFileFromImageKit(fileId) {
  await imagekit.files.delete(fileId);
}
