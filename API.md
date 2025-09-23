# Leads Aladdin API Documentation

This document provides comprehensive documentation for the Leads Aladdin API endpoints designed for external application integration.

## Base URL

```
http://your-domain.com/api/v1
```

## Authentication

The API uses Laravel Sanctum for authentication. You need to include a Bearer token in the Authorization header for all API requests.

### Headers Required
```
Authorization: Bearer {your-api-token}
Content-Type: application/json
Accept: application/json
```

### Creating API Tokens

To create an API token, use the artisan command:

```bash
php artisan api:create-token {email} {token-name}
```

Example:
```bash
php artisan api:create-token user@example.com "External App Token"
```

## Rate Limiting

API requests are limited to **100 requests per minute** per IP address.

## Endpoints

### 1. Health Check

Check if the API is available and working.

**GET** `/health`

#### Response
```json
{
    "success": true,
    "message": "API is healthy"
}
```

---

### 2. Search Leads by Phone Number

Search for leads using partial phone number matching. Returns multiple results if found.

**GET** `/leads/search`

#### Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| phone | string | Yes | Phone number (partial matching supported) |
| limit | integer | No | Number of results per page (1-100, default: 10) |
| offset | integer | No | Number of records to skip (default: 0) |

#### Example Request
```bash
curl -X GET "http://your-domain.com/api/v1/leads/search?phone=8899&limit=5" \
  -H "Authorization: Bearer your-token-here" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json"
```

#### Success Response (200)
```json
{
    "success": true,
    "data": [
        {
            "id": 1,
            "nama_pelanggan": "John Doe",
            "no_whatsapp": "628899123456",
            "nama_masjid_instansi": "Masjid Al-Ikhlas",
            "alamat": "Jakarta Selatan",
            "status": "WARM",
            "status_label": "Warm Lead",
            "prioritas": "normal",
            "kebutuhan_karpet": "10x10 meter",
            "potensi_nilai": "15000000.00",
            "tanggal_leads": "2024-09-23",
            "user": {
                "id": 1,
                "name": "Marketing User",
                "email": "marketing@example.com"
            },
            "cabang": {
                "id": 1,
                "nama_cabang": "Cabang Jakarta",
                "lokasi": "Jakarta"
            },
            "sumber_leads": {
                "id": 1,
                "nama": "WhatsApp"
            },
            "tipe_karpet": {
                "id": 1,
                "nama": "Karpet Masjid"
            }
        }
    ],
    "meta": {
        "total": 5,
        "limit": 10,
        "offset": 0,
        "has_more": false
    }
}
```

#### Error Responses

**400 Bad Request** - Validation Error
```json
{
    "success": false,
    "message": "Validation failed",
    "errors": {
        "phone": ["The phone field is required."]
    }
}
```

**401 Unauthorized**
```json
{
    "success": false,
    "message": "Unauthenticated"
}
```

**403 Forbidden**
```json
{
    "success": false,
    "message": "Access denied. You don't have permission to search leads."
}
```

---

### 3. Update Lead Status

Update the status of a specific lead.

**PATCH** `/leads/{id}/status`

#### Path Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | integer | Yes | Lead ID |

#### Request Body

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| status | string | Yes | New status (WARM, HOT, CUSTOMER, COLD, EXIT, CROSS_SELLING) |

#### Example Request
```bash
curl -X PATCH "http://your-domain.com/api/v1/leads/1/status" \
  -H "Authorization: Bearer your-token-here" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
    "status": "HOT"
  }'
```

#### Success Response (200)
```json
{
    "success": true,
    "message": "Lead status updated successfully",
    "data": {
        "id": 1,
        "nama_pelanggan": "John Doe",
        "no_whatsapp": "628899123456",
        "status": "HOT",
        "status_label": "Hot Lead",
        "updated_at": "2024-09-23T10:30:00.000000Z"
    }
}
```

#### Error Responses

**400 Bad Request** - Validation Error
```json
{
    "success": false,
    "message": "Validation failed",
    "errors": {
        "status": ["The selected status is invalid."]
    }
}
```

**401 Unauthorized**
```json
{
    "success": false,
    "message": "Unauthenticated"
}
```

**403 Forbidden**
```json
{
    "success": false,
    "message": "Access denied. You don't have permission to update this lead."
}
```

**404 Not Found**
```json
{
    "success": false,
    "message": "Lead not found"
}
```

**500 Internal Server Error**
```json
{
    "success": false,
    "message": "An error occurred while updating the lead status"
}
```

## Lead Status Values

| Status | Description |
|--------|-------------|
| WARM | Initial contact - potential customer |
| HOT | Customer interested, requesting design/survey |
| CUSTOMER | Customer decided to purchase |
| COLD | No response after 3 follow-ups |
| EXIT | Customer decided not to purchase |
| CROSS_SELLING | Testimonial and other product offerings |

## Phone Number Format

- Phone numbers are stored in international format (62xxx...)
- Search accepts various formats and automatically processes them
- Partial matching is supported (e.g., searching "8899" will find "628899123456")

## User Roles and Permissions

### Marketing
- Can search leads from their assigned branch only
- Can update status of leads from their assigned branch only

### Supervisor
- Can search leads from all branches they supervise
- Can update status of leads from branches they supervise

### Super User
- Can search leads from all branches
- Can update status of any lead in the system

## Error Handling

All API responses follow a consistent format:

### Success Response Format
```json
{
    "success": true,
    "message": "Operation completed successfully",
    "data": { /* response data */ },
    "meta": { /* pagination/metadata */ }
}
```

### Error Response Format
```json
{
    "success": false,
    "message": "Error description",
    "errors": { /* validation errors if applicable */ }
}
```

## Rate Limiting Headers

API responses include rate limiting information in headers:

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1632147600
```

## Logging and Security

- All API requests are logged for security and debugging purposes
- Failed authentication attempts are logged
- Sensitive operations (status updates) include audit trails
- Rate limiting prevents API abuse

## Testing

For testing purposes, you can use the following curl commands:

### Test Authentication
```bash
curl -X GET "http://your-domain.com/api/v1/user" \
  -H "Authorization: Bearer your-token-here" \
  -H "Accept: application/json"
```

### Test Search
```bash
curl -X GET "http://your-domain.com/api/v1/leads/search?phone=8123" \
  -H "Authorization: Bearer your-token-here" \
  -H "Accept: application/json"
```

### Test Status Update
```bash
curl -X PATCH "http://your-domain.com/api/v1/leads/1/status" \
  -H "Authorization: Bearer your-token-here" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{"status": "HOT"}'
```

## Support

For API support or questions, please contact the development team or create an issue in the project repository.