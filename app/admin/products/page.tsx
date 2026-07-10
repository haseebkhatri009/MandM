// 'use client';

// import { useEffect, useState } from 'react';
// import { useRouter } from 'next/navigation';
// import { motion } from 'framer-motion';
// import { useAuth } from '@/lib/authContext';
// import { rtdb } from '@/lib/firebase';
// import { ref, onValue, set, remove } from 'firebase/database';
// import { uploadToImgBB } from '@/lib/imgbb';
// import { Upload, Trash2, Edit2, ArrowLeft } from 'lucide-react';
// import Link from 'next/link';

// interface Product {
//   id: string;
//   name: string;
//   price: number;
//   discount?: number;
//   image: string;
//   additionalImages?: string[];
//   category: string;
//   description?: string;
//   stock?: number;
// }

// export default function AdminProductsPage() {
//   const { user, isAdmin, loading: authLoading } = useAuth();
//   const router = useRouter();
//   const [products, setProducts] = useState<Product[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [showForm, setShowForm] = useState(false);
//   const [editingId, setEditingId] = useState<string | null>(null);
//   const [uploading, setUploading] = useState(false);
//   const [imagePreview, setImagePreview] = useState<string>('');

//   const [formData, setFormData] = useState({
//     name: '',
//     price: '',
//     discount: '',
//     stock: '',
//     category: 'Perfume',
//     description: '',
//     image: '' as any,
//     additionalImage1: '' as any,
//     additionalImage2: '' as any,
//     additionalImage3: '' as any
//   });

//   const [additionalImagePreviews, setAdditionalImagePreviews] = useState<string[]>(['', '', '']);

//   // Check admin access - wait for auth to load first
//   useEffect(() => {
//     if (authLoading) return;

//     if (!user) {
//       router.push('/login');
//     } else if (!isAdmin) {
//       router.push('/');
//     }
//   }, [user, isAdmin, authLoading, router]);

//   // Fetch products from Realtime Database
//   useEffect(() => {
//     if (!isAdmin) return;

//     const productsRef = ref(rtdb, 'products');
//     const unsubscribe = onValue(productsRef, (snapshot) => {
//       if (snapshot.exists()) {
//         const productsData: Product[] = [];
//         const data = snapshot.val();
        
//         Object.keys(data).forEach((key) => {
//           productsData.push({
//             id: key,
//             ...data[key]
//           } as Product);
//         });
        
//         setProducts(productsData.sort((a, b) => 
//           new Date(b.id).getTime() - new Date(a.id).getTime()
//         ));
//       } else {
//         setProducts([]);
//       }
//       setLoading(false);
//     });

//     return () => unsubscribe();
//   }, [isAdmin]);

//   const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (!file) return;

//     // Show preview
//     const reader = new FileReader();
//     reader.onloadend = () => {
//       setImagePreview(reader.result as string);
//     };
//     reader.readAsDataURL(file);

//     setFormData(prev => ({
//       ...prev,
//       image: file
//     }));
//   };

//   const handleAdditionalImageChange = async (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
//     const file = e.target.files?.[0];
//     if (!file) return;

//     // Show preview
//     const reader = new FileReader();
//     reader.onloadend = () => {
//       const newPreviews = [...additionalImagePreviews];
//       newPreviews[index] = reader.result as string;
//       setAdditionalImagePreviews(newPreviews);
//     };
//     reader.readAsDataURL(file);

//     setFormData(prev => ({
//       ...prev,
//       [`additionalImage${index + 1}`]: file
//     }));
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setUploading(true);

//     try {
//       let imageUrl = formData.image;

//       // Upload main image to ImgBB if it's a file
//       if (formData.image instanceof File) {
//         imageUrl = await uploadToImgBB(formData.image);
//       }

//       // Upload additional images
//       const additionalImageUrls: string[] = [];
//       for (let i = 0; i < 3; i++) {
//         const imageField = `additionalImage${i + 1}` as keyof typeof formData;
//         if (formData[imageField] instanceof File) {
//           const url = await uploadToImgBB(formData[imageField]);
//           additionalImageUrls.push(url);
//         }
//       }

//       const productData = {
//         name: formData.name,
//         price: parseFloat(formData.price),
//         discount: formData.discount ? parseFloat(formData.discount) : 0,
//         stock: formData.stock ? parseInt(formData.stock) : 0,
//         category: formData.category,
//         description: formData.description,
//         image: imageUrl,
//         ...(additionalImageUrls.length > 0 && { additionalImages: additionalImageUrls }),
//         createdAt: new Date().toISOString()
//       };

//       if (editingId) {
//         // Update existing product
//         await set(ref(rtdb, `products/${editingId}`), {
//           ...productData,
//           updatedAt: new Date().toISOString()
//         });
//       } else {
//         // Add new product
//         const newId = Date.now().toString();
//         await set(ref(rtdb, `products/${newId}`), productData);
//       }

//       // Reset form
//       handleCancel();
//     } catch (error) {
//       console.error('[v0] Error saving product:', error);
//       alert('Error saving product. Check ImgBB API key and connection.');
//     } finally {
//       setUploading(false);
//     }
//   };

//   const handleEdit = (product: Product) => {
//     setFormData({
//       name: product.name,
//       price: product.price.toString(),
//       discount: (product.discount || 0).toString(),
//       stock: (product.stock || 0).toString(),
//       category: product.category,
//       description: product.description || '',
//       image: product.image
//     });
//     setImagePreview(product.image);
//     setEditingId(product.id);
//     setShowForm(true);
//   };

//   const handleDelete = async (id: string) => {
//     if (!confirm('Are you sure you want to delete this product?')) return;

//     try {
//       await remove(ref(rtdb, `products/${id}`));
//     } catch (error) {
//       console.error('[v0] Error deleting product:', error);
//       alert('Error deleting product');
//     }
//   };

//   const handleCancel = () => {
//     setShowForm(false);
//     setEditingId(null);
//     setFormData({
//       name: '',
//       price: '',
//       discount: '',
//       category: 'Perfume',
//       description: '',
//       image: ''
//     });
//     setImagePreview('');
//   };

