# Contact Form API Update Summary

## Overview
Updated the contact form to use the new EspoCRM API endpoint with the required fields and structure.

## Changes Made

### 1. API Endpoint Update
- **Old API**: `https://espobackend.vercel.app/api/contacts`
- **New API**: `https://espo.egport.com/api/v1/LeadCapture/a4624c9bb58b8b755e3d94f1a25fc9be`
- Updated `.env.local` to use the new base URL

### 2. Form Fields Updated
The form now includes all required fields from the new API specification:

#### Step 1 - Personal Information
- Salutation (dropdown: Mr., Ms., Mrs., Dr.)
- First Name* (required)
- Last Name* (required)
- Middle Name (optional)
- Email Address* (required - either email or phone)
- Phone Number* (required - either email or phone)

#### Step 2 - Address Information
- Company Name
- Street Address
- City
- State/Province
- Country
- Postal Code

#### Step 3 - Business Information
- Business Type (dropdown)
- Fabric Category (dropdown)
- Opportunity Amount (number input)
- Currency (dropdown: USD, EUR, GBP, INR, CNY)
- Description (textarea)

### 3. Data Mapping
Updated the `mapToBackend` function to match the new API field names:

```javascript
{
  salutationName: f.salutation,
  firstName: f.firstName,
  lastName: f.lastName,
  middleName: f.middleName,
  emailAddress: f.email,
  phoneNumber: f.phone,
  accountName: f.companyName,
  addressStreet: f.addressStreet,
  addressCity: f.addressCity,
  addressState: f.addressState,
  addressCountry: f.addressCountry,
  addressPostalCode: f.addressPostalCode,
  opportunityAmountCurrency: f.opportunityAmountCurrency,
  opportunityAmount: f.opportunityAmount ? parseFloat(f.opportunityAmount) : null,
  cBusinessType: f.businessType ? [f.businessType] : [],
  cFabricCategory: f.fabricCategory ? [f.fabricCategory] : [],
  description: f.description,
}
```

### 4. Key Technical Changes
- Removed Redux dependencies (no longer using draft system)
- Simplified form state management with localStorage only
- Updated validation to require first name and last name
- Fixed array format for `cBusinessType` and `cFabricCategory` fields
- Direct API call to the new endpoint

### 5. Environment Variables
Updated `.env.local`:
```
NEXT_PUBLIC_API_BASE_URL=https://espo.egport.com/api
```

### 6. Testing
Created `scripts/test-new-contact-api.js` to verify the API integration works correctly.

## API Response
The new API returns a simple `true` response on successful submission with HTTP status 200.

## Files Modified
1. `src/components/forms/contact-form.jsx` - Complete form restructure
2. `.env.local` - Updated API base URL
3. `scripts/test-new-contact-api.js` - New test script (created)

## Validation
- API test passes successfully
- Form validation includes required fields
- No TypeScript/ESLint errors

The contact form is now fully integrated with the new EspoCRM API endpoint and includes all the required fields as specified.