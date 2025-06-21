package com.hahn.software.product;

import com.hahn.software.exception.CustomResponse;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/v1/products")
public class ProductController {

    private final ProductService productService;
    private final ProductMapper productMapper;

    @Autowired
    public ProductController(ProductService productService, ProductMapper productMapper) {
        this.productService = productService;
        this.productMapper = productMapper;
    }


// <========= Create a new product =================>

    @PostMapping(value = "/create-product", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
//    @PreAuthorize("hasRole('ADMIN')")  // You can give access to this API Only to admins
    public ResponseEntity<ProductResponse> createProduct(

            @Valid @RequestPart("productRequest") ProductRequest productRequest,
            @RequestPart(value = "productPhotoFile", required = false) MultipartFile productPhotoFile) throws Exception {
        productRequest.setProductPhotoFile(productPhotoFile);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(productService.createProduct(productRequest));
    }

    //<======== update product details ==============>
    @PutMapping(value = "/update-product/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
//    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ProductResponse> updateProduct(
            @PathVariable Long id,
            @RequestPart("productRequest") ProductRequest productRequest,
            @RequestPart(value = "productPhotoFile", required = false) MultipartFile productPhotoFile) {

        try {
            productRequest.setProductPhotoFile(productPhotoFile);
            ProductResponse response = productService.updateProduct(id, productRequest);
            return new ResponseEntity<>(response, HttpStatus.OK);

        } catch (IOException e) {
            throw new CustomResponse("Error updating photo : " + e.getMessage(), HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            throw new CustomResponse("Internal Error : " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Get Product by ID
    @GetMapping("/public/getProductById/{id}")
    public ResponseEntity<ProductResponse> getProductById(@PathVariable Long id) {
        ProductResponse productResponse = productService.getProductById(id);
        return ResponseEntity.ok(productResponse);
    }


    //get Top 10 products for home page
    @GetMapping("/public/getTop10ByOrderByProductId")
    public List<ProductResponse> getTop10ByOrderByProductId() {
        return productService.getTop10ByOrderByProductId();
    }

    //<===== Filter Parts by Name ==============>
    @GetMapping("/public/filter-by-name")
    public Page<ProductResponse> filterProducts(
            @RequestParam(required = false) String name,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) throws IOException {
        return productService.filterProductsByName(name, page, size);
    }

    @DeleteMapping("/delete-product/{id}")
//    @PreAuthorize("hasRole('ADMIN')")   this API can be secured only for admin
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        try {
            productService.deleteProductById(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (Exception e) {
            throw new CustomResponse("Error during delete : " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    @GetMapping("/all")
    public ResponseEntity<Page<ProductResponse>> getAllProducts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Page<ProductResponse> productsPage = productService.getAllProducts(page, size);
        return ResponseEntity.ok(productsPage);
    }



//    @GetMapping("/getProductsOutOfStock")
//    public ResponseEntity<List<ProductResponse>> getProductsOutOfStock() {
//        List<ProductResponse> outOfStockProducts = productMapper.toProductResponseList(productService.findByStatus(ProductStatus.OUT_OF_STOCK));
//        return ResponseEntity.ok(outOfStockProducts);
//    }
}