//   if (authLoading) {
//     return (
//       <div className="min-h-screen bg-background flex items-center justify-center">
//         <p className="text-muted-foreground">Loading...</p>
//       </div>
//     );
//   }

//   if (!user || !isAdmin) {
//     return null;
//   }

//   return (
//     <div className="min-h-screen bg-background">
//       {/* Header */}
//       <div className="bg-secondary border-b border-border">
//         <div className="max-w-7xl mx-auto px-4 py-6">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-4">
//               <Link href="/admin" className="text-muted-foreground hover:text-foreground">
//                 <ArrowLeft size={24} />
//               </Link>
//               <h1 className="text-3xl font-bold">Product Management</h1>
//             </div>
//             <button
//               onClick={() => {
//                 handleCancel();
//                 setShowForm(true);
//               }}
//               className="bg-primary text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
//             >
//               + Add Product
//             </button>
//           </div>
//         </div>
//       </div>

//       <div className="max-w-7xl mx-auto px-4 py-8">

//         {/* Add/Edit Form */}
//         {showForm && (
//           <motion.div
//             initial={{ opacity: 0, y: -20 }}
//             animate={{ opacity: 1, y: 0 }}
//             className="bg-card rounded-lg p-6 mb-8 border border-border shadow-lg"
//           >
//             <h2 className="text-2xl font-bold mb-6">
//               {editingId ? 'Edit Product' : 'Add New Product'}
//             </h2>

//             <form onSubmit={handleSubmit} className="space-y-6">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 {/* Product Name */}
//                 <div>
//                   <label className="block text-sm font-semibold mb-2">Product Name</label>
//                   <input
//                     type="text"
//                     required
//                     value={formData.name}
//                     onChange={(e) => setFormData(prev => ({...prev, name: e.target.value}))}
//                     className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-input"
//                     placeholder="e.g., Jasmine Perfume"
//                   />
//                 </div>

//                 {/* Category */}
//                 <div>
//                   <label className="block text-sm font-semibold mb-2">Category</label>
//                   <select
//                     value={formData.category}
//                     onChange={(e) => setFormData(prev => ({...prev, category: e.target.value}))}
//                     className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-input"
//                   >
//                     <option>Perfume</option>
//                     <option>Wax</option>
//                     <option>Facial Cream</option>
//                   </select>
//                 </div>

//                 {/* Price */}
//                 <div>
//                   <label className="block text-sm font-semibold mb-2">Price (₹)</label>
//                   <input
//                     type="number"
//                     required
//                     step="0.01"
//                     value={formData.price}
//                     onChange={(e) => setFormData(prev => ({...prev, price: e.target.value}))}
//                     className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-input"
//                     placeholder="499"
//                   />
//                 </div>

//                 {/* Discount */}
//                 <div>
//                   <label className="block text-sm font-semibold mb-2">Discount Price (₹) - Optional</label>
//                   <input
//                     type="number"
//                     step="0.01"
//                     value={formData.discount}
//                     onChange={(e) => setFormData(prev => ({...prev, discount: e.target.value}))}
//                     className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-input"
//                     placeholder="399"
//                   />
//                 </div>

//                 {/* Stock */}
//                 <div>
//                   <label className="block text-sm font-semibold mb-2">Stock Quantity</label>
//                   <input
//                     type="number"
//                     required
//                     min="0"
//                     value={formData.stock}
//                     onChange={(e) => setFormData(prev => ({...prev, stock: e.target.value}))}
//                     className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-input"
//                     placeholder="10"
//                   />
//                 </div>
//               </div>

//               {/* Description */}
//               <div>
//                 <label className="block text-sm font-semibold mb-2">Description</label>
//                 <textarea
//                   value={formData.description}
//                   onChange={(e) => setFormData(prev => ({...prev, description: e.target.value}))}
//                   className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-input"
//                   rows={4}
//                   placeholder="Product description..."
//                 />
//               </div>

//               {/* Image Upload */}
//               <div>
//                 <label className="block text-sm font-semibold mb-2">Product Image (Main)</label>
//                 <div className="flex gap-4">
//                   <div className="flex-1">
//                     <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary transition-colors cursor-pointer"
//                       onClick={() => document.getElementById('imageInput')?.click()}
//                     >
//                       <Upload className="mx-auto mb-2 text-muted-foreground" />
//                       <p className="text-sm text-muted-foreground">Click to upload main image</p>
//                       <p className="text-xs text-muted-foreground mt-1">PNG, JPG up to 5MB</p>
//                     </div>
//                     <input
//                       id="imageInput"
//                       type="file"
//                       accept="image/*"
//                       onChange={handleImageChange}
//                       className="hidden"
//                     />
//                   </div>

//                   {/* Image Preview */}
//                   {imagePreview && (
//                     <div className="w-24 h-24 rounded-lg overflow-hidden border border-border">
//                       <img
//                         src={imagePreview}
//                         alt="Preview"
//                         className="w-full h-full object-cover"
//                         onError={(e) => {
//                           e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%23e8e3dc" width="100" height="100"/%3E%3C/svg%3E';
//                         }}
//                       />
//                     </div>
//                   )}
//                 </div>
//               </div>

//               {/* Additional Images - Optional */}
//               <div>
//                 <label className="block text-sm font-semibold mb-3 text-primary">Additional Images (Optional - Up to 3)</label>
//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                   {[0, 1, 2].map((index) => (
//                     <div key={index}>
//                       <div className="border-2 border-dashed border-border rounded-lg p-4 text-center hover:border-primary transition-colors cursor-pointer"
//                         onClick={() => document.getElementById(`additionalImageInput${index}`)?.click()}
//                       >
//                         <Upload className="mx-auto mb-2 text-muted-foreground text-sm" />
//                         <p className="text-xs text-muted-foreground">Image {index + 1}</p>
//                       </div>
//                       <input
//                         id={`additionalImageInput${index}`}
//                         type="file"
//                         accept="image/*"
//                         onChange={(e) => handleAdditionalImageChange(e, index)}
//                         className="hidden"
//                       />

