# Pagination and Sorting REST API

A Spring Boot REST API demonstrating efficient pagination and sorting with Spring Data JPA.

This experiment also demonstrates backend read optimization with Caffeine caching and a service boundary that keeps database access explicit.

## Concepts demonstrated

- Pagination avoids loading an entire table into memory.
- Sorting is pushed to the database through Spring Data's `Pageable`.
- Stable ordering adds `id` as a tie-breaker so pages do not shuffle between requests.
- Input validation keeps page sizes bounded and sort fields predictable.
- The response includes metadata needed to build a client-side paginator.
- Repeated page and product reads are served from a bounded, expiring cache.
- Writes evict cached reads so newly created products are visible immediately.
- The list query uses one indexed-style paginated repository query instead of loading every row.

## Run

Requirements: Java 17+ and Maven 3.9+.

```powershell
mvn spring-boot:run
```

The API starts at `http://localhost:8080`.

## API examples

Get the first page of 5 products, sorted by price descending:

```http
GET http://localhost:8080/api/products?page=0&size=5&sort=price&direction=desc
```

Response shape:

```json
{
  "content": [
    { "id": 30, "name": "Product 30", "category": "Office", "price": 114.99 }
  ],
  "page": 0,
  "size": 5,
  "totalElements": 30,
  "totalPages": 6,
  "first": true,
  "last": false,
  "sort": "price,desc"
}
```

Create a product:

```http
POST http://localhost:8080/api/products
Content-Type: application/json

{
  "name": "Wireless Keyboard",
  "category": "Tech",
  "price": 49.99
}
```

Get one product (cached by ID after the first database read):

```http
GET http://localhost:8080/api/products/1
```

Allowed sort fields are `id`, `name`, `category`, and `price`. Page size must be between 1 and 100. H2 data is recreated and seeded with 30 products each time the app starts.

## Read optimization notes

`ProductService` caches identical page requests in the `products` cache and individual product requests in `productById`. Caffeine keeps at most 500 entries and expires entries after five minutes. Creating a product evicts both caches to prevent stale responses.

The N+1 query problem occurs when one query loads a list and then one extra query runs for every row, producing `1 + N` database calls. This example avoids that pattern by returning the product fields needed by the list in one `Pageable` query. When related entities are added later, use a DTO projection or a carefully scoped fetch join/entity graph rather than triggering lazy loads inside a loop.

The cache is intentionally placed in the service layer, not the controller, so every caller shares the same optimized read path.

## Project structure

- `Product`: JPA entity and request validation.
- `ProductRepository`: Spring Data repository with `findAll(Pageable)`.
- `ProductController`: REST query parameters, validation, and HTTP responses.
- `ProductService`: cached read operations and cache invalidation on writes.
- `CacheConfiguration`: bounded Caffeine cache with a five-minute expiry.
- `PageResponse`: client-friendly pagination metadata.
- `ProductDataLoader`: sample data for testing pagination immediately.
