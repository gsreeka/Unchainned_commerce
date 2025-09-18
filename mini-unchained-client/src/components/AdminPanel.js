import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, gql } from '@apollo/client';

// GraphQL queries and mutations for admin operations
const GET_PRODUCTS = gql`
  query GetProducts {
    products {
      id
      doc_number
      title
      short_title
      series
      part
      revision
      status
      description
      publisher
      publication_year
      languages
      access {
        type
        price_usd
        sku
      }
      multi_user
      categories
      tags
      url
      created_at
      updated_at
      metadata {
        document_type
        format_support
        is_replaced
      }
      price
    }
  }
`;

const GET_ORDERS = gql`
  query GetOrders {
    orders {
      id
      items {
        productId
        quantity
        product {
          title
          price
        }
      }
      total
      status
      createdAt
    }
  }
`;

const GET_CATEGORIES = gql`
  query GetCategories {
    categories {
      id
      name
      slug
      description
      parent_id
      sort_order
      created_at
      updated_at
    }
  }
`;

const CREATE_CATEGORY = gql`
  mutation CreateCategory($input: CategoryInput!) {
    createCategory(input: $input) {
      id
      name
      slug
      description
      parent_id
      sort_order
      created_at
      updated_at
    }
  }
`;

const UPDATE_CATEGORY = gql`
  mutation UpdateCategory($id: ID!, $input: CategoryInput!) {
    updateCategory(id: $id, input: $input) {
      id
      name
      slug
      description
      parent_id
      sort_order
      created_at
      updated_at
    }
  }
`;

const DELETE_CATEGORY = gql`
  mutation DeleteCategory($id: ID!) {
    deleteCategory(id: $id)
  }
`;

const CREATE_PRODUCT = gql`
  mutation CreateProduct($input: ProductInput!) {
    createProduct(input: $input) {
      id
      doc_number
      title
      short_title
      description
      price
    }
  }
`;

const UPDATE_PRODUCT = gql`
  mutation UpdateProduct($id: ID!, $input: ProductInput!) {
    updateProduct(id: $id, input: $input) {
      id
      doc_number
      title
      short_title
      description
      price
    }
  }
`;

const DELETE_PRODUCT = gql`
  mutation DeleteProduct($id: ID!) {
    deleteProduct(id: $id)
  }
`;