//                       {/* Preview */}
//                       {additionalImagePreviews[index] && (
//                         <div className="mt-2 w-full h-20 rounded-lg overflow-hidden border border-border">
//                           <img
//                             src={additionalImagePreviews[index]}
//                             alt={`Preview ${index + 1}`}
//                             className="w-full h-full object-cover"
//                             onError={(e) => {
//                               e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%23e8e3dc" width="100" height="100"/%3E%3C/svg%3E';
//                             }}
//                           />
//                         </div>
//                       )}
//                     </div>
//                   ))}
//                 </div>
//               </div>

//               {/* Form Actions */}
//               <div className="flex gap-4">
//                 <button
//                   type="submit"
//                   disabled={uploading}
//                   className="bg-primary text-white px-6 py-2 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
//                 >
//                   {uploading ? 'Uploading...' : editingId ? 'Update Product' : 'Add Product'}
//                 </button>
//                 <button
//                   type="button"
//                   onClick={handleCancel}
//                   className="bg-secondary text-foreground px-6 py-2 rounded-lg hover:bg-muted transition-colors"
//                 >
//                   Cancel
//                 </button>
//               </div>
//             </form>
//           </motion.div>
//         )}

//         {/* Products List */}
//         {loading ? (
//           <div className="text-center py-12">
//             <p className="text-muted-foreground">Loading products...</p>
//           </div>
//         ) : products.length > 0 ? (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
//           >
//             {products.map((product, index) => (
//               <motion.div
//                 key={product.id}
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ delay: index * 0.1 }}
//                 className="bg-card rounded-lg overflow-hidden border border-border shadow-md hover:shadow-lg transition-shadow"
//               >
//                 {/* Product Image */}
//                 <div className="h-48 bg-secondary overflow-hidden">
//                   <img
//                     src={product.image}
//                     alt={product.name}
//                     className="w-full h-full object-cover"
//                     onError={(e) => {
//                       e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="300" height="200"%3E%3Crect fill="%23e8e3dc" width="300" height="200"/%3E%3C/svg%3E';
//                     }}
//                   />
//                 </div>

//                 {/* Product Info */}
//                 <div className="p-4">
//                   <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wide">
//                     {product.category}
//                   </p>
//                   <h3 className="font-semibold mb-2 line-clamp-2">{product.name}</h3>
                  
//                   <div className="flex items-center gap-2 mb-3">
//                     <span className="text-lg font-bold text-primary">
//                       ₹{Math.round(product.price - (product.discount || 0))}
//                     </span>
//                     {product.discount && (
//                       <span className="text-sm text-muted-foreground line-through">
//                         ₹{product.price}
//                       </span>
//                     )}
//                   </div>

//                   {product.description && (
//                     <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
//                       {product.description}
//                     </p>
//                   )}

//                   {/* Action Buttons */}
//                   <div className="flex gap-2">
//                     <button
//                       onClick={() => handleEdit(product)}
//                       className="flex-1 bg-secondary hover:bg-muted text-foreground py-2 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
//                     >
//                       <Edit2 size={16} />
//                       Edit
//                     </button>
//                     <button
//                       onClick={() => handleDelete(product.id)}
//                       className="flex-1 bg-red-100 hover:bg-red-200 text-red-700 py-2 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
//                     >
//                       <Trash2 size={16} />
//                       Delete
//                     </button>
//                   </div>
//                 </div>
//               </motion.div>
//             ))}
//           </motion.div>
//         ) : (
//           <div className="text-center py-12 bg-card rounded-lg border border-border">
//             <p className="text-muted-foreground mb-4">No products yet</p>
//             <button
//               onClick={() => setShowForm(true)}
//               className="bg-primary text-white px-6 py-2 rounded-lg hover:opacity-90"
//             >
//               Add First Product
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }







// 'use client';

// import { useEffect, useState } from 'react';
// import { useRouter } from 'next/navigation';
// import { motion } from 'framer-motion';
// import { useAuth } from '@/lib/authContext';
// import { rtdb } from '@/lib/firebase';
// import { ref, onValue, set, remove } from 'firebase/database';
// import { uploadToImgBB } from '@/lib/imgbb';
// import { Upload, Trash2, Edit2, ArrowLeft, X } from 'lucide-react';
// import Link from 'next/link';

// interface Product {
//   id: string;
//   name: string;
//   price: number;
//   discount?: number;
//   image: string;
//   additionalImages?: string[];
//   category: string;
//   description?: string;
//   stock?: number;
// }

// export default function AdminProductsPage() {
//   const { user, isAdmin, loading: authLoading } = useAuth();
//   const router = useRouter();
//   const [products, setProducts] = useState<Product[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [showForm, setShowForm] = useState(false);
//   const [editingId, setEditingId] = useState<string | null>(null);
//   const [uploading, setUploading] = useState(false);
//   const [imagePreview, setImagePreview] = useState<string>('');

//   const [formData, setFormData] = useState({
//     name: '',
//     price: '',
//     discount: '',
//     stock: '',
//     category: 'Perfume',
//     description: '',
//     image: '' as any,
//     additionalImage1: '' as any,
//     additionalImage2: '' as any,
//     additionalImage3: '' as any
//   });

//   const [additionalImagePreviews, setAdditionalImagePreviews] = useState<string[]>(['', '', '']);
//   const [existingAdditionalImages, setExistingAdditionalImages] = useState<string[]>([]);

//   // Check admin access - wait for auth to load first
//   useEffect(() => {
//     if (authLoading) return;

//     if (!user) {
//       router.push('/login');
//     } else if (!isAdmin) {
//       router.push('/');
//     }
//   }, [user, isAdmin, authLoading, router]);

//   // Fetch products from Realtime Database
//   useEffect(() => {
//     if (!isAdmin) return;

//     const productsRef = ref(rtdb, 'products');
//     const unsubscribe = onValue(productsRef, (snapshot) => {
//       if (snapshot.exists()) {
//         const productsData: Product[] = [];
//         const data = snapshot.val();
        
//         Object.keys(data).forEach((key) => {
//           productsData.push({
//             id: key,
//             ...data[key]
//           } as Product);
//         });
        
//         setProducts(productsData.sort((a, b) => 
//           new Date(b.id).getTime() - new Date(a.id).getTime()
//         ));
//       } else {
//         setProducts([]);
//       }
//       setLoading(false);
//     });

