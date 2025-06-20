export async function uploadToCloudinary(file) {
  const data = new FormData();
  data.append("file", file);
  data.append("upload_preset", "Trendify"); // your Cloudinary upload preset
  data.append("cloud_name", "dcevyuvcf");   // your cloud name

  const response = await fetch("https://api.cloudinary.com/v1_1/dcevyuvcf/image/upload", {
    method: "POST",
    body: data,
  });

  const json = await response.json();

  // Debug: log entire response
  console.log("Cloudinary response:", json);

  if (!json.secure_url) {
    throw new Error("Image upload failed: " + (json.error?.message || "Unknown error"));
  }

  return json.secure_url;
}