const UPDATE_ORDER = gql`
  mutation UpdateOrder($id: ID!, $input: OrderInput!) {
    updateOrder(id: $id, input: $input) {
      id
      status
    }
  }
`;

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('products');
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({
        doc_number: '',
        title: '',
        short_title: '',
        series: '',
        part: '',
        revision: '',
        status: 'active',
        description: '',
        publisher: 'NEMA',
        publication_year: new Date().getFullYear(),
        languages: ['English'],
        multi_user: false,
        categories: [],
        tags: [],
        price: '',
        category_id: ''
      });

  const { data: productsData, loading: productsLoading, error: productsError, refetch: refetchProducts } = useQuery(GET_PRODUCTS);
  const { data: categoriesData, loading: categoriesLoading, error: categoriesError } = useQuery(GET_CATEGORIES);
  const { data: ordersData, loading: ordersLoading, error: ordersError, refetch: refetchOrders } = useQuery(GET_ORDERS);

  const [createProduct] = useMutation(CREATE_PRODUCT);
  const [updateProduct] = useMutation(UPDATE_PRODUCT);
  const [deleteProduct] = useMutation(DELETE_PRODUCT);
  
  const [createCategory] = useMutation(CREATE_CATEGORY);
  const [updateCategory] = useMutation(UPDATE_CATEGORY);
  const [deleteCategory] = useMutation(DELETE_CATEGORY);

  const [editingCategory, setEditingCategory] = useState(null);
  const [categoryForm, setCategoryForm] = useState({
    name: '',
    slug: '',
    description: '',
    parent_id: '',
    sort_order: 0
  });
  const [updateOrder] = useMutation(UPDATE_ORDER);

  // Category form handlers
  const handleCreateCategory = async (e) => {
    e.preventDefault();
    
    try {
      const input = {
        name: categoryForm.name,
        slug: categoryForm.slug || categoryForm.name.toLowerCase().replace(/\s+/g, '-'),
        description: categoryForm.description,
        parent_id: categoryForm.parent_id || null,
        sort_order: parseInt(categoryForm.sort_order) || 0
      };

      await createCategory({
        variables: { input },
        refetchQueries: [{ query: GET_CATEGORIES }]
      });

      // Reset form
      setCategoryForm({
        name: '',
        slug: '',
        description: '',
        parent_id: '',
        sort_order: 0
      });

      alert('Category created successfully!');
    } catch (error) {
      console.error('Error creating category:', error);
      alert('Error creating category: ' + error.message);
    }
  };

  const handleUpdateCategory = async (e) => {
    e.preventDefault();
    
    try {
      const input = {
        name: categoryForm.name,
        slug: categoryForm.slug,
        description: categoryForm.description,
        parent_id: categoryForm.parent_id || null,
        sort_order: parseInt(categoryForm.sort_order) || 0
      };

      await updateCategory({
        variables: { id: editingCategory.id, input },
        refetchQueries: [{ query: GET_CATEGORIES }]
      });

      // Reset form
      setEditingCategory(null);
      setCategoryForm({
        name: '',
        slug: '',
        description: '',
        parent_id: '',
        sort_order: 0
      });

      alert('Category updated successfully!');
    } catch (error) {
      console.error('Error updating category:', error);
      alert('Error updating category: ' + error.message);
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    if (!window.confirm('Are you sure you want to delete this category?')) {
      return;
    }

    try {
      await deleteCategory({
        variables: { id: categoryId },
        refetchQueries: [{ query: GET_CATEGORIES }]
      });

      alert('Category deleted successfully!');
    } catch (error) {
      console.error('Error deleting category:', error);
      alert('Error deleting category: ' + error.message);
    }
  };

  const handleEditCategory = (category) => {
    setEditingCategory(category);
    setCategoryForm({
      name: category.name,
      slug: category.slug,
      description: category.description || '',
      parent_id: category.parent_id || '',
      sort_order: category.sort_order || 0
    });
  };

  const handleCancelCategoryEdit = () => {
    setEditingCategory(null);
    setCategoryForm({
      name: '',
      slug: '',
      description: '',
      parent_id: '',
      sort_order: 0
    });
  };

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    console.log('Creating product with form data:', productForm);
    
    try {
      const input = {
        doc_number: productForm.doc_number,
        title: productForm.title,
        short_title: productForm.short_title,
        series: productForm.series,
        part: productForm.part ? parseInt(productForm.part) : null,
        revision: productForm.revision,
        status: productForm.status,
        description: productForm.description,
        publisher: productForm.publisher,
        publication_year: productForm.publication_year,
        languages: productForm.languages,
        multi_user: productForm.multi_user,
        categories: productForm.category_id ? [parseInt(productForm.category_id)] : [],
        tags: productForm.tags,
        price: parseFloat(productForm.price)
      };
      
      console.log('Sending GraphQL mutation with input:', input);
      
      const result = await createProduct({
        variables: { input }
      });
      
      console.log('Product created successfully:', result);
      setProductForm({
        doc_number: '',
        title: '',
        short_title: '',
        series: '',
        part: '',
        revision: '',
        status: 'active',
        description: '',
        publisher: 'American National Standards Institute / National Electrical Manufacturers Association',
        publication_year: new Date().getFullYear(),
        languages: ['English'],
        multi_user: true,
        categories: [],
        tags: [],
        price: ''
      });
      refetchProducts();
    } catch (error) {
      console.error('Error creating product:', error);
      console.error('Error details:', error.graphQLErrors);
      console.error('Network error:', error.networkError);
      alert('Failed to create product. Check console for details.');
    }
  };

  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    try {
      await updateProduct({
        variables: {
          id: editingProduct.id,
          input: {
            doc_number: productForm.doc_number,
            title: productForm.title,
            short_title: productForm.short_title,
            series: productForm.series,
            part: productForm.part ? parseInt(productForm.part) : null,
            revision: productForm.revision,
            status: productForm.status,
            description: productForm.description,
            publisher: productForm.publisher,
            publication_year: productForm.publication_year,
            languages: productForm.languages,
            multi_user: productForm.multi_user,
            categories: productForm.category_id ? [parseInt(productForm.category_id)] : [],
            tags: productForm.tags,
            price: parseFloat(productForm.price)
          }
        }
      });
      setEditingProduct(null);
      setProductForm({
        doc_number: '',
        title: '',
        short_title: '',
        series: '',
        part: '',
        revision: '',
        status: 'active',
        description: '',
        publisher: 'American National Standards Institute / National Electrical Manufacturers Association',
        publication_year: new Date().getFullYear(),
        languages: ['English'],
        multi_user: true,
        categories: [],
        tags: [],
        price: ''
      });
      refetchProducts();
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteProduct({ variables: { id } });
        refetchProducts();
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  };

  const handleEditProduct = (product) => {
    if (!product) return;
    setEditingProduct(product);
    setProductForm({
      doc_number: product.doc_number || '',
      title: product.title || '',
      short_title: product.short_title || '',
      series: product.series || '',
      part: product.part || '',
      revision: product.revision || '',
      status: product.status || 'active',
      description: product.description || '',
      publisher: product.publisher || 'NEMA',
      publication_year: product.publication_year || new Date().getFullYear(),
      languages: product.languages || ['English'],
      multi_user: product.multi_user || false,
      categories: product.categories || [],
      tags: product.tags || [],
      price: product.price || '',
      category_id: (product.categories && product.categories.length > 0) ? product.categories[0].toString() : ''
    });
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      await updateOrder({
        variables: {
          id: orderId,
          input: { status: newStatus }
        }
      });
      refetchOrders();
    } catch (error) {
      console.error('Error updating order:', error);
    }
  };

  if (productsLoading || ordersLoading) return <div>Loading...</div>;

  return (
    <div style={{ padding: '1rem', backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', backgroundColor: 'white', border: '1px solid #d1d5db', borderRadius: '4px' }}>
        <div style={{ 
          background: '#2E5BBA', 
          color: 'white', 
          padding: '1rem 1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem'
        }}>
          {/* NEMA Logo Box */}
          <div style={{
            background: 'white',
            color: '#2E5BBA',
            padding: '0.5rem 1rem',
            fontWeight: 'bold',
            fontSize: '1.5rem',
            letterSpacing: '2px'
          }}>
            NEMA
          </div>
          
          {/* Title and Subtitle */}
          <div>
            <h1 style={{ margin: 0, fontSize: '1.3rem', fontWeight: '600' }}>
              The National Electrical Manufacturers Association
            </h1>
            <p style={{ margin: '0.25rem 0 0 0', opacity: 0.9, fontSize: '0.9rem' }}>
              Store Administration - Manage standards and orders
            </p>
          </div>
        </div>
        
        {/* Tab Navigation */}
        <div style={{ 
          display: 'flex', 
          backgroundColor: '#e5e7eb',
          borderTop: '3px solid #d1d5db',
          marginTop: '8px'
        }}>
          <button
            onClick={() => setActiveTab('products')}
            style={{
              padding: '0.75rem 1.5rem',
              border: 'none',
              background: activeTab === 'products' ? '#2E5BBA' : 'transparent',
              color: activeTab === 'products' ? 'white' : '#374151',
              cursor: 'pointer',
              fontSize: '0.9rem',
              fontWeight: '600'
            }}
          >
            Products ({productsData?.products?.length || 0})
          </button>
          <button
            onClick={() => setActiveTab('categories')}
            style={{
              padding: '0.75rem 1.5rem',
              border: 'none',
              background: activeTab === 'categories' ? '#2E5BBA' : 'transparent',
              color: activeTab === 'categories' ? 'white' : '#374151',
              cursor: 'pointer',
              fontSize: '0.9rem',
              fontWeight: '600'
            }}
          >
            Categories ({categoriesData?.categories?.length || 0})
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            style={{
              padding: '0.75rem 1.5rem',
              border: 'none',
              background: activeTab === 'orders' ? '#2E5BBA' : 'transparent',
              color: activeTab === 'orders' ? 'white' : '#374151',
              cursor: 'pointer',
              fontSize: '0.9rem',
              fontWeight: '600'
            }}
          >
            Orders ({ordersData?.orders?.length || 0})
          </button>
        </div>

      {/* Products Tab */}
      {activeTab === 'products' && (
        <div>
          {/* Product Form */}
          <div style={{ 
            background: 'white', 
            padding: '1.5rem', 
            margin: '1rem',
            border: '1px solid #d1d5db'
          }}>
            <h3 style={{ margin: '0 0 1rem 0', color: '#374151', fontSize: '1rem', fontWeight: '600' }}>
              {editingProduct ? 'Edit Standard' : 'Add New Standard'}
            </h3>
            <form onSubmit={editingProduct ? handleUpdateProduct : handleCreateProduct}>
              {/* Document Information */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#374151' }}>Document Number *</label>
                  <input
                    type="text"
                    placeholder="e.g., ANSI/NEMA MG 1-2016"
                    value={productForm.doc_number}
                    onChange={(e) => setProductForm({ ...productForm, doc_number: e.target.value })}
                    required
                    style={{ 
                      width: '100%',
                      padding: '0.5rem', 
                      border: '1px solid #d1d5db', 
                      fontSize: '0.9rem',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#374151' }}>Series</label>
                  <input
                    type="text"
                    placeholder="e.g., MG, ICS, 250"
                    value={productForm.series}
                    onChange={(e) => setProductForm({ ...productForm, series: e.target.value })}
                    style={{ 
                      width: '100%',
                      padding: '0.5rem', 
                      border: '1px solid #d1d5db', 
                      fontSize: '0.9rem',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#374151' }}>Part</label>
                  <input
                    type="number"
                    placeholder="e.g., 1, 2, 11"
                    value={productForm.part}
                    onChange={(e) => setProductForm({ ...productForm, part: e.target.value })}
                    style={{ 
                      width: '100%',
                      padding: '0.5rem', 
                      border: '1px solid #d1d5db', 
                      fontSize: '0.9rem',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
              </div>

              {/* Title Information */}
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#374151' }}>Full Title *</label>
                  <input
                    type="text"
                    placeholder="e.g., Motors and Generators - Comprehensive standard..."
                    value={productForm.title}
                    onChange={(e) => setProductForm({ ...productForm, title: e.target.value })}
                    required
                    style={{ 
                      width: '100%',
                      padding: '0.5rem', 
                      border: '1px solid #d1d5db', 
                      fontSize: '0.9rem',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#374151' }}>Short Title</label>
                  <input
                    type="text"
                    placeholder="e.g., ANSI/NEMA MG 1-2016"
                    value={productForm.short_title}
                    onChange={(e) => setProductForm({ ...productForm, short_title: e.target.value })}
                    style={{ 
                      width: '100%',
                      padding: '0.5rem', 
                      border: '1px solid #d1d5db', 
                      fontSize: '0.9rem',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
              </div>

              {/* Publication Details */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#374151' }}>Publication Year *</label>
                  <input
                    type="number"
                    min="1900"
                    max="2030"
                    value={productForm.publication_year}
                    onChange={(e) => setProductForm({ ...productForm, publication_year: parseInt(e.target.value) })}
                    required
                    style={{ 
                      width: '100%',
                      padding: '0.5rem', 
                      border: '1px solid #d1d5db', 
                      fontSize: '0.9rem',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#374151' }}>Status</label>
                  <select
                    value={productForm.status}
                    onChange={(e) => setProductForm({ ...productForm, status: e.target.value })}
                    style={{ 
                      width: '100%',
                      padding: '0.5rem', 
                      border: '1px solid #d1d5db', 
                      fontSize: '0.9rem',
                      boxSizing: 'border-box'
                    }}
                  >
                    <option value="active">Active</option>
                    <option value="replaced">Replaced</option>
                    <option value="withdrawn">Withdrawn</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#374151' }}>Price (USD) *</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    value={productForm.price}
                    onChange={(e) => {
                      const value = parseFloat(e.target.value);
                      if (value >= 0 || e.target.value === '') {
                        setProductForm({ ...productForm, price: e.target.value });
                      }
                    }}
                    required
                    style={{ 
                      width: '100%',
                      padding: '0.5rem', 
                      border: '1px solid #d1d5db', 
                      fontSize: '0.9rem',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
              </div>

              {/* Description */}
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#374151' }}>Description *</label>
                <textarea
                  placeholder="Detailed description of the NEMA standard, including scope, applications, and key requirements..."
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  required
                  rows={3}
                  style={{ 
                    width: '100%', 
                    padding: '0.5rem', 
                    border: '1px solid #d1d5db', 
                    fontSize: '0.9rem',
                    resize: 'vertical',
                    fontFamily: 'inherit',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              {/* Category and Tags */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#374151' }}>Category *</label>
                  <select
                    value={productForm.category_id}
                    onChange={(e) => setProductForm({ ...productForm, category_id: e.target.value })}
                    required
                    style={{ 
                      width: '100%',
                      padding: '0.5rem', 
                      border: '1px solid #d1d5db', 
                      fontSize: '0.9rem',
                      boxSizing: 'border-box'
                    }}
                  >
                    <option value="">Select a category</option>
                    {categoriesData?.categories?.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#374151' }}>Tags (comma-separated)</label>
                  <input
                    type="text"
                    placeholder="e.g., motors, generators, standard"
                    value={productForm.tags.join(', ')}
                    onChange={(e) => setProductForm({ ...productForm, tags: e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag) })}
                    style={{ 
                      width: '100%',
                      padding: '0.5rem', 
                      border: '1px solid #d1d5db', 
                      fontSize: '0.9rem',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
              </div>
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                {editingProduct && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingProduct(null);
                      setProductForm({
                        doc_number: '',
                        title: '',
                        short_title: '',
                        series: '',
                        part: '',
                        revision: '',
                        status: 'active',
                        description: '',
                        publisher: 'NEMA',
                        publication_year: new Date().getFullYear(),
                        languages: ['English'],
                        multi_user: false,
                        categories: [],
                        tags: [],
                        price: '',
                        category_id: ''
                      });
                    }}
                    style={{
                      background: '#f3f4f6',
                      color: '#374151',
                      border: '1px solid #d1d5db',
                      padding: '0.5rem 1rem',
                      cursor: 'pointer',
                      fontSize: '0.9rem'
                    }}
                  >
                    Cancel
                  </button>
                )}
                <button
                  type="submit"
                  style={{
                    background: 'linear-gradient(135deg, #2E5BBA 0%, #1e3f7a 100%)',
                    color: 'white',
                    border: 'none',
                    padding: '0.875rem 2rem',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '1rem',
                    fontWeight: '600',
                    boxShadow: '0 2px 4px rgba(46, 91, 186, 0.3)',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'translateY(-1px)';
                    e.target.style.boxShadow = '0 4px 8px rgba(46, 91, 186, 0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 2px 4px rgba(46, 91, 186, 0.3)';
                  }}
                >
                  {editingProduct ? 'Update Standard' : 'Create Standard'}
                </button>
              </div>
            </form>
          </div>

          {/* Products List */}
          <div style={{ background: 'white', border: '1px solid #d1d5db', margin: '1rem' }}>
            <div style={{ 
              background: '#2E5BBA', 
              color: 'white', 
              padding: '1rem 1.5rem', 
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <span style={{ fontSize: '1rem', fontWeight: '600' }}>NEMA Standards Library</span>
              <span style={{ fontSize: '0.9rem' }}>
                {productsData?.products?.length || 0} Standards
              </span>
            </div>
            <div style={{ padding: '1.5rem' }}>
              <div style={{ display: 'grid', gap: '1rem' }}>
                {productsData?.products?.map((product) => (
                  <div
                    key={product.id}
                    style={{
                      display: 'flex',
                      background: 'white',
                      border: '1px solid #e5e7eb',
                      padding: '1rem',
                      alignItems: 'center'
                    }}
                  >
                    {/* Simple PDF Icon */}
                    <div style={{
                      width: '50px',
                      height: '60px',
                      background: '#dc2626',
                      borderRadius: '4px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginRight: '1rem',
                      flexShrink: 0
                    }}>
                      <div style={{
                        color: 'white',
                        fontSize: '0.7rem',
                        fontWeight: 'bold'
                      }}>NEMA</div>
                      <div style={{
                        color: 'white',
                        fontSize: '0.6rem'
                      }}>PDF</div>
                    </div>
                    
                    {/* Content */}
                    <div style={{ flex: 1 }}>
                      <h4 style={{ 
                        margin: '0 0 0.5rem 0', 
                        color: '#2E5BBA', 
                        fontSize: '1rem',
                        fontWeight: '600'
                      }}>
                        {product?.title || 'Unknown Product'}
                      </h4>
                      <p style={{ 
                        margin: '0 0 0.5rem 0', 
                        color: '#6b7280', 
                        fontSize: '0.9rem'
                      }}>
                        {product?.description || 'No description available'}
                      </p>
                      <div style={{ 
                        fontSize: '0.9rem', 
                        color: '#059669',
                        fontWeight: '600'
                      }}>
                        PRICE ${product?.price?.toFixed(2) || '0.00'}
                      </div>
                      <div style={{ 
                        fontSize: '0.8rem', 
                        color: '#6b7280',
                        marginTop: '0.25rem'
                      }}>
                        Standard Document
                      </div>
                    </div>
                    
                    {/* Actions */}
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button
                        onClick={() => handleEditProduct(product)}
                        style={{
                          background: '#f59e0b',
                          color: 'white',
                          border: 'none',
                          padding: '0.5rem 0.75rem',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '0.8rem'
                        }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(product.id)}
                        style={{
                          background: '#ef4444',
                          color: 'white',
                          border: 'none',
                          padding: '0.5rem 0.75rem',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '0.8rem'
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              {(!productsData?.products || productsData.products.length === 0) && (
                <div style={{
                  textAlign: 'center',
                  padding: '2rem',
                  color: '#6b7280'
                }}>
                  <h3 style={{ margin: '0 0 0.5rem 0', color: '#374151' }}>No NEMA Standards Found</h3>
                  <p style={{ margin: 0 }}>Create your first NEMA standard using the form above.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Categories Tab */}
      {activeTab === 'categories' && (
        <div>
          {/* Category Form */}
          <div style={{ background: 'white', border: '1px solid #d1d5db', margin: '1rem' }}>
            <div style={{ 
              background: '#2E5BBA', 
              color: 'white', 
              padding: '1rem 1.5rem', 
              fontSize: '1rem',
              fontWeight: '600'
            }}>
              {editingCategory ? 'Edit Category' : 'Add New Category'}
            </div>
            <div style={{ padding: '1.5rem' }}>
              <form onSubmit={editingCategory ? handleUpdateCategory : handleCreateCategory}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#374151' }}>Name *</label>
                    <input
                      type="text"
                      placeholder="e.g., Arc Welding"
                      value={categoryForm.name}
                      onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                      required
                      style={{ 
                        width: '100%',
                        padding: '0.5rem', 
                        border: '1px solid #d1d5db', 
                        fontSize: '0.9rem',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#374151' }}>Slug</label>
                    <input
                      type="text"
                      placeholder="arc-welding (auto-generated if empty)"
                      value={categoryForm.slug}
                      onChange={(e) => setCategoryForm({ ...categoryForm, slug: e.target.value })}
                      style={{ 
                        width: '100%',
                        padding: '0.5rem', 
                        border: '1px solid #d1d5db', 
                        fontSize: '0.9rem',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#374151' }}>Description</label>
                  <textarea
                    placeholder="Description of the category..."
                    value={categoryForm.description}
                    onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                    rows={3}
                    style={{ 
                      width: '100%', 
                      padding: '0.5rem', 
                      border: '1px solid #d1d5db', 
                      fontSize: '0.9rem',
                      resize: 'vertical',
                      fontFamily: 'inherit',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#374151' }}>Parent Category</label>
                    <select
                      value={categoryForm.parent_id}
                      onChange={(e) => setCategoryForm({ ...categoryForm, parent_id: e.target.value })}
                      style={{ 
                        width: '100%',
                        padding: '0.5rem', 
                        border: '1px solid #d1d5db', 
                        fontSize: '0.9rem',
                        boxSizing: 'border-box'
                      }}
                    >
                      <option value="">None (Top Level)</option>
                      {categoriesData?.categories?.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#374151' }}>Sort Order</label>
                    <input
                      type="number"
                      placeholder="0"
                      value={categoryForm.sort_order}
                      onChange={(e) => setCategoryForm({ ...categoryForm, sort_order: e.target.value })}
                      style={{ 
                        width: '100%',
                        padding: '0.5rem', 
                        border: '1px solid #d1d5db', 
                        fontSize: '0.9rem',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    type="submit"
                    style={{
                      background: '#2E5BBA',
                      color: 'white',
                      border: 'none',
                      padding: '0.75rem 1.5rem',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '0.9rem',
                      fontWeight: '600'
                    }}
                  >
                    {editingCategory ? 'Update Category' : 'Create Category'}
                  </button>
                  {editingCategory && (
                    <button
                      type="button"
                      onClick={handleCancelCategoryEdit}
                      style={{
                        background: '#6b7280',
                        color: 'white',
                        border: 'none',
                        padding: '0.75rem 1.5rem',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '0.9rem',
                        fontWeight: '600'
                      }}
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>

          {/* Categories List */}
          <div style={{ background: 'white', border: '1px solid #d1d5db', margin: '1rem' }}>
            <div style={{ 
              background: '#2E5BBA', 
              color: 'white', 
              padding: '1rem 1.5rem', 
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <span style={{ fontSize: '1rem', fontWeight: '600' }}>Category Management</span>
              <span style={{ fontSize: '0.9rem' }}>
                {categoriesData?.categories?.length || 0} Categories
              </span>
            </div>
            <div style={{ padding: '1.5rem' }}>
              <div style={{ display: 'grid', gap: '1rem' }}>
                {categoriesData?.categories?.map((category) => (
                  <div
                    key={category.id}
                    style={{
                      display: 'flex',
                      background: 'white',
                      border: '1px solid #e5e7eb',
                      padding: '1rem',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <h4 style={{ margin: '0 0 0.5rem 0', color: '#2E5BBA', fontWeight: '600' }}>
                        {category.name}
                      </h4>
                      <div style={{ fontSize: '0.9rem', color: '#6b7280', marginBottom: '0.25rem' }}>
                        Slug: {category.slug}
                      </div>
                      {category.description && (
                        <div style={{ fontSize: '0.9rem', color: '#374151' }}>
                          {category.description}
                        </div>
                      )}
                      <div style={{ fontSize: '0.8rem', color: '#9ca3af', marginTop: '0.5rem' }}>
                        ID: {category.id} | Sort: {category.sort_order || 0}
                      </div>
                    </div>
                    
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button
                        onClick={() => handleEditCategory(category)}
                        style={{
                          background: '#f59e0b',
                          color: 'white',
                          border: 'none',
                          padding: '0.5rem 0.75rem',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '0.8rem'
                        }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteCategory(category.id)}
                        style={{
                          background: '#ef4444',
                          color: 'white',
                          border: 'none',
                          padding: '0.5rem 0.75rem',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '0.8rem'
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Orders Tab */}
      {activeTab === 'orders' && (
        <div style={{ background: 'white', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <div style={{ 
            background: '#2E5BBA', 
            color: 'white', 
            padding: '1rem', 
            fontWeight: 'bold' 
          }}>
            Orders Management
          </div>
          <div style={{ padding: '1rem' }}>
            {ordersData?.orders?.map((order) => (
              <div
                key={order.id}
                style={{
                  border: '1px solid #e5e7eb',
                  marginBottom: '0.5rem',
                  padding: '1rem'
                }}
              >
                <div style={{ 
                  background: '#f8f9fa', 
                  padding: '1rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div>
                    <h4 style={{ margin: '0 0 0.5rem 0' }}>Order #{order.id}</h4>
                    <p style={{ margin: 0, color: '#666' }}>
                      Total: <strong>${order.total.toFixed(2)}</strong> | 
                      Status: <strong style={{ color: order.status === 'completed' ? '#28a745' : '#ffc107' }}>
                        {order.status}
                      </strong>
                    </p>
                  </div>
                  <select
                    value={order.status}
                    onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                    style={{
                      padding: '0.5rem',
                      border: '1px solid #ddd',
                      borderRadius: '4px'
                    }}
                  >
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
                <div style={{ padding: '1rem' }}>
                  {order.items.map((item, index) => (
                    <div
                      key={index}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        padding: '0.5rem 0',
                        borderBottom: index < order.items.length - 1 ? '1px solid #eee' : 'none'
                      }}
                    >
                      <span>{item.product?.title || 'Unknown Product'}</span>
                      <span>Qty: {item.quantity} × ${item.product?.price?.toFixed(2) || '0.00'}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      </div>
    </div>
  );
};

export default AdminPanel;
