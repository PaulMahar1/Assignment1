# Subscription Service Tracker - Project Requirements Document

## 1. Project Overview

### 1.1 Purpose
Develop a backend-only REST API for a subscription service tracker that allows users to manage, monitor, and analyze their recurring subscriptions across various services and platforms.

### 1.2 Scope
This PRD covers the backend API design for a single-user subscription management system with full CRUD operations, cost analytics, and notification capabilities.

### 1.3 Key Features
- Subscription management (CRUD operations)
- Payment account tracking
- Category-based organization
- Cost analytics and reporting
- Trial period tracking with notifications
- Budget alerts and spending limits
- Upcoming payment calculations
- Export functionality

## 2. Data Models

### 2.1 Subscription
```json
{
  "id": "string (UUID)",
  "name": "string (required)",
  "description": "string (optional)",
  "cost": "decimal (required)",
  "billing_cycle": "enum [weekly, monthly, quarterly, semi_annual, annual] (required)",
  "billing_day": "integer (1-31) (required)",
  "next_billing_date": "date (calculated)",
  "payment_account_id": "string (UUID, foreign key)",
  "category_id": "string (UUID, foreign key)",
  "status": "enum [active, paused, cancelled, expired] (required)",
  "trial_end_date": "date (optional)",
  "is_trial": "boolean (default: false)",
  "icon": "string (optional - emoji/icon identifier)",
  "service_logo": "string (optional - predefined service identifier)",
  "start_date": "date (required)",
  "end_date": "date (optional)",
  "created_at": "timestamp",
  "updated_at": "timestamp"
}
```

### 2.2 PaymentAccount
```json
{
  "id": "string (UUID)",
  "name": "string (required)",
  "type": "enum [credit_card, debit_card, bank_account, paypal, apple_pay, google_pay, other] (required)",
  "created_at": "timestamp",
  "updated_at": "timestamp"
}
```

### 2.3 Category
```json
{
  "id": "string (UUID)",
  "name": "string (required, unique)",
  "color": "string (hex color, optional)",
  "is_custom": "boolean (default: true)",
  "created_at": "timestamp",
  "updated_at": "timestamp"
}
```

### 2.4 BudgetAlert
```json
{
  "id": "string (UUID)",
  "category_id": "string (UUID, foreign key, optional)",
  "limit_amount": "decimal (required)",
  "period": "enum [daily, weekly, monthly, quarterly, annual] (required)",
  "is_active": "boolean (default: true)",
  "created_at": "timestamp",
  "updated_at": "timestamp"
}
```

### 2.5 NotificationPreference
```json
{
  "id": "string (UUID)",
  "type": "enum [upcoming_payment, trial_ending, budget_exceeded] (required)",
  "days_before": "integer (required for upcoming_payment and trial_ending)",
  "is_enabled": "boolean (default: true)",
  "created_at": "timestamp",
  "updated_at": "timestamp"
}
```

## 3. API Endpoints

### 3.1 Subscriptions

#### GET /api/subscriptions
**Purpose**: Retrieve all subscriptions with filtering and sorting options
**Query Parameters**:
- `status` (optional): Filter by status
- `category_id` (optional): Filter by category
- `sort_by` (optional): `name`, `cost`, `next_billing_date`, `created_at`
- `sort_order` (optional): `asc`, `desc`
- `limit` (optional): Number of results (default: 50)
- `offset` (optional): Pagination offset

**Response**: `200 OK`
```json
{
  "subscriptions": [Subscription],
  "total_count": "integer",
  "has_more": "boolean"
}
```

#### GET /api/subscriptions/{id}
**Purpose**: Retrieve a specific subscription
**Response**: `200 OK` - Subscription object

#### POST /api/subscriptions
**Purpose**: Create a new subscription
**Request Body**: Subscription object (without id, created_at, updated_at, next_billing_date)
**Response**: `201 Created` - Created Subscription object

#### PUT /api/subscriptions/{id}
**Purpose**: Update an existing subscription
**Request Body**: Partial Subscription object
**Response**: `200 OK` - Updated Subscription object

#### DELETE /api/subscriptions/{id}
**Purpose**: Delete a subscription
**Response**: `204 No Content`

#### GET /api/subscriptions/upcoming
**Purpose**: Get subscriptions with upcoming payments
**Query Parameters**:
- `days` (optional): Number of days to look ahead (default: 30)
**Response**: `200 OK`
```json
{
  "upcoming_subscriptions": [
    {
      "subscription": "Subscription object",
      "days_until_payment": "integer"
    }
  ]
}
```

### 3.2 Payment Accounts

#### GET /api/payment-accounts
**Purpose**: Retrieve all payment accounts
**Response**: `200 OK` - Array of PaymentAccount objects

#### GET /api/payment-accounts/{id}
**Purpose**: Retrieve a specific payment account
**Response**: `200 OK` - PaymentAccount object

#### POST /api/payment-accounts
**Purpose**: Create a new payment account
**Request Body**: PaymentAccount object (without id, created_at, updated_at)
**Response**: `201 Created` - Created PaymentAccount object

