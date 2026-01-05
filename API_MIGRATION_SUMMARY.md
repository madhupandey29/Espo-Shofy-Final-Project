# Company Information API Migration Summary

## Overview
Successfully migrated from `/officeinformation` API to `/companyinformation` API with updated field mappings.

## API Changes

### Old vs New Field Mappings
| Old Field Name | New Field Name | Notes |
|----------------|----------------|-------|
| `companyEmail` | `primaryEmail` | Primary contact email |
| `companyPhone1` | `phone1` | Primary phone number |
| `companyPhone2` | `phone2` | Secondary phone number |
| `companyAddress` | `addressStreet`, `addressCity`, `addressState`, `addressCountry`, `addressPostalCode` | Address split into components |
| `companyName` | `name` | Company name |
| `facebook` | `facebookUrl` | Facebook URL |
| `instagram` | `instagramUrl` | Instagram URL |
| `linkedin` | `linkedinUrl` | LinkedIn URL |
| `twitter` | `xUrl` | X (Twitter) URL |
| `youtube` | `youtubeUrl` | YouTube URL |
| `pinterest` | `pinterestUrl` | Pinterest URL |

### New API Endpoint
- **URL**: `https://espobackend.vercel.app/api/companyinformation`
- **Method**: GET
- **Response Format**: Same structure with updated field names

## Files Updated

### 1. `src/components/contact/contact-area.jsx`
- Updated field mappings for email, phone numbers, and social media URLs
- Added address composition from separate address fields
- Maintained fallback data structure

### 2. `src/layout/footers/footer.jsx`
- Updated field mappings for contact information
- Updated social media URL references
- Updated company name reference for newsletter subscription

### 3. `src/app/HomePageTwoClient.jsx`
- Updated phone number field references
- Updated social media URL references for floating social buttons

### 4. `scripts/test-office-info-api.js`
- Updated API base URL to new endpoint
- Updated field name checks in test output
- Updated expected data structure validation

## API Configuration
- **Environment Variable**: `NEXT_PUBLIC_API_BASE_URL=https://espobackend.vercel.app/api`
- **Endpoint**: `/companyinformation`
- **Redux API Slice**: Already configured correctly

## Testing
- ✅ API endpoint responds successfully (200 OK)
- ✅ All expected fields are present in response
- ✅ No syntax errors in updated components
- ✅ Field mappings correctly implemented

## Notes
- The migration maintains backward compatibility with fallback data
- All existing functionality preserved
- Contact form submissions still use `companyName` field (user input, not API data)
- Address is now composed from multiple fields for better structure