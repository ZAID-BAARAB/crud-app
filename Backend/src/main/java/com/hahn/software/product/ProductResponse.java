package com.hahn.software.product;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductResponse {

    private Long id;

    private String name;

    private String description;

    private Float stockQuantity;

    private Double price;

    private String photoUrl;
}
