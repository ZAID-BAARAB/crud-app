package com.hahn.software.product;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@Service
public class CloudinaryService {

    private final Cloudinary cloudinary;

    public CloudinaryService(Cloudinary cloudinary) {
        this.cloudinary = cloudinary;
    }

    /**
     * Uploads an image or video file to Cloudinary in the specified folder.
     * Returns the secure URL of the uploaded resource.
     */
    public String uploadFile(MultipartFile file, String folderName) throws IOException {
        Map<?, ?> uploadResult = cloudinary.uploader().upload(
                file.getBytes(),
                ObjectUtils.asMap(
                        "folder", folderName
                )
        );
        return (String) uploadResult.get("secure_url");
    }
    /**
     * Deletes any resource (image, video, raw) by its publicId and resource type.
     * @param publicId    the Cloudinary public_id (folder/path + filename without extension)
     * @param resourceType  "image", "video", or "raw"
     * @return the Cloudinary response map, e.g. { "result" : "ok" }
     * @throws IOException if the Cloudinary call fails
     */
    public Map<?, ?> deleteResource(String publicId, String resourceType) throws IOException {
        return cloudinary.uploader().destroy(
                publicId,
                ObjectUtils.asMap("resource_type", resourceType)
        );
    }



}
