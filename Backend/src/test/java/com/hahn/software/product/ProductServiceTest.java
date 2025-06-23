package com.hahn.software.product;

import com.cloudinary.Cloudinary;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ProductServiceTest {

    @Mock
    private ProductRepository productRepository;

    @Mock
    private ProductMapper productMapper;

    @Mock
    private Cloudinary cloudinary; // not used in this test but required in constructor

    @InjectMocks
    private ProductService productService;

    @Test
    void testGetProductById_ReturnsProductResponse() {
        // Arrange
        Long productId = 1L;
        Product mockProduct = new Product();
        mockProduct.setId(productId);
        mockProduct.setName("Demo Product");

        ProductResponse mockResponse = new ProductResponse();
        mockResponse.setId(productId);
        mockResponse.setName("Demo Product");

        when(productRepository.findById(productId)).thenReturn(Optional.of(mockProduct));
        when(productMapper.toProductResponse(mockProduct)).thenReturn(mockResponse);

        // Act
        ProductResponse result = productService.getProductById(productId);

        // Assert
        assertNotNull(result);
        assertEquals("Demo Product", result.getName());

        verify(productRepository).findById(productId);
        verify(productMapper).toProductResponse(mockProduct);
    }

    @Test
    void testGetProductById_ThrowsException_WhenNotFound() {
        // Arrange
        Long productId = 99L;
        when(productRepository.findById(productId)).thenReturn(Optional.empty());

        // Act & Assert
        Exception exception = assertThrows(IllegalArgumentException.class, () -> {
            productService.getProductById(productId);
        });

        assertTrue(exception.getMessage().contains("Product not found"));
    }
}
