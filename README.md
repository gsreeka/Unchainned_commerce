# NEMA Store - E-commerce Platform

A modern e-commerce platform for NEMA (National Electrical Manufacturers Association) standards and documents, built with React and GraphQL.

## 🚀 Features

- **Product Catalog**: Browse and search NEMA standards and documents
- **Shopping Cart**: Add products to cart with quantity management
- **Category Filtering**: Filter products by categories
- **Product Details**: Detailed modal view for each product
- **Admin Panel**: Manage products and orders (Categories tab removed for security)
- **Order Management**: Complete checkout process with order confirmation
- **Responsive Design**: Mobile-friendly interface
- **Real-time Updates**: GraphQL subscriptions for live data

## 🏗️ Architecture

### Frontend (React)
- **React 18** with functional components and hooks
- **Apollo Client** for GraphQL data management
- **Component-based architecture** with separated CSS files
- **Responsive design** with mobile-first approach

### Backend (Node.js)
- **Apollo Server** for GraphQL API
- **In-memory database** for development
- **Real-time data** with GraphQL queries and mutations

## 📁 Project Structure

```
unchainned/
├── mini-unchained-client/          # React Frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── AdminPanel/
│   │   │   │   ├── AdminPanel.js
│   │   │   │   └── AdminPanel.css
│   │   │   ├── Cart/
│   │   │   │   ├── Cart.js
│   │   │   │   └── Cart.css
│   │   │   ├── Notification/
│   │   │   │   ├── Notification.js
│   │   │   │   └── Notification.css
│   │   │   ├── ProductCard/
│   │   │   │   ├── ProductCard.js
│   │   │   │   └── ProductCard.css
│   │   │   └── ProductDetailModal/
│   │   │       ├── ProductDetailModal.js
│   │   │       └── ProductDetailModal.css
│   │   ├── App.js
│   │   ├── App.css
│   │   └── index.js
│   └── package.json
├── mini-unchained-server/          # Node.js Backend
│   ├── server.js
│   ├── database.js
│   └── package.json
├── requirements.txt
└── README.md
```

## 🛠️ Installation & Setup

### Prerequisites
- Node.js >= 16.0.0
- npm >= 8.0.0 or yarn >= 1.22.0

### 1. Clone the Repository
```bash
git clone <repository-url>
cd unchainned
```

### 2. Backend Setup
```bash
cd mini-unchained-server
npm install apollo-server graphql uuid
npm start
```

The GraphQL server will start on `http://localhost:4001`

### 3. Frontend Setup
```bash
cd mini-unchained-client
npm install
npm start
```

The React app will start on `http://localhost:3000`

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the client directory:
```env
REACT_APP_GRAPHQL_URI=http://localhost:4001
```

### GraphQL Endpoint
The frontend connects to the GraphQL server at `http://localhost:4001`

## 📊 Available Scripts

### Backend
```bash
npm start          # Start the GraphQL server
npm run dev        # Start with nodemon (if configured)
```

### Frontend
```bash
npm start          # Start development server
npm run build      # Build for production
npm test           # Run tests
npm run eject      # Eject from Create React App
```

## 🎯 Usage

### For End Users
1. **Browse Products**: View NEMA standards on the homepage
2. **Filter by Category**: Use the category dropdown to filter products
3. **Search**: Use the search bar to find specific standards
4. **View Details**: Click on any product card to see detailed information
5. **Add to Cart**: Click "Add to Cart" to add products to your shopping cart
6. **Checkout**: Open cart and proceed with checkout

### For Administrators
1. **Access Admin Panel**: Click "Admin Panel" in the header
2. **Manage Products**: Add, edit, or delete NEMA standards
3. **View Orders**: Monitor customer orders and their status
4. **Product Categories**: Assign categories to products for better organization

## 🔐 Security Features

- **Admin Access Control**: Admin panel requires proper authentication
- **Category Management**: Categories tab removed from admin for security
- **Input Validation**: All forms include proper validation
- **Error Handling**: Comprehensive error handling throughout the application

## 🎨 UI/UX Features

- **Modern Design**: Clean, professional interface matching NEMA branding
- **Responsive Layout**: Works seamlessly on desktop, tablet, and mobile
- **Interactive Elements**: Hover effects, animations, and smooth transitions
- **Accessibility**: Proper ARIA labels and keyboard navigation support
- **Loading States**: Visual feedback during data loading
- **Error Messages**: User-friendly error notifications

## 🧩 Component Architecture

### Reusable Components
- **ProductCard**: Displays product information in a card format
- **Cart**: Sliding cart sidebar with quantity management
- **Notification**: Toast notifications for user feedback
- **ProductDetailModal**: Detailed product view in modal format
- **AdminPanel**: Complete admin interface for product management

### CSS Organization
- **Separated Concerns**: Each component has its own CSS file
- **BEM Methodology**: Consistent class naming convention
- **Responsive Design**: Mobile-first CSS with breakpoints
- **CSS Variables**: Consistent color scheme and spacing

## 🔄 GraphQL Schema

### Key Queries
```graphql
# Get all products
query GetProducts {
  products {
    id
    title
    price
    categories
    # ... other fields
  }
}

# Get cart
query GetCart($id: ID!) {
  cart(id: $id) {
    id
    items {
      productId
      quantity
    }
    total
  }
}
```

### Key Mutations
```graphql
# Add to cart
mutation AddToCart($cartId: ID!, $productId: ID!, $quantity: Int!) {
  addToCart(cartId: $cartId, productId: $productId, quantity: $quantity) {
    id
    total
  }
}

# Create product (Admin)
mutation CreateProduct($input: ProductInput!) {
  createProduct(input: $input) {
    id
    title
    price
  }
}
```

## 🐛 Troubleshooting

### Common Issues

1. **GraphQL Server Not Starting**
   ```bash
   # Check if port 4001 is available
   netstat -an | grep 4001
   ```

2. **Frontend Can't Connect to Backend**
   - Ensure backend server is running on port 4001
   - Check CORS settings in server.js
   - Verify GraphQL endpoint URL

3. **Build Errors**
   ```bash
   # Clear node_modules and reinstall
   rm -rf node_modules package-lock.json
   npm install
   ```

### Development Tips
- Use browser DevTools to inspect GraphQL queries
- Check Apollo Client DevTools extension
- Monitor network requests for API calls
- Use React DevTools for component debugging

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style Guidelines
- Use functional components with hooks
- Follow ESLint configuration
- Write meaningful component and variable names
- Add comments for complex logic
- Separate CSS files for each component

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Team

- **Frontend**: React.js with Apollo Client
- **Backend**: Node.js with Apollo Server
- **Database**: In-memory (development)
- **Styling**: CSS3 with responsive design

## 🔮 Future Enhancements

- [ ] User authentication and authorization
- [ ] Persistent database (PostgreSQL/MongoDB)
- [ ] Payment gateway integration
- [ ] Email notifications
- [ ] Advanced search and filtering
- [ ] Product reviews and ratings
- [ ] Inventory management
- [ ] Multi-language support
- [ ] SEO optimization
- [ ] Performance monitoring

## 📞 Support

For support and questions:
- Create an issue in the repository
- Check existing documentation
- Review GraphQL schema in Apollo Studio

---

**Built with ❤️ for NEMA Standards Distribution**