#### PUT /api/payment-accounts/{id}
**Purpose**: Update a payment account
**Request Body**: Partial PaymentAccount object
**Response**: `200 OK` - Updated PaymentAccount object

#### DELETE /api/payment-accounts/{id}
**Purpose**: Delete a payment account
**Response**: `204 No Content`

### 3.3 Categories

#### GET /api/categories
**Purpose**: Retrieve all categories (predefined + custom)
**Response**: `200 OK` - Array of Category objects

#### GET /api/categories/{id}
**Purpose**: Retrieve a specific category
**Response**: `200 OK` - Category object

#### POST /api/categories
**Purpose**: Create a custom category
**Request Body**: Category object (without id, created_at, updated_at)
**Response**: `201 Created` - Created Category object

#### PUT /api/categories/{id}
**Purpose**: Update a category (only custom categories)
**Request Body**: Partial Category object
**Response**: `200 OK` - Updated Category object

#### DELETE /api/categories/{id}
**Purpose**: Delete a custom category
**Response**: `204 No Content`

### 3.4 Analytics & Reporting

#### GET /api/analytics/costs
**Purpose**: Get cost breakdown and analytics
**Query Parameters**:
- `period` (required): `daily`, `weekly`, `monthly`, `quarterly`, `annual`
- `start_date` (optional): Start date for analysis
- `end_date` (optional): End date for analysis
- `category_id` (optional): Filter by category

**Response**: `200 OK`
```json
{
  "total_cost": "decimal",
  "period_cost": "decimal",
  "cost_by_category": [
    {
      "category": "Category object",
      "cost": "decimal",
      "percentage": "decimal"
    }
  ],
  "cost_by_payment_account": [
    {
      "payment_account": "PaymentAccount object",
      "cost": "decimal",
      "percentage": "decimal"
    }
  ],
  "trend_data": [
    {
      "period_label": "string",
      "cost": "decimal",
      "subscription_count": "integer"
    }
  ]
}
```

#### GET /api/analytics/spending-comparison
**Purpose**: Compare current spending with previous periods
**Query Parameters**:
- `period` (required): `monthly`, `quarterly`, `annual`

**Response**: `200 OK`
```json
{
  "current_period": {
    "cost": "decimal",
    "subscription_count": "integer"
  },
  "previous_period": {
    "cost": "decimal",
    "subscription_count": "integer"
  },
  "change_percentage": "decimal",
  "change_amount": "decimal"
}
```

### 3.5 Budget Alerts

#### GET /api/budget-alerts
**Purpose**: Retrieve all budget alerts
**Response**: `200 OK` - Array of BudgetAlert objects

#### GET /api/budget-alerts/{id}
**Purpose**: Retrieve a specific budget alert
**Response**: `200 OK` - BudgetAlert object

#### POST /api/budget-alerts
**Purpose**: Create a new budget alert
**Request Body**: BudgetAlert object (without id, created_at, updated_at)
**Response**: `201 Created` - Created BudgetAlert object

#### PUT /api/budget-alerts/{id}
**Purpose**: Update a budget alert
**Request Body**: Partial BudgetAlert object
**Response**: `200 OK` - Updated BudgetAlert object

#### DELETE /api/budget-alerts/{id}
**Purpose**: Delete a budget alert
**Response**: `204 No Content`

#### GET /api/budget-alerts/violations
**Purpose**: Get current budget violations
**Response**: `200 OK`
```json
{
  "violations": [
    {
      "budget_alert": "BudgetAlert object",
      "current_spending": "decimal",
      "overage_amount": "decimal",
      "overage_percentage": "decimal"
    }
  ]
}
```

### 3.6 Notification Preferences

#### GET /api/notification-preferences
**Purpose**: Retrieve all notification preferences
**Response**: `200 OK` - Array of NotificationPreference objects

#### POST /api/notification-preferences
**Purpose**: Create/update notification preferences
**Request Body**: NotificationPreference object (without id, created_at, updated_at)
**Response**: `201 Created` - Created NotificationPreference object

#### PUT /api/notification-preferences/{id}
**Purpose**: Update notification preferences
**Request Body**: Partial NotificationPreference object
**Response**: `200 OK` - Updated NotificationPreference object

### 3.7 Export Functionality

#### GET /api/export/subscriptions
**Purpose**: Export subscriptions data
**Query Parameters**:
- `format` (required): `csv`, `json`
- `include_cancelled` (optional): Include cancelled subscriptions (default: false)
- `category_id` (optional): Filter by category

**Response**: `200 OK` - File download

#### GET /api/export/analytics
**Purpose**: Export analytics report
**Query Parameters**:
- `format` (required): `csv`, `json`, `pdf`
- `period` (required): `monthly`, `quarterly`, `annual`
- `start_date` (optional): Start date for report
- `end_date` (optional): End date for report

**Response**: `200 OK` - File download

### 3.8 Service Icons & Logos

#### GET /api/service-templates
**Purpose**: Get predefined service templates with icons/logos
**Response**: `200 OK`
```json
{
  "services": [
    {
      "name": "string",
      "category_suggestion": "string",
      "icon": "string",
      "logo_url": "string (optional)",
      "common_prices": ["decimal array"]
    }
  ]
}
```

