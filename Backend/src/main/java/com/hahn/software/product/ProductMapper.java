package com.hahn.software.product;

import org.springframework.stereotype.Component;

import java.io.IOException;
import java.io.InputStream;
import java.net.URL;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.Base64;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class ProductMapper {



    public ProductMapper( ) {
    }

    public Product toProduct(ProductRequest productRequest) {
        return Product.builder()
                .name(productRequest.getName())
                .price(productRequest.getPrice())
                .description(productRequest.getDescription())
                .stockQuantity(productRequest.getStockQuantity())
//                .category(category)
                .build();
    }

    public ProductResponse toProductResponse(Product product) {

        String base64Image = null;
        String photoUrl = product.getPhotoUrl();

        if (photoUrl != null) {
            try {
                byte[] imageBytes;
                if (photoUrl.startsWith("http")) {
                    // Remote image (e.g., Cloudinary)
                    try (InputStream in = new URL(photoUrl).openStream()) {
                        imageBytes = in.readAllBytes();
                    }
                } else {
                    // Local file path
                    imageBytes = Files.readAllBytes(Paths.get(photoUrl));
                }
                base64Image = Base64.getEncoder().encodeToString(imageBytes);
            } catch (IOException e) {
                System.out.println("Error converting product image to Base64: " + e.getMessage());
            }
        }


        return ProductResponse.builder()
                .id(product.getId())
                .name(product.getName())
                .price(product.getPrice())
                .photoUrl(product.getPhotoUrl())
                .description(product.getDescription())
                .stockQuantity(product.getStockQuantity())
                .build();
    }

    public List<ProductResponse> toProductResponseList(List<Product> products) {
        return products.stream()
                .map(this::toProductResponse)
                .collect(Collectors.toList());
    }
}