//     return () => unsubscribe();
//   }, [isAdmin]);

//   const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (!file) return;

//     // Show preview
//     const reader = new FileReader();
//     reader.onloadend = () => {
//       setImagePreview(reader.result as string);
//     };
//     reader.readAsDataURL(file);

//     setFormData(prev => ({
//       ...prev,
//       image: file
//     }));
//   };

//   const handleAdditionalImageChange = async (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
//     const file = e.target.files?.[0];
//     if (!file) return;

//     // Show preview
//     const reader = new FileReader();
//     reader.onloadend = () => {
//       const newPreviews = [...additionalImagePreviews];
//       newPreviews[index] = reader.result as string;
//       setAdditionalImagePreviews(newPreviews);
//     };
//     reader.readAsDataURL(file);

//     // Remove the existing image URL if it was from database
//     const newExisting = [...existingAdditionalImages];
//     if (newExisting[index]) {
//       newExisting[index] = '';
//       setExistingAdditionalImages(newExisting);
//     }

//     setFormData(prev => ({
//       ...prev,
//       [`additionalImage${index + 1}`]: file
//     }));
//   };

//   const handleRemoveAdditionalImage = (index: number) => {
//     const newPreviews = [...additionalImagePreviews];
//     newPreviews[index] = '';
//     setAdditionalImagePreviews(newPreviews);

//     const newExisting = [...existingAdditionalImages];
//     newExisting[index] = '';
//     setExistingAdditionalImages(newExisting);

//     setFormData(prev => ({
//       ...prev,
//       [`additionalImage${index + 1}`]: ''
//     }));
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setUploading(true);

//     try {
//       let imageUrl = formData.image;

//       // Upload main image to ImgBB if it's a file
//       if (formData.image instanceof File) {
//         imageUrl = await uploadToImgBB(formData.image);
//       }

//       // Collect all additional images
//       const additionalImageUrls: string[] = [];
      
//       // First, check if we have existing images from database
//       if (editingId) {
//         // Keep existing additional images that haven't been replaced
//         const existingImages = existingAdditionalImages.filter(url => url !== '');
//         additionalImageUrls.push(...existingImages);
//       }

//       // Upload new additional images
//       for (let i = 0; i < 3; i++) {
//         const imageField = `additionalImage${i + 1}` as keyof typeof formData;
//         if (formData[imageField] instanceof File) {
//           const url = await uploadToImgBB(formData[imageField]);
//           additionalImageUrls.push(url);
//         }
//       }

//       // Prepare product data - FIXED: createdAt only for new products
//       const productData: any = {
//         name: formData.name,
//         price: parseFloat(formData.price),
//         discount: formData.discount ? parseFloat(formData.discount) : 0,
//         stock: formData.stock ? parseInt(formData.stock) : 0,
//         category: formData.category,
//         description: formData.description,
//         image: imageUrl,
//       };

//       // Only add additionalImages if they exist
//       if (additionalImageUrls.length > 0) {
//         productData.additionalImages = additionalImageUrls;
//       }

//       // Only add createdAt for new products (not for editing)
//       if (!editingId) {
//         productData.createdAt = new Date().toISOString();
//       }

//       if (editingId) {
//         // Update existing product
//         await set(ref(rtdb, `products/${editingId}`), {
//           ...productData,
//           updatedAt: new Date().toISOString()
//         });
//       } else {
//         // Add new product
//         const newId = Date.now().toString();
//         await set(ref(rtdb, `products/${newId}`), productData);
//       }

//       // Reset form
//       handleCancel();
//     } catch (error) {
//       console.error('[v0] Error saving product:', error);
//       alert('Error saving product. Check console for details.');
//     } finally {
//       setUploading(false);
//     }
//   };

//   const handleEdit = (product: Product) => {
//     // Set main image
//     setImagePreview(product.image);
    
//     // Set additional images
//     const additionalImages = product.additionalImages || [];
//     setExistingAdditionalImages(additionalImages);
    
//     // Set previews for additional images
//     const previews = ['', '', ''];
//     additionalImages.forEach((url, index) => {
//       if (index < 3) {
//         previews[index] = url;
//       }
//     });
//     setAdditionalImagePreviews(previews);

//     setFormData({
//       name: product.name,
//       price: product.price.toString(),
//       discount: (product.discount || 0).toString(),
//       stock: (product.stock || 0).toString(),
//       category: product.category,
//       description: product.description || '',
//       image: product.image,
//       additionalImage1: product.additionalImages?.[0] || '',
//       additionalImage2: product.additionalImages?.[1] || '',
//       additionalImage3: product.additionalImages?.[2] || ''
//     });
    
//     setEditingId(product.id);
//     setShowForm(true);
//   };

//   const handleDelete = async (id: string) => {
//     if (!confirm('Are you sure you want to delete this product?')) return;

//     try {
//       await remove(ref(rtdb, `products/${id}`));
//     } catch (error) {
//       console.error('[v0] Error deleting product:', error);
//       alert('Error deleting product');
//     }
//   };

//   const handleCancel = () => {
//     setShowForm(false);
//     setEditingId(null);
//     setFormData({
//       name: '',
//       price: '',
//       discount: '',
//       stock: '',
//       category: 'Perfume',
//       description: '',
//       image: '',
//       additionalImage1: '',
//       additionalImage2: '',
//       additionalImage3: ''
//     });
//     setImagePreview('');
//     setAdditionalImagePreviews(['', '', '']);
//     setExistingAdditionalImages([]);
//   };

//   if (authLoading) {
//     return (
//       <div className="min-h-screen bg-background flex items-center justify-center">
//         <p className="text-muted-foreground">Loading...</p>
//       </div>
//     );
//   }

//   if (!user || !isAdmin) {
//     return null;
//   }

//   return (
//     <div className="min-h-screen bg-background">
//       {/* Header */}
//       <div className="bg-secondary border-b border-border">
//         <div className="max-w-7xl mx-auto px-4 py-6">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-4">
//               <Link href="/admin" className="text-muted-foreground hover:text-foreground">
//                 <ArrowLeft size={24} />
//               </Link>
//               <h1 className="text-3xl font-bold">Product Management</h1>
//             </div>
//             <button
//               onClick={() => {
//                 handleCancel();
//                 setShowForm(true);
//               }}
//               className="bg-primary text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
//             >
//               + Add Product
//             </button>
//           </div>
//         </div>
//       </div>