## 4. Business Logic & Calculations

### 4.1 Next Billing Date Calculation
- For monthly subscriptions: Add 1 month to the last billing date, adjust for month-end dates
- For weekly subscriptions: Add 7 days to the last billing date
- For quarterly: Add 3 months
- For semi-annual: Add 6 months
- For annual: Add 1 year
- Handle edge cases (e.g., February 29th, 31st of month)

### 4.2 Cost Calculations
- Daily cost: Calculate based on billing cycle (monthly/30, weekly/7, annual/365)
- Weekly cost: Sum daily costs × 7
- Monthly cost: Sum all monthly equivalents
- Annual cost: Sum all annual equivalents
- Handle prorated calculations for subscriptions that start/end mid-period

### 4.3 Trial Period Logic
- Mark subscriptions with `is_trial: true` when `trial_end_date` is in the future
- Automatically update status to `active` when trial ends
- Generate notifications based on `trial_end_date` and notification preferences

### 4.4 Budget Alert Logic
- Calculate spending for the specified period and category
- Compare against `limit_amount`
- Generate alerts when spending exceeds limits
- Support different alert thresholds (80%, 90%, 100%, 110%)

## 5. Default Data

### 5.1 Predefined Categories
```json
[
  {"name": "Entertainment", "color": "#FF6B6B", "is_custom": false},
  {"name": "Productivity", "color": "#4ECDC4", "is_custom": false},
  {"name": "Utilities", "color": "#45B7D1", "is_custom": false},
  {"name": "Health & Fitness", "color": "#96CEB4", "is_custom": false},
  {"name": "Education", "color": "#FFEAA7", "is_custom": false},
  {"name": "News & Media", "color": "#DDA0DD", "is_custom": false},
  {"name": "Business & Work", "color": "#98D8C8", "is_custom": false},
  {"name": "Gaming", "color": "#F7DC6F", "is_custom": false}
]
```

### 5.2 Popular Service Templates
Include predefined templates for popular services like Netflix, Spotify, Adobe Creative Cloud, Microsoft 365, etc., with suggested icons and typical pricing.

## 6. Error Handling

### 6.1 Standard HTTP Status Codes
- `200 OK`: Successful GET, PUT requests
- `201 Created`: Successful POST requests
- `204 No Content`: Successful DELETE requests
- `400 Bad Request`: Invalid request data
- `404 Not Found`: Resource not found
- `409 Conflict`: Duplicate resource or constraint violation
- `422 Unprocessable Entity`: Validation errors
- `500 Internal Server Error`: Server errors

### 6.2 Error Response Format
```json
{
  "error": {
    "code": "string",
    "message": "string",
    "details": "object (optional)"
  }
}
```

## 7. Validation Rules

### 7.1 Subscription Validation
- `cost` must be positive decimal with max 2 decimal places
- `billing_day` must be valid for the billing cycle (1-28 for monthly, 1-7 for weekly)
- `trial_end_date` must be in the future when `is_trial` is true
- `end_date` must be after `start_date`

### 7.2 Category Validation
- `name` must be unique across all categories
- Custom categories cannot have the same name as predefined categories

### 7.3 Budget Alert Validation
- `limit_amount` must be positive
- Cannot have multiple alerts for the same category and period combination

## 8. Performance Considerations

### 8.1 Database Indexing
- Index on `subscription.status`, `subscription.next_billing_date`
- Index on `subscription.category_id`, `subscription.payment_account_id`
- Composite index on `subscription.status` + `subscription.next_billing_date`

### 8.2 Caching Strategy
- Cache analytics results for frequently requested periods
- Cache service templates data
- Cache category and payment account lists

### 8.3 Pagination
- Implement cursor-based pagination for large subscription lists
- Default page size: 50 items
- Maximum page size: 200 items

## 9. Security Considerations

### 9.1 Input Validation
- Sanitize all input data
- Validate decimal precision for cost fields
- Validate date formats and ranges
- Limit string field lengths

### 9.2 Rate Limiting
- Implement rate limiting for export endpoints
- Separate limits for read vs write operations

## 10. Future Enhancements

### 10.1 Phase 2 Features
- Multi-user support with authentication
- Email/SMS notifications
- Integration with banking APIs
- Mobile app support
- Subscription sharing between users

### 10.2 Advanced Analytics
- Predictive spending analysis
- Subscription usage tracking
- Price change history
- Seasonal spending patterns

## 11. Testing Requirements

### 11.1 Unit Tests
- Data model validation
- Business logic calculations
- Date handling edge cases
- Cost calculation accuracy

### 11.2 Integration Tests
- Complete CRUD workflows
- Analytics calculation accuracy
- Export functionality
- Budget alert triggering

### 11.3 Performance Tests
- Large dataset handling
- Complex analytics queries
- Export generation time
- Concurrent request handling

---

This PRD provides a comprehensive foundation for developing the Subscription Service Tracker API with clear specifications for all endpoints, data models, and expected behaviors.