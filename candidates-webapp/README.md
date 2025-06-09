# Candidates Management Web Application

Angular 18 frontend application for managing candidates with reactive forms and Material Design.

## Features

- 📋 **Candidates List**: View all candidates in a responsive Material table
- ➕ **Add Candidate**: Modal form with reactive forms validation
- 📁 **Excel Upload**: Upload Excel files with candidate data
- 🎨 **Material Design**: Clean UI with Angular Material V3
- 📱 **Responsive Design**: Works on desktop and mobile devices
- ⚡ **Real-time Updates**: Automatic list refresh after operations

## Requirements

- Node.js 18+
- Angular CLI 18
- Backend API running on `http://localhost:3000`

## Getting Started

### Installation
```bash
npm install
```

### Development Server
```bash
npm start
# or
ng serve
```

Navigate to `http://localhost:4200/`

### Build for Production
```bash
npm run build
```

## Usage

### Viewing Candidates
- The main page displays all candidates in a table format
- Shows: Name, Seniority, Years of Experience, Availability, Creation Date
- Empty state displayed when no candidates exist

### Adding a New Candidate
1. Click "Add Candidate" button
2. Fill in the form:
   - **First Name**: Required, min 2 characters
   - **Last Name**: Required, min 2 characters
   - **Excel File**: Required .xlsx or .xls file
3. Click "Create Candidate"

### Excel File Format
The Excel file must contain one data row with exactly 3 columns:

| Column | Type | Description | Example |
|--------|------|-------------|---------|
| 1 | String | Seniority: "Junior" or "Senior" | Senior |
| 2 | Number | Years of Experience (≥ 0) | 5 |
| 3 | Boolean | Availability: true or false | true |

Example Excel content:
```
Seniority | Years | Availability
Senior    | 5     | true
```

## API Integration

The application connects to the backend API:

- **GET** `/candidates` - Fetch all candidates
- **POST** `/candidates` - Create new candidate with form data and Excel file

### Error Handling
- Form validation with real-time feedback
- File type validation for Excel uploads
- API error messages displayed to user
- Loading states during operations

## Component Structure

```
src/app/
├── components/
│   ├── candidate-list/          # Main candidates table
│   └── candidate-form/          # Modal form for adding candidates
├── models/
│   └── candidate.model.ts       # TypeScript interfaces
├── services/
│   └── candidate.service.ts     # API service
└── app.component.*              # Root component
```

## Material Components Used

- MatTable - Data table display
- MatDialog - Modal dialogs
- MatForm - Reactive forms
- MatButton - Action buttons
- MatIcon - Material icons
- MatChip - Status indicators
- MatSnackBar - Toast notifications
- MatToolbar - Navigation bar
- MatCard - Content containers

## Form Validation

- **Required fields**: First name, last name, Excel file
- **Minimum length**: 2 characters for names
- **File type**: Only .xlsx and .xls files accepted
- **Real-time validation**: Immediate feedback on input
- **Server validation**: Backend errors displayed to user

## Responsive Design

- Mobile-first approach
- Responsive table that adapts to screen size
- Touch-friendly buttons and inputs
- Optimized for various screen sizes

## Development

### Code Style
- Standalone components (Angular 18 style)
- Reactive forms with FormBuilder
- RxJS for async operations
- TypeScript strict mode
- SCSS for styling

### Testing
```bash
npm test
```

### Linting
```bash
ng lint
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Follow Angular style guide
2. Use meaningful component and variable names
3. Add proper TypeScript types
4. Test functionality before committing