package com.hahn.software.product;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.net.URL;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Base64;
import java.util.List;
import java.util.Map;

@Service
public class ProductService {
    private final ProductRepository productRepository;
//    private final UserRepository userRepository;
//    private final CategoryRepository categoryRepository;
    private final ProductMapper productMapper;
    private final Cloudinary cloudinary;

    @Autowired
    public ProductService(ProductRepository productRepository,   ProductMapper productMapper,  Cloudinary cloudinary) {
        this.productRepository = productRepository;
        this.productMapper = productMapper;
        this.cloudinary = cloudinary;
    }

    //<===== Create  New Product =============>
    @Transactional
    public ProductResponse createProduct(ProductRequest productRequest) throws Exception {


        Product product = productMapper.toProduct(productRequest);
        String productPhotoPath = null;
        // 2) upload to Cloudinary instead of local FS
        if (productRequest.getProductPhotoFile() != null
                && !productRequest.getProductPhotoFile().isEmpty()) {

            MultipartFile photoFile = productRequest.getProductPhotoFile();

            Map<?, ?> uploadResult = cloudinary.uploader().upload(
                    photoFile.getBytes(),
                    ObjectUtils.asMap(
                            "folder", "hahnTestProductPhotos",       // optional: organize in a folder
                            "public_id",                   // optional: set your own ID
                            System.currentTimeMillis() + "_" + photoFile.getOriginalFilename(),
                            "overwrite", true
                    )
            );

            // Cloudinary returns a secure_url

            String secureUrl = uploadResult.get("secure_url").toString();
            product.setPhotoUrl(secureUrl);
        }





        // Save the product to the database
        Product savedProduct = productRepository.save(product);

        ProductResponse productResponse = productMapper.toProductResponse(savedProduct);

        // Encode the photo to Base64 and set it in the response

//        if (savedProduct.getProductPhoto() != null) {
//            try (InputStream in = new URL(productPhotoPath).openStream()) {
//                byte[] photoBytes = in.readAllBytes();
//                String photoBase64 = Base64.getEncoder().encodeToString(photoBytes);
//                productResponse.setPhotoBase64(photoBase64);
//            } catch (IOException e) {
//                System.out.println("Error !,could not transform photo file from Cloudinary  to Base64");
//            }
//        }
        return productResponse;

    }

    //<<===== Update Product Details
    @Transactional
    public ProductResponse updateProduct(Long id, ProductRequest productRequest) throws IOException {
        // Check if the product exists
        Product existingProduct = productRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Product not found with ID: " + id));

//        // Check if the category exists
//        Category category = categoryRepository.findById(productRequest.getCategoryId())
//                .orElseThrow(() -> new IllegalArgumentException("Category not found with ID: " + productRequest.getCategoryId()));
//        existingProduct.setCategory(category);


        existingProduct.setName(productRequest.getName());
        existingProduct.setPrice(productRequest.getPrice());
        existingProduct.setDescription(productRequest.getDescription());
        existingProduct.setPrice(productRequest.getPrice());

        // Handle photo update + Cloudinary
        MultipartFile photoFile = productRequest.getProductPhotoFile();
        if (photoFile != null) {
            // Delete old from Cloudinary if exists
            String oldUrl = existingProduct.getPhotoUrl();
            if (oldUrl != null && !oldUrl.isEmpty()) {
                // extract public_id from URL or store public_id separately
                String publicId = oldUrl.substring(oldUrl.lastIndexOf('/') + 1, oldUrl.lastIndexOf('.'));
                cloudinary.uploader().destroy("productPhotos/" + publicId, ObjectUtils.emptyMap());
            }
            if (!photoFile.isEmpty()) {
                Map<?, ?> uploadResult = cloudinary.uploader().upload(
                        photoFile.getBytes(),
                        ObjectUtils.asMap(
                                "folder", "productPhotos",
                                "public_id", System.currentTimeMillis() + "_" + photoFile.getOriginalFilename(),
                                "overwrite", true
                        )
                );
                existingProduct.setPhotoUrl(uploadResult.get("secure_url").toString());
            } else {
                existingProduct.setPhotoUrl(null);
            }
        }

        Product updatedProduct = productRepository.save(existingProduct);
        ProductResponse productResponse = productMapper.toProductResponse(updatedProduct);


        return productResponse;
    }

//    private void deleteOldPhotoIfExists(Product existingProduct) throws CustomResponse {
//        if (existingProduct.getProductPhoto() != null) {
//            try {
//                Files.deleteIfExists(Paths.get(existingProduct.getProductPhoto()));
//            } catch (CustomResponse | IOException customResponse) {
//                throw new CustomResponse("Failed to delete old photo: ", HttpStatus.INTERNAL_SERVER_ERROR);
//            }
//        }
//    }

    //<===== Pagable part Find all ==========?
    public Page<ProductResponse> getAllProducts(int page, int size) {
        // Create a Pageable object for pagination
        Pageable pageable = PageRequest.of(page, size);

        // Fetch paginated parts from the repository
        Page<Product> productsPage = productRepository.findAll(pageable);

        // Map each Part entity to PartResponse
        return productsPage.map(productMapper::toProductResponse);
    }


    //<==== filter Parts by Name =========>
    public Page<ProductResponse> filterProductsByName(String name, int page, int size) throws IOException {
        // Create a Pageable object for pagination
        Pageable pageable = PageRequest.of(page, size);

        // Fetch filtered parts from the repository
        Page<Product> filteredProducts;
        if (name != null && !name.isEmpty()) {
            // Filter by name only
            filteredProducts = productRepository.findByNameContainingIgnoreCase(name, pageable);
        } else {
            // No filters applied, return all parts
            filteredProducts = productRepository.findAll(pageable);
        }

        // Map each Part entity to PartResponse
        return filteredProducts.map(productMapper::toProductResponse);
    }

    // Get product by ID
    @Transactional
    public ProductResponse getProductById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Product not found with ID: " + id));
        return productMapper.toProductResponse(product);
    }

    @Transactional
    public List<ProductResponse> getTop10ByOrderByProductId() {
        List<Product> products = productRepository.findTop10ByOrderById();
        return productMapper.toProductResponseList(products);
    }

    // delete product by id
    @Transactional
    public void deleteProductById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Product not found with ID: " + id));
        productRepository.delete(product);
    }


}