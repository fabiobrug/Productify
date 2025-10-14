# Productify Frontend

A modern, mobile-first Angular 19 application for product management with RxJS state management and Tailwind CSS styling.

## 🚀 Features

### Core Functionality
- **Complete CRUD Operations**: Create, Read, Update, Delete products
- **Real-time Search**: Debounced search with instant filtering
- **Advanced Filtering**: Price range filters with quick filter buttons
- **Sorting**: Sort by name, price, or date with ascending/descending order
- **Responsive Design**: Mobile-first approach with progressive enhancement

### Technical Features
- **RxJS State Management**: Reactive programming with Observables and Subjects
- **Angular Reactive Forms**: Form validation with real-time feedback
- **Lazy Loading**: Route-based code splitting for optimal performance
- **Toast Notifications**: User-friendly feedback system
- **Loading States**: Skeleton loaders and loading indicators
- **Error Handling**: Comprehensive error management with user feedback

### Mobile-First Design
- **Touch-Friendly Interface**: 44px minimum touch targets
- **Floating Action Button**: Mobile-optimized add product button
- **Sticky Headers**: Navigation that stays accessible while scrolling
- **Safe Area Support**: iPhone notch and Android navigation bar support
- **Progressive Enhancement**: Enhanced experience on larger screens

## 🛠️ Tech Stack

- **Framework**: Angular 19 with TypeScript
- **Styling**: Tailwind CSS with custom component classes
- **State Management**: RxJS Observables and Subjects
- **HTTP Client**: Angular HttpClient with interceptors
- **Forms**: Angular Reactive Forms with validation
- **Routing**: Angular Router with lazy loading
- **Build Tool**: Angular CLI with Vite (Angular 19 default)

## 📱 Responsive Breakpoints

- **Mobile**: 320px+ (default)
- **Small**: 640px+ (`sm:`)
- **Medium**: 768px+ (`md:`)
- **Large**: 1024px+ (`lg:`)
- **Extra Large**: 1280px+ (`xl:`)

## 🏗️ Project Structure

```
src/
├── app/
│   ├── components/
│   │   ├── product-list/          # Main products dashboard
│   │   ├── product-form/          # Create/Edit product form
│   │   ├── product-card/          # Individual product display
│   │   ├── filter-section/        # Search and filtering controls
│   │   └── notification-toast/    # Toast notification system
│   ├── services/
│   │   ├── product.service.ts     # RxJS-based product management
│   │   └── notification.service.ts # Toast notification service
│   ├── models/
│   │   └── product.model.ts       # TypeScript interfaces
│   ├── app.component.ts           # Root component
│   ├── app.routes.ts              # Route configuration
│   └── app.config.ts              # App configuration
├── styles.css                     # Global styles with Tailwind
└── main.ts                        # Application bootstrap
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm 9+
- Backend API running on `http://localhost:3000`

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd productify-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to `http://localhost:4200`

### Build for Production

```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory.

## 🔧 Development

### Available Scripts

- `npm start` - Start development server
- `npm run build` - Build for production
- `npm run test` - Run unit tests
- `npm run lint` - Run ESLint

### Backend Integration

The frontend expects the backend API to be running on `http://localhost:3000` with the following endpoints:

- `GET /products` - Get all products
- `GET /products/:id` - Get single product
- `POST /products` - Create new product
- `PATCH /products/:id` - Update product
- `DELETE /products/:id` - Delete product

### API Data Format

```typescript
interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
}
```

## 🎨 Design System

### Color Palette
- **Primary**: Blue (`primary-600`, `primary-700`)
- **Gray Scale**: Neutral grays for text and backgrounds
- **Status Colors**: Green (success), Red (error), Yellow (warning), Blue (info)

### Typography
- **Font Family**: Inter (system fallbacks)
- **Mobile-First**: Optimized font sizes for mobile screens
- **Responsive**: Scales appropriately across breakpoints

### Components
- **Buttons**: Primary, secondary, and danger variants
- **Cards**: Consistent shadow and border styling
- **Forms**: Mobile-optimized input fields with validation
- **Notifications**: Toast-style feedback system

## 📱 Mobile Features

### Touch Optimization
- Minimum 44px touch targets
- Proper spacing between interactive elements
- Swipe-friendly interface design

### Navigation
- Sticky headers for easy access
- Floating Action Button for primary actions
- Back button with unsaved changes protection

### Performance
- Lazy loading for optimal bundle size
- OnPush change detection strategy
- TrackBy functions for efficient list rendering

## 🔍 Filtering & Search

### Search Features
- **Real-time Search**: Debounced input with 300ms delay
- **Multi-field Search**: Searches both name and description
- **Case-insensitive**: Works regardless of text case

### Filter Options
- **Price Range**: Min/max price filtering
- **Quick Filters**: Predefined price ranges (Under $50, $50-$100, Over $100)
- **Sorting**: Name, price, or date with ascending/descending order

### Advanced Filters
- Collapsible filter panel
- Clear all filters functionality
- Visual indicators for active filters

## 🎯 RxJS Implementation

### State Management
```typescript
// BehaviorSubjects for state
private productsSubject = new BehaviorSubject<Product[]>([]);
private filterSubject = new BehaviorSubject<ProductFilter>({});

// Reactive streams
products$ = this.productsSubject.asObservable();
filteredProducts$ = combineLatest([
  this.products$,
  this.filterSubject.pipe(debounceTime(300))
]).pipe(
  map(([products, filter]) => this.applyFilters(products, filter)),
  shareReplay(1)
);
```

### Key Operators Used
- `debounceTime()` - Search input debouncing
- `distinctUntilChanged()` - Prevent duplicate emissions
- `shareReplay()` - Cache and share filtered results
- `catchError()` - Error handling
- `switchMap()` - Route parameter handling

## 🧪 Testing

### Unit Tests
```bash
npm run test
```

### E2E Tests
```bash
npm run e2e
```

## 📦 Deployment

### Build Configuration
The application is configured for production builds with:
- Tree shaking for optimal bundle size
- AOT compilation
- Minification and optimization
- Source map generation (development only)

### Environment Configuration
Update the API URL in `src/app/services/product.service.ts` for different environments:

```typescript
private readonly API_URL = 'http://localhost:3000/products'; // Development
// private readonly API_URL = 'https://api.productify.com/products'; // Production
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Troubleshooting

### Common Issues

1. **Backend Connection Error**
   - Ensure backend is running on `http://localhost:3000`
   - Check CORS configuration in backend

2. **Build Errors**
   - Clear node_modules and reinstall: `rm -rf node_modules && npm install`
   - Check Node.js version compatibility

3. **Styling Issues**
   - Ensure Tailwind CSS is properly configured
   - Check PostCSS configuration in `angular.json`

### Performance Optimization

- Use `OnPush` change detection strategy
- Implement `trackBy` functions for `*ngFor` loops
- Lazy load routes and components
- Optimize images and assets

## 📞 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review the code comments for implementation details

---

**Built with ❤️ using Angular 19, RxJS, and Tailwind CSS**