//       <div className="max-w-7xl mx-auto px-4 py-8">

//         {/* Add/Edit Form */}
//         {showForm && (
//           <motion.div
//             initial={{ opacity: 0, y: -20 }}
//             animate={{ opacity: 1, y: 0 }}
//             className="bg-card rounded-lg p-6 mb-8 border border-border shadow-lg"
//           >
//             <h2 className="text-2xl font-bold mb-6">
//               {editingId ? 'Edit Product' : 'Add New Product'}
//             </h2>

//             <form onSubmit={handleSubmit} className="space-y-6">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 {/* Product Name */}
//                 <div>
//                   <label className="block text-sm font-semibold mb-2">Product Name</label>
//                   <input
//                     type="text"
//                     required
//                     value={formData.name}
//                     onChange={(e) => setFormData(prev => ({...prev, name: e.target.value}))}
//                     className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-input"
//                     placeholder="e.g., Jasmine Perfume"
//                   />
//                 </div>

//                 {/* Category */}
//                 <div>
//                   <label className="block text-sm font-semibold mb-2">Category</label>
//                   <select
//                     value={formData.category}
//                     onChange={(e) => setFormData(prev => ({...prev, category: e.target.value}))}
//                     className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-input"
//                   >
//                     <option value="Perfume">Perfume</option>
//                     <option value="Wax">Wax</option>
//                     <option value="Facial Cream">Facial Cream</option>
//                   </select>
//                 </div>

//                 {/* Price */}
//                 <div>
//                   <label className="block text-sm font-semibold mb-2">Price (₹)</label>
//                   <input
//                     type="number"
//                     required
//                     step="0.01"
//                     value={formData.price}
//                     onChange={(e) => setFormData(prev => ({...prev, price: e.target.value}))}
//                     className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-input"
//                     placeholder="499"
//                   />
//                 </div>

//                 {/* Discount */}
//                 <div>
//                   <label className="block text-sm font-semibold mb-2">Discount Price (₹) - Optional</label>
//                   <input
//                     type="number"
//                     step="0.01"
//                     value={formData.discount}
//                     onChange={(e) => setFormData(prev => ({...prev, discount: e.target.value}))}
//                     className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-input"
//                     placeholder="399"
//                   />
//                 </div>

//                 {/* Stock */}
//                 <div>
//                   <label className="block text-sm font-semibold mb-2">Stock Quantity</label>
//                   <input
//                     type="number"
//                     required
//                     min="0"
//                     value={formData.stock}
//                     onChange={(e) => setFormData(prev => ({...prev, stock: e.target.value}))}
//                     className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-input"
//                     placeholder="10"
//                   />
//                 </div>
//               </div>

//               {/* Description */}
//               <div>
//                 <label className="block text-sm font-semibold mb-2">Description</label>
//                 <textarea
//                   value={formData.description}
//                   onChange={(e) => setFormData(prev => ({...prev, description: e.target.value}))}
//                   className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-input"
//                   rows={4}
//                   placeholder="Product description..."
//                 />
//               </div>

//               {/* Image Upload */}
//               <div>
//                 <label className="block text-sm font-semibold mb-2">Product Image (Main)</label>
//                 <div className="flex gap-4">
//                   <div className="flex-1">
//                     <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary transition-colors cursor-pointer"
//                       onClick={() => document.getElementById('imageInput')?.click()}
//                     >
//                       <Upload className="mx-auto mb-2 text-muted-foreground" />
//                       <p className="text-sm text-muted-foreground">Click to upload main image</p>
//                       <p className="text-xs text-muted-foreground mt-1">PNG, JPG up to 5MB</p>
//                     </div>
//                     <input
//                       id="imageInput"
//                       type="file"
//                       accept="image/*"
//                       onChange={handleImageChange}
//                       className="hidden"
//                     />
//                   </div>

//                   {/* Image Preview */}
//                   {imagePreview && (
//                     <div className="w-24 h-24 rounded-lg overflow-hidden border border-border">
//                       <img
//                         src={imagePreview}
//                         alt="Preview"
//                         className="w-full h-full object-cover"
//                         onError={(e) => {
//                           e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%23e8e3dc" width="100" height="100"/%3E%3C/svg%3E';
//                         }}
//                       />
//                     </div>
//                   )}
//                 </div>
//               </div>

//               {/* Additional Images - Optional */}
//               <div>
//                 <label className="block text-sm font-semibold mb-3 text-primary">Additional Images (Optional - Up to 3)</label>
//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                   {[0, 1, 2].map((index) => (
//                     <div key={index} className="relative">
//                       <div className={`border-2 border-dashed border-border rounded-lg p-4 text-center hover:border-primary transition-colors cursor-pointer ${
//                         additionalImagePreviews[index] ? 'border-primary' : ''
//                       }`}
//                         onClick={() => document.getElementById(`additionalImageInput${index}`)?.click()}
//                       >
//                         <Upload className="mx-auto mb-2 text-muted-foreground text-sm" />
//                         <p className="text-xs text-muted-foreground">Image {index + 1}</p>
//                       </div>
//                       <input
//                         id={`additionalImageInput${index}`}
//                         type="file"
//                         accept="image/*"
//                         onChange={(e) => handleAdditionalImageChange(e, index)}
//                         className="hidden"
//                       />

//                       {/* Preview with remove button */}
//                       {additionalImagePreviews[index] && (
//                         <div className="mt-2 relative w-full h-20 rounded-lg overflow-hidden border border-border">
//                           <img
//                             src={additionalImagePreviews[index]}
//                             alt={`Preview ${index + 1}`}
//                             className="w-full h-full object-cover"
//                             onError={(e) => {
//                               e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%23e8e3dc" width="100" height="100"/%3E%3C/svg%3E';
//                             }}
//                           />
//                           <button
//                             type="button"
//                             onClick={() => handleRemoveAdditionalImage(index)}
//                             className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
//                           >
//                             <X size={14} />
//                           </button>
//                           {existingAdditionalImages[index] && (
//                             <div className="absolute bottom-1 left-1 bg-green-500 text-white text-xs px-2 py-0.5 rounded">
//                               Saved
//                             </div>
//                           )}
//                         </div>
//                       )}
//                     </div>
//                   ))}
//                 </div>
//               </div>

