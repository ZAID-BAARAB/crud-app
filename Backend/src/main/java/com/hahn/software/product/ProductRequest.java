package com.hahn.software.product;


import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import org.springframework.web.multipart.MultipartFile;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductRequest {

    @NotBlank(message = "Name is required")
    private String name;

    private String description;

    private Float stockQuantity;

    @NotNull(message = "Price is required")
    private Double price;

    private MultipartFile productPhotoFile;

    private String photoUrl;

}
