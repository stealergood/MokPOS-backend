import streamifier from "streamifier";
import cloudinary from "../config/cloudinary.js";

export const uploadToCloudinary = async (buffer) => {
  return new Promise((resolve, reject) => {
    const upload_stream = cloudinary.uploader.upload_stream((result, error) => {
      if (error) {
        reject(error);
      }
      resolve(result);
    });
    streamifier.createReadStream(buffer).pipe(upload_stream);
  });
};

export const deleteFromCloudinary = async (publicId) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.destroy(publicId, (error, result) => {
      if (error) return reject(error);
      resolve(result);
    });
  });
};