//               {/* Form Actions */}
//               <div className="flex gap-4">
//                 <button
//                   type="submit"
//                   disabled={uploading}
//                   className="bg-primary text-white px-6 py-2 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
//                 >
//                   {uploading ? 'Uploading...' : editingId ? 'Update Product' : 'Add Product'}
//                 </button>
//                 <button
//                   type="button"
//                   onClick={handleCancel}
//                   className="bg-secondary text-foreground px-6 py-2 rounded-lg hover:bg-muted transition-colors"
//                 >
//                   Cancel
//                 </button>
//               </div>
//             </form>
//           </motion.div>
//         )}

//         {/* Products List */}
//         {loading ? (
//           <div className="text-center py-12">
//             <p className="text-muted-foreground">Loading products...</p>
//           </div>
//         ) : products.length > 0 ? (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
//           >
//             {products.map((product, index) => (
//               <motion.div
//                 key={product.id}
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ delay: index * 0.1 }}
//                 className="bg-card rounded-lg overflow-hidden border border-border shadow-md hover:shadow-lg transition-shadow"
//               >
//                 {/* Product Image */}
//                 <div className="h-48 bg-secondary overflow-hidden relative">
//                   <img
//                     src={product.image}
//                     alt={product.name}
//                     className="w-full h-full object-cover"
//                     onError={(e) => {
//                       e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="300" height="200"%3E%3Crect fill="%23e8e3dc" width="300" height="200"/%3E%3C/svg%3E';
//                     }}
//                   />
//                   {product.additionalImages && product.additionalImages.length > 0 && (
//                     <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
//                       +{product.additionalImages.length} more
//                     </div>
//                   )}
//                 </div>

//                 {/* Product Info */}
//                 <div className="p-4">
//                   <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wide">
//                     {product.category}
//                   </p>
//                   <h3 className="font-semibold mb-2 line-clamp-2">{product.name}</h3>
                  
//                   <div className="flex items-center gap-2 mb-3">
//                     <span className="text-lg font-bold text-primary">
//                       ₹{Math.round(product.price - (product.discount || 0))}
//                     </span>
//                     {product.discount && product.discount > 0 && (
//                       <span className="text-sm text-muted-foreground line-through">
//                         ₹{product.price}
//                       </span>
//                     )}
//                   </div>

//                   {product.description && (
//                     <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
//                       {product.description}
//                     </p>
//                   )}

//                   {/* Action Buttons */}
//                   <div className="flex gap-2">
//                     <button
//                       onClick={() => handleEdit(product)}
//                       className="flex-1 bg-secondary hover:bg-muted text-foreground py-2 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
//                     >
//                       <Edit2 size={16} />
//                       Edit
//                     </button>
//                     <button
//                       onClick={() => handleDelete(product.id)}
//                       className="flex-1 bg-red-100 hover:bg-red-200 text-red-700 py-2 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
//                     >
//                       <Trash2 size={16} />
//                       Delete
//                     </button>
//                   </div>
//                 </div>
//               </motion.div>
//             ))}
//           </motion.div>
//         ) : (
//           <div className="text-center py-12 bg-card rounded-lg border border-border">
//             <p className="text-muted-foreground mb-4">No products yet</p>
//             <button
//               onClick={() => setShowForm(true)}
//               className="bg-primary text-white px-6 py-2 rounded-lg hover:opacity-90"
//             >
//               Add First Product
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }


//isfeatured functionality for / page products

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuth } from '@/lib/authContext';
import { rtdb } from '@/lib/firebase';
import { ref, onValue, set, remove } from 'firebase/database';
import { uploadToImgBB } from '@/lib/imgbb';
import { Upload, Trash2, Edit2, ArrowLeft, X, Star } from 'lucide-react';
import Link from 'next/link';
import toast, { Toaster } from 'react-hot-toast';

interface Product {
  id: string;
  name: string;
  price: number;
  discount?: number;
  image: string;
  additionalImages?: string[];
  category: string;
  description?: string;
  stock?: number;
  isFeatured?: boolean;
}

export default function AdminProductsPage() {
  const { user, isAdmin, loading: authLoading } = useAuth();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>('');

  const [formData, setFormData] = useState({
    name: '',
    price: '',
    discount: '',
    stock: '',
    category: 'Perfume',
    description: '',
    image: '' as any,
    additionalImage1: '' as any,
    additionalImage2: '' as any,
    additionalImage3: '' as any,
    isFeatured: false
  });

  const [additionalImagePreviews, setAdditionalImagePreviews] = useState<string[]>(['', '', '']);
  const [existingAdditionalImages, setExistingAdditionalImages] = useState<string[]>([]);

  // Check admin access - wait for auth to load first
  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      router.push('/login');
    } else if (!isAdmin) {
      router.push('/');
    }
  }, [user, isAdmin, authLoading, router]);

  // Fetch products from Realtime Database
  useEffect(() => {
    if (!isAdmin) return;

    const productsRef = ref(rtdb, 'products');
    const unsubscribe = onValue(productsRef, (snapshot) => {
      if (snapshot.exists()) {
        const productsData: Product[] = [];
        const data = snapshot.val();
        
        Object.keys(data).forEach((key) => {
          productsData.push({
            id: key,
            ...data[key]
          } as Product);
        });
        
        setProducts(productsData.sort((a, b) => 
          new Date(b.id).getTime() - new Date(a.id).getTime()
        ));
      } else {
        setProducts([]);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [isAdmin]);

  // Count featured products
  const featuredCount = products.filter(p => p.isFeatured === true).length;

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    setFormData(prev => ({
      ...prev,
      image: file
    }));
  };

  const handleAdditionalImageChange = async (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const newPreviews = [...additionalImagePreviews];
      newPreviews[index] = reader.result as string;
      setAdditionalImagePreviews(newPreviews);
    };
    reader.readAsDataURL(file);

    const newExisting = [...existingAdditionalImages];
    if (newExisting[index]) {
      newExisting[index] = '';
      setExistingAdditionalImages(newExisting);
    }

    setFormData(prev => ({
      ...prev,
      [`additionalImage${index + 1}`]: file
    }));
  };

  const handleRemoveAdditionalImage = (index: number) => {
    const newPreviews = [...additionalImagePreviews];
    newPreviews[index] = '';
    setAdditionalImagePreviews(newPreviews);

    const newExisting = [...existingAdditionalImages];
    newExisting[index] = '';
    setExistingAdditionalImages(newExisting);

    setFormData(prev => ({
      ...prev,
      [`additionalImage${index + 1}`]: ''
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);

    try {
      let imageUrl = formData.image;

      if (formData.image instanceof File) {
        imageUrl = await uploadToImgBB(formData.image);
      }

      const additionalImageUrls: string[] = [];
      
      if (editingId) {
        const existingImages = existingAdditionalImages.filter(url => url !== '');
        additionalImageUrls.push(...existingImages);
      }

      for (let i = 0; i < 3; i++) {
        const imageField = `additionalImage${i + 1}` as keyof typeof formData;
        if (formData[imageField] instanceof File) {
          const url = await uploadToImgBB(formData[imageField]);
          additionalImageUrls.push(url);
        }
      }

      const productData: any = {
        name: formData.name,
        price: parseFloat(formData.price),
        discount: formData.discount ? parseFloat(formData.discount) : 0,
        stock: formData.stock ? parseInt(formData.stock) : 0,
        category: formData.category,
        description: formData.description,
        image: imageUrl,
        isFeatured: formData.isFeatured || false
      };

      if (additionalImageUrls.length > 0) {
        productData.additionalImages = additionalImageUrls;
      }

      if (!editingId) {
        productData.createdAt = new Date().toISOString();
      }

      if (editingId) {
        await set(ref(rtdb, `products/${editingId}`), {
          ...productData,
          updatedAt: new Date().toISOString()
        });
        toast.success('✅ Product updated successfully!');
      } else {
        const newId = Date.now().toString();
        await set(ref(rtdb, `products/${newId}`), productData);
        toast.success('✅ Product added successfully!');
      }

      handleCancel();
    } catch (error) {
      console.error('[v0] Error saving product:', error);
      toast.error('❌ Error saving product');
    } finally {
      setUploading(false);
    }
  };

  const handleEdit = (product: Product) => {
    setImagePreview(product.image);
    
    const additionalImages = product.additionalImages || [];
    setExistingAdditionalImages(additionalImages);
    
    const previews = ['', '', ''];
    additionalImages.forEach((url, index) => {
      if (index < 3) {
        previews[index] = url;
      }
    });
    setAdditionalImagePreviews(previews);

    setFormData({
      name: product.name,
      price: product.price.toString(),
      discount: (product.discount || 0).toString(),
      stock: (product.stock || 0).toString(),
      category: product.category,
      description: product.description || '',
      image: product.image,
      additionalImage1: product.additionalImages?.[0] || '',
      additionalImage2: product.additionalImages?.[1] || '',
      additionalImage3: product.additionalImages?.[2] || '',
      isFeatured: product.isFeatured || false
    });
    
    setEditingId(product.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      await remove(ref(rtdb, `products/${id}`));
      toast.success('✅ Product deleted successfully!');
    } catch (error) {
      console.error('[v0] Error deleting product:', error);
      toast.error('❌ Error deleting product');
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({
      name: '',
      price: '',
      discount: '',
      stock: '',
      category: 'Perfume',
      description: '',
      image: '',
      additionalImage1: '',
      additionalImage2: '',
      additionalImage3: '',
      isFeatured: false
    });
    setImagePreview('');
    setAdditionalImagePreviews(['', '', '']);
    setExistingAdditionalImages([]);
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Toaster position="top-right" />

      {/* Header */}
      <div className="bg-secondary border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/admin" className="text-muted-foreground hover:text-foreground">
                <ArrowLeft size={24} />
              </Link>
              <h1 className="text-3xl font-bold">Product Management</h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="bg-primary/10 px-4 py-2 rounded-lg">
                <span className="font-semibold text-primary">
                  ⭐ {featuredCount}/4 Featured
                </span>
              </div>
              <button
                onClick={() => {
                  handleCancel();
                  setShowForm(true);
                }}
                className="bg-primary text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
              >
                + Add Product
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">

        {/* Add/Edit Form */}
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card rounded-lg p-6 mb-8 border border-border shadow-lg"
          >
            <h2 className="text-2xl font-bold mb-6">
              {editingId ? 'Edit Product' : 'Add New Product'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Product Name */}
                <div>
                  <label className="block text-sm font-semibold mb-2">Product Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({...prev, name: e.target.value}))}
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-input"
                    placeholder="e.g., Jasmine Perfume"
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-semibold mb-2">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData(prev => ({...prev, category: e.target.value}))}
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-input"
                  >
                    <option value="Perfume">Perfume</option>
                    <option value="Wax">Wax</option>
                    <option value="Facial Cream">Facial Cream</option>
                  </select>
                </div>

                {/* Price */}
                <div>
                  <label className="block text-sm font-semibold mb-2">Price (PKR)</label>
                  <input
                    type="number"
                    required
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData(prev => ({...prev, price: e.target.value}))}
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-input"
                    placeholder="499"
                  />
                </div>

                {/* Discount */}
                <div>
                  <label className="block text-sm font-semibold mb-2">Discount Price (PKR) - Optional</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.discount}
                    onChange={(e) => setFormData(prev => ({...prev, discount: e.target.value}))}
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-input"
                    placeholder="399"
                  />
                </div>

                {/* Stock */}
                <div>
                  <label className="block text-sm font-semibold mb-2">Stock Quantity</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formData.stock}
                    onChange={(e) => setFormData(prev => ({...prev, stock: e.target.value}))}
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-input"
                    placeholder="10"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({...prev, description: e.target.value}))}
                  className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-input"
                  rows={4}
                  placeholder="Product description..."
                />
              </div>

              {/* Featured Toggle */}
              <div className="flex items-center gap-4 p-4 bg-secondary/50 rounded-lg border border-border">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isFeatured}
                    onChange={(e) => {
                      // Check if already 4 products are featured
                      if (e.target.checked && featuredCount >= 4 && !editingId) {
                        toast.error('❌ Maximum 4 products can be featured!');
                        return;
                      }
                      if (e.target.checked && featuredCount >= 4 && editingId) {
                        // If editing, check if this product is already featured
                        const currentProduct = products.find(p => p.id === editingId);
                        if (!currentProduct?.isFeatured) {
                          toast.error('❌ Maximum 4 products can be featured!');
                          return;
                        }
                      }
                      setFormData(prev => ({...prev, isFeatured: e.target.checked}));
                    }}
                    className="w-5 h-5 text-primary rounded border-border focus:ring-primary accent-primary"
                  />
                  <span className="ml-3 font-semibold">
                    {formData.isFeatured ? '⭐ Featured Product' : '☆ Add to Featured'}
                  </span>
                </label>
                {formData.isFeatured && (
                  <span className="text-xs text-green-600 font-medium">
                    ✅ Will show on home page
                  </span>
                )}
                {!formData.isFeatured && (
                  <span className="text-xs text-muted-foreground">
                    (Max 4 products can be featured)
                  </span>
                )}
                {featuredCount >= 4 && !formData.isFeatured && (
                  <span className="text-xs text-red-500 font-medium">
                    ⚠️ Slot full! (4/4)
                  </span>
                )}
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-semibold mb-2">Product Image (Main)</label>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary transition-colors cursor-pointer"
                      onClick={() => document.getElementById('imageInput')?.click()}
                    >
                      <Upload className="mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">Click to upload main image</p>
                      <p className="text-xs text-muted-foreground mt-1">PNG, JPG up to 5MB</p>
                    </div>
                    <input
                      id="imageInput"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </div>

                  {/* Image Preview */}
                  {imagePreview && (
                    <div className="w-24 h-24 rounded-lg overflow-hidden border border-border">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%23e8e3dc" width="100" height="100"/%3E%3C/svg%3E';
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Additional Images - Optional */}
              <div>
                <label className="block text-sm font-semibold mb-3 text-primary">Additional Images (Optional - Up to 3)</label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[0, 1, 2].map((index) => (
                    <div key={index} className="relative">
                      <div className={`border-2 border-dashed border-border rounded-lg p-4 text-center hover:border-primary transition-colors cursor-pointer ${
                        additionalImagePreviews[index] ? 'border-primary' : ''
                      }`}
                        onClick={() => document.getElementById(`additionalImageInput${index}`)?.click()}
                      >
                        <Upload className="mx-auto mb-2 text-muted-foreground text-sm" />
                        <p className="text-xs text-muted-foreground">Image {index + 1}</p>
                      </div>
                      <input
                        id={`additionalImageInput${index}`}
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleAdditionalImageChange(e, index)}
                        className="hidden"
                      />

                      {/* Preview with remove button */}
                      {additionalImagePreviews[index] && (
                        <div className="mt-2 relative w-full h-20 rounded-lg overflow-hidden border border-border">
                          <img
                            src={additionalImagePreviews[index]}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%23e8e3dc" width="100" height="100"/%3E%3C/svg%3E';
                            }}
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveAdditionalImage(index)}
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                          >
                            <X size={14} />
                          </button>
                          {existingAdditionalImages[index] && (
                            <div className="absolute bottom-1 left-1 bg-green-500 text-white text-xs px-2 py-0.5 rounded">
                              Saved
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={uploading}
                  className="bg-primary text-white px-6 py-2 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {uploading ? 'Uploading...' : editingId ? 'Update Product' : 'Add Product'}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="bg-secondary text-foreground px-6 py-2 rounded-lg hover:bg-muted transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        )}

        {/* Products List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading products...</p>
          </div>
        ) : products.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {products.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`bg-card rounded-lg overflow-hidden border shadow-md hover:shadow-lg transition-shadow ${
                  product.isFeatured ? 'border-primary border-2' : 'border-border'
                }`}
              >
                {/* Product Image */}
                <div className="h-48 bg-secondary overflow-hidden relative">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="300" height="200"%3E%3Crect fill="%23e8e3dc" width="300" height="200"/%3E%3C/svg%3E';
                    }}
                  />
                  {/* Featured Badge */}
                  {product.isFeatured && (
                    <div className="absolute top-2 left-2 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white text-xs px-3 py-1 rounded-full font-semibold shadow-lg flex items-center gap-1">
                      <Star className="w-3 h-3 fill-current" />
                      Featured
                    </div>
                  )}
                  {product.additionalImages && product.additionalImages.length > 0 && (
                    <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                      +{product.additionalImages.length} more
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className="p-4">
                  <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wide">
                    {product.category}
                  </p>
                  <h3 className="font-semibold mb-2 line-clamp-2">{product.name}</h3>
                  
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-lg font-bold text-primary">
                      PKR {Math.round(product.price - (product.discount || 0))}
                    </span>
                    {product.discount && product.discount > 0 && (
                      <span className="text-sm text-muted-foreground line-through">
                        PKR {product.price}
                      </span>
                    )}
                  </div>

                  {product.description && (
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {product.description}
                    </p>
                  )}

                  {/* Stock Badge */}
                  <div className="mb-4">
                    <span className={`text-xs px-2 py-1 rounded ${
                      (product.stock || 0) > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {(product.stock || 0) > 0 ? `In Stock (${product.stock})` : 'Out of Stock'}
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(product)}
                      className="flex-1 bg-secondary hover:bg-muted text-foreground py-2 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                    >
                      <Edit2 size={16} />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="flex-1 bg-red-100 hover:bg-red-200 text-red-700 py-2 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                    >
                      <Trash2 size={16} />
                      Delete
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="text-center py-12 bg-card rounded-lg border border-border">
            <p className="text-muted-foreground mb-4">No products yet</p>
            <button
              onClick={() => setShowForm(true)}
              className="bg-primary text-white px-6 py-2 rounded-lg hover:opacity-90"
            >
              Add First Product
            </button>
          </div>
        )}
      </div>
    </div>
  );
} 