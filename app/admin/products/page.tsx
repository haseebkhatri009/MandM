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

// 'use client';

// import { useEffect, useState } from 'react';
// import { useRouter } from 'next/navigation';
// import { motion } from 'framer-motion';
// import { useAuth } from '@/lib/authContext';
// import { rtdb } from '@/lib/firebase';
// import { ref, onValue, set, remove } from 'firebase/database';
// import { uploadToImgBB } from '@/lib/imgbb';
// import { Upload, Trash2, Edit2, ArrowLeft, X, Star } from 'lucide-react';
// import Link from 'next/link';
// import toast, { Toaster } from 'react-hot-toast';

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
//   isFeatured?: boolean;
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
//     additionalImage3: '' as any,
//     isFeatured: false
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

//   // Count featured products
//   const featuredCount = products.filter(p => p.isFeatured === true).length;

//   const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (!file) return;

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

//     const reader = new FileReader();
//     reader.onloadend = () => {
//       const newPreviews = [...additionalImagePreviews];
//       newPreviews[index] = reader.result as string;
//       setAdditionalImagePreviews(newPreviews);
//     };
//     reader.readAsDataURL(file);

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

//       if (formData.image instanceof File) {
//         imageUrl = await uploadToImgBB(formData.image);
//       }

//       const additionalImageUrls: string[] = [];
      
//       if (editingId) {
//         const existingImages = existingAdditionalImages.filter(url => url !== '');
//         additionalImageUrls.push(...existingImages);
//       }

//       for (let i = 0; i < 3; i++) {
//         const imageField = `additionalImage${i + 1}` as keyof typeof formData;
//         if (formData[imageField] instanceof File) {
//           const url = await uploadToImgBB(formData[imageField]);
//           additionalImageUrls.push(url);
//         }
//       }

//       const productData: any = {
//         name: formData.name,
//         price: parseFloat(formData.price),
//         discount: formData.discount ? parseFloat(formData.discount) : 0,
//         stock: formData.stock ? parseInt(formData.stock) : 0,
//         category: formData.category,
//         description: formData.description,
//         image: imageUrl,
//         isFeatured: formData.isFeatured || false
//       };

//       if (additionalImageUrls.length > 0) {
//         productData.additionalImages = additionalImageUrls;
//       }

//       if (!editingId) {
//         productData.createdAt = new Date().toISOString();
//       }

//       if (editingId) {
//         await set(ref(rtdb, `products/${editingId}`), {
//           ...productData,
//           updatedAt: new Date().toISOString()
//         });
//         toast.success('✅ Product updated successfully!');
//       } else {
//         const newId = Date.now().toString();
//         await set(ref(rtdb, `products/${newId}`), productData);
//         toast.success('✅ Product added successfully!');
//       }

//       handleCancel();
//     } catch (error) {
//       console.error('[v0] Error saving product:', error);
//       toast.error('❌ Error saving product');
//     } finally {
//       setUploading(false);
//     }
//   };

//   const handleEdit = (product: Product) => {
//     setImagePreview(product.image);
    
//     const additionalImages = product.additionalImages || [];
//     setExistingAdditionalImages(additionalImages);
    
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
//       additionalImage3: product.additionalImages?.[2] || '',
//       isFeatured: product.isFeatured || false
//     });
    
//     setEditingId(product.id);
//     setShowForm(true);
//   };

//   const handleDelete = async (id: string) => {
//     if (!confirm('Are you sure you want to delete this product?')) return;

//     try {
//       await remove(ref(rtdb, `products/${id}`));
//       toast.success('✅ Product deleted successfully!');
//     } catch (error) {
//       console.error('[v0] Error deleting product:', error);
//       toast.error('❌ Error deleting product');
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
//       additionalImage3: '',
//       isFeatured: false
//     });
//     setImagePreview('');
//     setAdditionalImagePreviews(['', '', '']);
//     setExistingAdditionalImages([]);
//   };

//   if (authLoading) {
//     return (
//       <div className="min-h-screen bg-background flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
//           <p className="mt-4 text-muted-foreground">Loading...</p>
//         </div>
//       </div>
//     );
//   }

//   if (!user || !isAdmin) {
//     return null;
//   }

//   return (
//     <div className="min-h-screen bg-background">
//       <Toaster position="top-right" />

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
//             <div className="flex items-center gap-4">
//               <div className="bg-primary/10 px-4 py-2 rounded-lg">
//                 <span className="font-semibold text-primary">
//                   ⭐ {featuredCount}/4 Featured
//                 </span>
//               </div>
//               <button
//                 onClick={() => {
//                   handleCancel();
//                   setShowForm(true);
//                 }}
//                 className="bg-primary text-white px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
//               >
//                 + Add Product
//               </button>
//             </div>
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
//                   <label className="block text-sm font-semibold mb-2">Price (PKR)</label>
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
//                   <label className="block text-sm font-semibold mb-2">Discount Price (PKR) - Optional</label>
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

//               {/* Featured Toggle */}
//               <div className="flex items-center gap-4 p-4 bg-secondary/50 rounded-lg border border-border">
//                 <label className="flex items-center cursor-pointer">
//                   <input
//                     type="checkbox"
//                     checked={formData.isFeatured}
//                     onChange={(e) => {
//                       // Check if already 4 products are featured
//                       if (e.target.checked && featuredCount >= 4 && !editingId) {
//                         toast.error('❌ Maximum 4 products can be featured!');
//                         return;
//                       }
//                       if (e.target.checked && featuredCount >= 4 && editingId) {
//                         // If editing, check if this product is already featured
//                         const currentProduct = products.find(p => p.id === editingId);
//                         if (!currentProduct?.isFeatured) {
//                           toast.error('❌ Maximum 4 products can be featured!');
//                           return;
//                         }
//                       }
//                       setFormData(prev => ({...prev, isFeatured: e.target.checked}));
//                     }}
//                     className="w-5 h-5 text-primary rounded border-border focus:ring-primary accent-primary"
//                   />
//                   <span className="ml-3 font-semibold">
//                     {formData.isFeatured ? '⭐ Featured Product' : '☆ Add to Featured'}
//                   </span>
//                 </label>
//                 {formData.isFeatured && (
//                   <span className="text-xs text-green-600 font-medium">
//                     ✅ Will show on home page
//                   </span>
//                 )}
//                 {!formData.isFeatured && (
//                   <span className="text-xs text-muted-foreground">
//                     (Max 4 products can be featured)
//                   </span>
//                 )}
//                 {featuredCount >= 4 && !formData.isFeatured && (
//                   <span className="text-xs text-red-500 font-medium">
//                     ⚠️ Slot full! (4/4)
//                   </span>
//                 )}
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
//             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
//             <p className="mt-4 text-muted-foreground">Loading products...</p>
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
//                 className={`bg-card rounded-lg overflow-hidden border shadow-md hover:shadow-lg transition-shadow ${
//                   product.isFeatured ? 'border-primary border-2' : 'border-border'
//                 }`}
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
//                   {/* Featured Badge */}
//                   {product.isFeatured && (
//                     <div className="absolute top-2 left-2 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white text-xs px-3 py-1 rounded-full font-semibold shadow-lg flex items-center gap-1">
//                       <Star className="w-3 h-3 fill-current" />
//                       Featured
//                     </div>
//                   )}
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
//                       PKR {Math.round(product.price - (product.discount || 0))}
//                     </span>
//                     {product.discount && product.discount > 0 && (
//                       <span className="text-sm text-muted-foreground line-through">
//                         PKR {product.price}
//                       </span>
//                     )}
//                   </div>

//                   {product.description && (
//                     <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
//                       {product.description}
//                     </p>
//                   )}

//                   {/* Stock Badge */}
//                   <div className="mb-4">
//                     <span className={`text-xs px-2 py-1 rounded ${
//                       (product.stock || 0) > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
//                     }`}>
//                       {(product.stock || 0) > 0 ? `In Stock (${product.stock})` : 'Out of Stock'}
//                     </span>
//                   </div>

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










//mobile alignment featured product and without custom category
// 'use client';

// import { useEffect, useState } from 'react';
// import { useRouter } from 'next/navigation';
// import { motion } from 'framer-motion';
// import { useAuth } from '@/lib/authContext';
// import { rtdb } from '@/lib/firebase';
// import { ref, onValue, set, remove } from 'firebase/database';
// import { uploadToImgBB } from '@/lib/imgbb';
// import { Upload, Trash2, Edit2, ArrowLeft, X, Star } from 'lucide-react';
// import Link from 'next/link';
// import toast, { Toaster } from 'react-hot-toast';

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
//   isFeatured?: boolean;
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
//     additionalImage3: '' as any,
//     isFeatured: false
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

//   // Count featured products
//   const featuredCount = products.filter(p => p.isFeatured === true).length;

//   const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (!file) return;

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

//     const reader = new FileReader();
//     reader.onloadend = () => {
//       const newPreviews = [...additionalImagePreviews];
//       newPreviews[index] = reader.result as string;
//       setAdditionalImagePreviews(newPreviews);
//     };
//     reader.readAsDataURL(file);

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

//       if (formData.image instanceof File) {
//         imageUrl = await uploadToImgBB(formData.image);
//       }

//       const additionalImageUrls: string[] = [];
      
//       if (editingId) {
//         const existingImages = existingAdditionalImages.filter(url => url !== '');
//         additionalImageUrls.push(...existingImages);
//       }

//       for (let i = 0; i < 3; i++) {
//         const imageField = `additionalImage${i + 1}` as keyof typeof formData;
//         if (formData[imageField] instanceof File) {
//           const url = await uploadToImgBB(formData[imageField]);
//           additionalImageUrls.push(url);
//         }
//       }

//       const productData: any = {
//         name: formData.name,
//         price: parseFloat(formData.price),
//         discount: formData.discount ? parseFloat(formData.discount) : 0,
//         stock: formData.stock ? parseInt(formData.stock) : 0,
//         category: formData.category,
//         description: formData.description,
//         image: imageUrl,
//         isFeatured: formData.isFeatured || false
//       };

//       if (additionalImageUrls.length > 0) {
//         productData.additionalImages = additionalImageUrls;
//       }

//       if (!editingId) {
//         productData.createdAt = new Date().toISOString();
//       }

//       if (editingId) {
//         await set(ref(rtdb, `products/${editingId}`), {
//           ...productData,
//           updatedAt: new Date().toISOString()
//         });
//         toast.success('✅ Product updated successfully!');
//       } else {
//         const newId = Date.now().toString();
//         await set(ref(rtdb, `products/${newId}`), productData);
//         toast.success('✅ Product added successfully!');
//       }

//       handleCancel();
//     } catch (error) {
//       console.error('[v0] Error saving product:', error);
//       toast.error('❌ Error saving product');
//     } finally {
//       setUploading(false);
//     }
//   };

//   const handleEdit = (product: Product) => {
//     setImagePreview(product.image);
    
//     const additionalImages = product.additionalImages || [];
//     setExistingAdditionalImages(additionalImages);
    
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
//       additionalImage3: product.additionalImages?.[2] || '',
//       isFeatured: product.isFeatured || false
//     });
    
//     setEditingId(product.id);
//     setShowForm(true);
//   };

//   const handleDelete = async (id: string) => {
//     if (!confirm('Are you sure you want to delete this product?')) return;

//     try {
//       await remove(ref(rtdb, `products/${id}`));
//       toast.success('✅ Product deleted successfully!');
//     } catch (error) {
//       console.error('[v0] Error deleting product:', error);
//       toast.error('❌ Error deleting product');
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
//       additionalImage3: '',
//       isFeatured: false
//     });
//     setImagePreview('');
//     setAdditionalImagePreviews(['', '', '']);
//     setExistingAdditionalImages([]);
//   };

//   if (authLoading) {
//     return (
//       <div className="min-h-screen bg-background flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
//           <p className="mt-4 text-muted-foreground">Loading...</p>
//         </div>
//       </div>
//     );
//   }

//   if (!user || !isAdmin) {
//     return null;
//   }

//   return (
//     <div className="min-h-screen bg-background">
//       <Toaster position="top-right" />

//       {/* Header */}
//       <div className="bg-secondary border-b border-border">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
//           <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
//             <div className="flex items-center gap-3 sm:gap-4">
//               <Link href="/admin" className="text-muted-foreground hover:text-foreground transition-colors">
//                 <ArrowLeft size={20} className="sm:w-6 sm:h-6" />
//               </Link>
//               <h1 className="text-xl sm:text-2xl md:text-3xl font-bold truncate">
//                 Product Management
//               </h1>
//             </div>
//             <div className="flex flex-wrap items-center gap-2 sm:gap-4">
//               <div className="bg-primary/10 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-sm sm:text-base whitespace-nowrap">
//                 <span className="font-semibold text-primary">
//                   ⭐ {featuredCount}/4 Featured
//                 </span>
//               </div>
//               <button
//                 onClick={() => {
//                   handleCancel();
//                   setShowForm(true);
//                 }}
//                 className="bg-primary text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg hover:opacity-90 transition-opacity text-sm sm:text-base whitespace-nowrap"
//               >
//                 + Add Product
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">

//         {/* Add/Edit Form */}
//         {showForm && (
//           <motion.div
//             initial={{ opacity: 0, y: -20 }}
//             animate={{ opacity: 1, y: 0 }}
//             className="bg-card rounded-lg p-4 sm:p-6 mb-6 sm:mb-8 border border-border shadow-lg"
//           >
//             <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">
//               {editingId ? 'Edit Product' : 'Add New Product'}
//             </h2>

//             <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
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
//                   <label className="block text-sm font-semibold mb-2">Price (PKR)</label>
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
//                   <label className="block text-sm font-semibold mb-2">Discount Price (PKR) - Optional</label>
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

//               {/* Featured Toggle */}
//               <div className="flex flex-wrap items-center gap-3 p-4 bg-secondary/50 rounded-lg border border-border">
//                 <label className="flex items-center cursor-pointer">
//                   <input
//                     type="checkbox"
//                     checked={formData.isFeatured}
//                     onChange={(e) => {
//                       if (e.target.checked && featuredCount >= 4 && !editingId) {
//                         toast.error('❌ Maximum 4 products can be featured!');
//                         return;
//                       }
//                       if (e.target.checked && featuredCount >= 4 && editingId) {
//                         const currentProduct = products.find(p => p.id === editingId);
//                         if (!currentProduct?.isFeatured) {
//                           toast.error('❌ Maximum 4 products can be featured!');
//                           return;
//                         }
//                       }
//                       setFormData(prev => ({...prev, isFeatured: e.target.checked}));
//                     }}
//                     className="w-5 h-5 text-primary rounded border-border focus:ring-primary accent-primary"
//                   />
//                   <span className="ml-3 font-semibold text-sm sm:text-base">
//                     {formData.isFeatured ? '⭐ Featured Product' : '☆ Add to Featured'}
//                   </span>
//                 </label>
//                 {formData.isFeatured && (
//                   <span className="text-xs text-green-600 font-medium">
//                     ✅ Will show on home page
//                   </span>
//                 )}
//                 {!formData.isFeatured && (
//                   <span className="text-xs text-muted-foreground">
//                     (Max 4 products can be featured)
//                   </span>
//                 )}
//                 {featuredCount >= 4 && !formData.isFeatured && (
//                   <span className="text-xs text-red-500 font-medium">
//                     ⚠️ Slot full! (4/4)
//                   </span>
//                 )}
//               </div>

//               {/* Image Upload */}
//               <div>
//                 <label className="block text-sm font-semibold mb-2">Product Image (Main)</label>
//                 <div className="flex flex-wrap gap-4">
//                   <div className="flex-1 min-w-[200px]">
//                     <div className="border-2 border-dashed border-border rounded-lg p-4 sm:p-6 text-center hover:border-primary transition-colors cursor-pointer"
//                       onClick={() => document.getElementById('imageInput')?.click()}
//                     >
//                       <Upload className="mx-auto mb-2 text-muted-foreground" size={24} />
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
//                     <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg overflow-hidden border border-border flex-shrink-0">
//                       <img
//                         src={imagePreview}
//                         alt="Preview"
//                         className="w-full h-full object-contain"
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
//                 <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
//                   {[0, 1, 2].map((index) => (
//                     <div key={index} className="relative">
//                       <div className={`border-2 border-dashed border-border rounded-lg p-3 sm:p-4 text-center hover:border-primary transition-colors cursor-pointer ${
//                         additionalImagePreviews[index] ? 'border-primary' : ''
//                       }`}
//                         onClick={() => document.getElementById(`additionalImageInput${index}`)?.click()}
//                       >
//                         <Upload className="mx-auto mb-2 text-muted-foreground text-sm" size={20} />
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
//                         <div className="mt-2 relative w-full h-16 sm:h-20 rounded-lg overflow-hidden border border-border">
//                           <img
//                             src={additionalImagePreviews[index]}
//                             alt={`Preview ${index + 1}`}
//                             className="w-full h-full object-contain"
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
//               <div className="flex flex-wrap gap-3">
//                 <button
//                   type="submit"
//                   disabled={uploading}
//                   className="bg-primary text-white px-4 sm:px-6 py-2 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 text-sm sm:text-base"
//                 >
//                   {uploading ? 'Uploading...' : editingId ? 'Update Product' : 'Add Product'}
//                 </button>
//                 <button
//                   type="button"
//                   onClick={handleCancel}
//                   className="bg-secondary text-foreground px-4 sm:px-6 py-2 rounded-lg hover:bg-muted transition-colors text-sm sm:text-base"
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
//             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
//             <p className="mt-4 text-muted-foreground">Loading products...</p>
//           </div>
//         ) : products.length > 0 ? (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6"
//           >
//             {products.map((product, index) => (
//               <motion.div
//                 key={product.id}
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ delay: index * 0.1 }}
//                 className={`bg-card rounded-lg overflow-hidden border shadow-md hover:shadow-lg transition-shadow ${
//                   product.isFeatured ? 'border-primary border-2' : 'border-border'
//                 }`}
//               >
//                 {/* Product Image - Full image visible */}
//                 <div className="w-full aspect-square bg-secondary overflow-hidden relative flex items-center justify-center p-2">
//                   <img
//                     src={product.image}
//                     alt={product.name}
//                     className="w-full h-full object-contain"
//                     onError={(e) => {
//                       e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="300" height="300"%3E%3Crect fill="%23e8e3dc" width="300" height="300"/%3E%3C/svg%3E';
//                     }}
//                   />
//                   {/* Featured Badge */}
//                   {product.isFeatured && (
//                     <div className="absolute top-2 left-2 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white text-xs px-2 sm:px-3 py-1 rounded-full font-semibold shadow-lg flex items-center gap-1">
//                       <Star className="w-3 h-3 fill-current" />
//                       <span className="hidden xs:inline">Featured</span>
//                     </div>
//                   )}
//                   {product.additionalImages && product.additionalImages.length > 0 && (
//                     <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
//                       +{product.additionalImages.length}
//                     </div>
//                   )}
//                 </div>

//                 {/* Product Info */}
//                 <div className="p-3 sm:p-4">
//                   <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wide truncate">
//                     {product.category}
//                   </p>
//                   <h3 className="font-semibold mb-2 line-clamp-2 text-sm sm:text-base">{product.name}</h3>
                  
//                   <div className="flex items-center gap-2 mb-2 sm:mb-3 flex-wrap">
//                     <span className="text-base sm:text-lg font-bold text-primary">
//                       PKR {Math.round(product.price - (product.discount || 0))}
//                     </span>
//                     {product.discount && product.discount > 0 && (
//                       <span className="text-xs sm:text-sm text-muted-foreground line-through">
//                         PKR {product.price}
//                       </span>
//                     )}
//                   </div>

//                   {product.description && (
//                     <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4 line-clamp-2">
//                       {product.description}
//                     </p>
//                   )}

//                   {/* Stock Badge */}
//                   <div className="mb-3 sm:mb-4">
//                     <span className={`text-xs px-2 py-1 rounded ${
//                       (product.stock || 0) > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
//                     }`}>
//                       {(product.stock || 0) > 0 ? `In Stock (${product.stock})` : 'Out of Stock'}
//                     </span>
//                   </div>

//                   {/* Action Buttons */}
//                   <div className="flex gap-2">
//                     <button
//                       onClick={() => handleEdit(product)}
//                       className="flex-1 bg-secondary hover:bg-muted text-foreground py-1.5 sm:py-2 rounded-lg font-semibold transition-colors flex items-center justify-center gap-1 sm:gap-2 text-xs sm:text-sm"
//                     >
//                       <Edit2 size={14} className="sm:w-4 sm:h-4" />
//                       <span>Edit</span>
//                     </button>
//                     <button
//                       onClick={() => handleDelete(product.id)}
//                       className="flex-1 bg-red-100 hover:bg-red-200 text-red-700 py-1.5 sm:py-2 rounded-lg font-semibold transition-colors flex items-center justify-center gap-1 sm:gap-2 text-xs sm:text-sm"
//                     >
//                       <Trash2 size={14} className="sm:w-4 sm:h-4" />
//                       <span>Delete</span>
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



//with custom category and without multiple img and category
// 'use client';

// import { useEffect, useState } from 'react';
// import { useRouter } from 'next/navigation';
// import { motion } from 'framer-motion';
// import { useAuth } from '@/lib/authContext';
// import { rtdb } from '@/lib/firebase';
// import { ref, onValue, set, remove } from 'firebase/database';
// import { uploadToImgBB } from '@/lib/imgbb';
// import { Upload, Trash2, Edit2, ArrowLeft, X, Star, Plus, Tags } from 'lucide-react';
// import Link from 'next/link';
// import toast, { Toaster } from 'react-hot-toast';

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
//   isFeatured?: boolean;
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
//   const [customCategory, setCustomCategory] = useState('');
//   const [showCustomCategory, setShowCustomCategory] = useState(false);

//   // ✅ Predefined Categories
//   const predefinedCategories = [
//     'Perfume',
//     'Wax',
//     'Facial Cream',
//     'Body Lotion',
//     'Soap',
//     'Scrub',
//     'Oil'
//   ];

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
//     additionalImage3: '' as any,
//     isFeatured: false
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

//   // Count featured products
//   const featuredCount = products.filter(p => p.isFeatured === true).length;

//   const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (!file) return;

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

//     const reader = new FileReader();
//     reader.onloadend = () => {
//       const newPreviews = [...additionalImagePreviews];
//       newPreviews[index] = reader.result as string;
//       setAdditionalImagePreviews(newPreviews);
//     };
//     reader.readAsDataURL(file);

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

//   // ✅ Handle Category Change
//   const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
//     const value = e.target.value;
//     if (value === 'custom') {
//       setShowCustomCategory(true);
//       setFormData(prev => ({ ...prev, category: '' }));
//     } else {
//       setShowCustomCategory(false);
//       setFormData(prev => ({ ...prev, category: value }));
//     }
//   };

//   const handleCustomCategoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const value = e.target.value;
//     setCustomCategory(value);
//     setFormData(prev => ({ ...prev, category: value }));
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setUploading(true);

//     try {
//       let imageUrl = formData.image;

//       if (formData.image instanceof File) {
//         imageUrl = await uploadToImgBB(formData.image);
//       }

//       const additionalImageUrls: string[] = [];
      
//       if (editingId) {
//         const existingImages = existingAdditionalImages.filter(url => url !== '');
//         additionalImageUrls.push(...existingImages);
//       }

//       for (let i = 0; i < 3; i++) {
//         const imageField = `additionalImage${i + 1}` as keyof typeof formData;
//         if (formData[imageField] instanceof File) {
//           const url = await uploadToImgBB(formData[imageField]);
//           additionalImageUrls.push(url);
//         }
//       }

//       const productData: any = {
//         name: formData.name,
//         price: parseFloat(formData.price),
//         discount: formData.discount ? parseFloat(formData.discount) : 0,
//         stock: formData.stock ? parseInt(formData.stock) : 0,
//         category: formData.category || customCategory || 'Other',
//         description: formData.description,
//         image: imageUrl,
//         isFeatured: formData.isFeatured || false
//       };

//       if (additionalImageUrls.length > 0) {
//         productData.additionalImages = additionalImageUrls;
//       }

//       if (!editingId) {
//         productData.createdAt = new Date().toISOString();
//       }

//       if (editingId) {
//         await set(ref(rtdb, `products/${editingId}`), {
//           ...productData,
//           updatedAt: new Date().toISOString()
//         });
//         toast.success('✅ Product updated successfully!');
//       } else {
//         const newId = Date.now().toString();
//         await set(ref(rtdb, `products/${newId}`), productData);
//         toast.success('✅ Product added successfully!');
//       }

//       handleCancel();
//     } catch (error) {
//       console.error('[v0] Error saving product:', error);
//       toast.error('❌ Error saving product');
//     } finally {
//       setUploading(false);
//     }
//   };

//   const handleEdit = (product: Product) => {
//     setImagePreview(product.image);
    
//     const additionalImages = product.additionalImages || [];
//     setExistingAdditionalImages(additionalImages);
    
//     const previews = ['', '', ''];
//     additionalImages.forEach((url, index) => {
//       if (index < 3) {
//         previews[index] = url;
//       }
//     });
//     setAdditionalImagePreviews(previews);

//     // ✅ Check if category is predefined or custom
//     const isPredefined = predefinedCategories.includes(product.category);
//     if (isPredefined) {
//       setShowCustomCategory(false);
//       setCustomCategory('');
//     } else {
//       setShowCustomCategory(true);
//       setCustomCategory(product.category);
//     }

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
//       additionalImage3: product.additionalImages?.[2] || '',
//       isFeatured: product.isFeatured || false
//     });
    
//     setEditingId(product.id);
//     setShowForm(true);
//   };

//   const handleDelete = async (id: string) => {
//     if (!confirm('Are you sure you want to delete this product?')) return;

//     try {
//       await remove(ref(rtdb, `products/${id}`));
//       toast.success('✅ Product deleted successfully!');
//     } catch (error) {
//       console.error('[v0] Error deleting product:', error);
//       toast.error('❌ Error deleting product');
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
//       additionalImage3: '',
//       isFeatured: false
//     });
//     setImagePreview('');
//     setAdditionalImagePreviews(['', '', '']);
//     setExistingAdditionalImages([]);
//     setCustomCategory('');
//     setShowCustomCategory(false);
//   };

//   if (authLoading) {
//     return (
//       <div className="min-h-screen bg-background flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
//           <p className="mt-4 text-muted-foreground">Loading...</p>
//         </div>
//       </div>
//     );
//   }

//   if (!user || !isAdmin) {
//     return null;
//   }

//   return (
//     <div className="min-h-screen bg-background">
//       <Toaster position="top-right" />

//       {/* Header */}
//       <div className="bg-secondary border-b border-border">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
//           <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
//             <div className="flex items-center gap-3 sm:gap-4">
//               <Link href="/admin" className="text-muted-foreground hover:text-foreground transition-colors">
//                 <ArrowLeft size={20} className="sm:w-6 sm:h-6" />
//               </Link>
//               <h1 className="text-xl sm:text-2xl md:text-3xl font-bold truncate">
//                 Product Management
//               </h1>
//             </div>
//             <div className="flex flex-wrap items-center gap-2 sm:gap-4">
//               <div className="bg-primary/10 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-sm sm:text-base whitespace-nowrap">
//                 <span className="font-semibold text-primary">
//                   ⭐ {featuredCount}/4 Featured
//                 </span>
//               </div>
//               <button
//                 onClick={() => {
//                   handleCancel();
//                   setShowForm(true);
//                 }}
//                 className="bg-primary text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg hover:opacity-90 transition-opacity text-sm sm:text-base whitespace-nowrap"
//               >
//                 + Add Product
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">

//         {/* Add/Edit Form */}
//         {showForm && (
//           <motion.div
//             initial={{ opacity: 0, y: -20 }}
//             animate={{ opacity: 1, y: 0 }}
//             className="bg-card rounded-lg p-4 sm:p-6 mb-6 sm:mb-8 border border-border shadow-lg"
//           >
//             <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">
//               {editingId ? 'Edit Product' : 'Add New Product'}
//             </h2>

//             <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
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

//                 {/* ✅ Category with Custom Option */}
//                 <div>
//                   <label className="block text-sm font-semibold mb-2 flex items-center gap-2">
//                     <Tags className="w-4 h-4" />
//                     Category
//                   </label>
//                   <select
//                     value={showCustomCategory ? 'custom' : formData.category}
//                     onChange={handleCategoryChange}
//                     className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-input"
//                   >
//                     {predefinedCategories.map((cat) => (
//                       <option key={cat} value={cat}>{cat}</option>
//                     ))}
//                     <option value="custom" className="text-primary font-semibold">
//                       ➕ Custom Category
//                     </option>
//                   </select>
//                 </div>

//                 {/* ✅ Custom Category Input */}
//                 {showCustomCategory && (
//                   <div className="md:col-span-2">
//                     <label className="block text-sm font-semibold mb-2 text-primary">
//                       Enter Custom Category
//                     </label>
//                     <input
//                       type="text"
//                       required
//                       value={customCategory}
//                       onChange={handleCustomCategoryChange}
//                       placeholder="e.g., Gift Set, Organic, Premium, etc."
//                       className="w-full px-4 py-2 border-2 border-primary/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-input"
//                     />
//                     <p className="text-xs text-muted-foreground mt-1">
//                       💡 This category will be available for this product only
//                     </p>
//                   </div>
//                 )}

//                 {/* Price */}
//                 <div>
//                   <label className="block text-sm font-semibold mb-2">Price (PKR)</label>
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
//                   <label className="block text-sm font-semibold mb-2">Discount Price (PKR) - Optional</label>
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

//               {/* Featured Toggle */}
//               <div className="flex flex-wrap items-center gap-3 p-4 bg-secondary/50 rounded-lg border border-border">
//                 <label className="flex items-center cursor-pointer">
//                   <input
//                     type="checkbox"
//                     checked={formData.isFeatured}
//                     onChange={(e) => {
//                       if (e.target.checked && featuredCount >= 4 && !editingId) {
//                         toast.error('❌ Maximum 4 products can be featured!');
//                         return;
//                       }
//                       if (e.target.checked && featuredCount >= 4 && editingId) {
//                         const currentProduct = products.find(p => p.id === editingId);
//                         if (!currentProduct?.isFeatured) {
//                           toast.error('❌ Maximum 4 products can be featured!');
//                           return;
//                         }
//                       }
//                       setFormData(prev => ({...prev, isFeatured: e.target.checked}));
//                     }}
//                     className="w-5 h-5 text-primary rounded border-border focus:ring-primary accent-primary"
//                   />
//                   <span className="ml-3 font-semibold text-sm sm:text-base">
//                     {formData.isFeatured ? '⭐ Featured Product' : '☆ Add to Featured'}
//                   </span>
//                 </label>
//                 {formData.isFeatured && (
//                   <span className="text-xs text-green-600 font-medium">
//                     ✅ Will show on home page
//                   </span>
//                 )}
//                 {!formData.isFeatured && (
//                   <span className="text-xs text-muted-foreground">
//                     (Max 4 products can be featured)
//                   </span>
//                 )}
//                 {featuredCount >= 4 && !formData.isFeatured && (
//                   <span className="text-xs text-red-500 font-medium">
//                     ⚠️ Slot full! (4/4)
//                   </span>
//                 )}
//               </div>

//               {/* Image Upload */}
//               <div>
//                 <label className="block text-sm font-semibold mb-2">Product Image (Main)</label>
//                 <div className="flex flex-wrap gap-4">
//                   <div className="flex-1 min-w-[200px]">
//                     <div className="border-2 border-dashed border-border rounded-lg p-4 sm:p-6 text-center hover:border-primary transition-colors cursor-pointer"
//                       onClick={() => document.getElementById('imageInput')?.click()}
//                     >
//                       <Upload className="mx-auto mb-2 text-muted-foreground" size={24} />
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
//                     <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg overflow-hidden border border-border flex-shrink-0">
//                       <img
//                         src={imagePreview}
//                         alt="Preview"
//                         className="w-full h-full object-contain"
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
//                 <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
//                   {[0, 1, 2].map((index) => (
//                     <div key={index} className="relative">
//                       <div className={`border-2 border-dashed border-border rounded-lg p-3 sm:p-4 text-center hover:border-primary transition-colors cursor-pointer ${
//                         additionalImagePreviews[index] ? 'border-primary' : ''
//                       }`}
//                         onClick={() => document.getElementById(`additionalImageInput${index}`)?.click()}
//                       >
//                         <Upload className="mx-auto mb-2 text-muted-foreground text-sm" size={20} />
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
//                         <div className="mt-2 relative w-full h-16 sm:h-20 rounded-lg overflow-hidden border border-border">
//                           <img
//                             src={additionalImagePreviews[index]}
//                             alt={`Preview ${index + 1}`}
//                             className="w-full h-full object-contain"
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
//               <div className="flex flex-wrap gap-3">
//                 <button
//                   type="submit"
//                   disabled={uploading}
//                   className="bg-primary text-white px-4 sm:px-6 py-2 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 text-sm sm:text-base"
//                 >
//                   {uploading ? 'Uploading...' : editingId ? 'Update Product' : 'Add Product'}
//                 </button>
//                 <button
//                   type="button"
//                   onClick={handleCancel}
//                   className="bg-secondary text-foreground px-4 sm:px-6 py-2 rounded-lg hover:bg-muted transition-colors text-sm sm:text-base"
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
//             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
//             <p className="mt-4 text-muted-foreground">Loading products...</p>
//           </div>
//         ) : products.length > 0 ? (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6"
//           >
//             {products.map((product, index) => (
//               <motion.div
//                 key={product.id}
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ delay: index * 0.1 }}
//                 className={`bg-card rounded-lg overflow-hidden border shadow-md hover:shadow-lg transition-shadow ${
//                   product.isFeatured ? 'border-primary border-2' : 'border-border'
//                 }`}
//               >
//                 {/* Product Image */}
//                 <div className="w-full aspect-square bg-secondary overflow-hidden relative flex items-center justify-center p-2">
//                   <img
//                     src={product.image}
//                     alt={product.name}
//                     className="w-full h-full object-contain"
//                     onError={(e) => {
//                       e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="300" height="300"%3E%3Crect fill="%23e8e3dc" width="300" height="300"/%3E%3C/svg%3E';
//                     }}
//                   />
//                   {product.isFeatured && (
//                     <div className="absolute top-2 left-2 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white text-xs px-2 sm:px-3 py-1 rounded-full font-semibold shadow-lg flex items-center gap-1">
//                       <Star className="w-3 h-3 fill-current" />
//                       <span className="hidden xs:inline">Featured</span>
//                     </div>
//                   )}
//                   {product.additionalImages && product.additionalImages.length > 0 && (
//                     <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
//                       +{product.additionalImages.length}
//                     </div>
//                   )}
//                 </div>

//                 {/* Product Info */}
//                 <div className="p-3 sm:p-4">
//                   <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wide truncate">
//                     {product.category}
//                   </p>
//                   <h3 className="font-semibold mb-2 line-clamp-2 text-sm sm:text-base">{product.name}</h3>
                  
//                   <div className="flex items-center gap-2 mb-2 sm:mb-3 flex-wrap">
//                     <span className="text-base sm:text-lg font-bold text-primary">
//                       PKR {Math.round(product.price - (product.discount || 0))}
//                     </span>
//                     {product.discount && product.discount > 0 && (
//                       <span className="text-xs sm:text-sm text-muted-foreground line-through">
//                         PKR {product.price}
//                       </span>
//                     )}
//                   </div>

//                   {product.description && (
//                     <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4 line-clamp-2">
//                       {product.description}
//                     </p>
//                   )}

//                   {/* Stock Badge */}
//                   <div className="mb-3 sm:mb-4">
//                     <span className={`text-xs px-2 py-1 rounded ${
//                       (product.stock || 0) > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
//                     }`}>
//                       {(product.stock || 0) > 0 ? `In Stock (${product.stock})` : 'Out of Stock'}
//                     </span>
//                   </div>

//                   {/* Action Buttons */}
//                   <div className="flex gap-2">
//                     <button
//                       onClick={() => handleEdit(product)}
//                       className="flex-1 bg-secondary hover:bg-muted text-foreground py-1.5 sm:py-2 rounded-lg font-semibold transition-colors flex items-center justify-center gap-1 sm:gap-2 text-xs sm:text-sm"
//                     >
//                       <Edit2 size={14} className="sm:w-4 sm:h-4" />
//                       <span>Edit</span>
//                     </button>
//                     <button
//                       onClick={() => handleDelete(product.id)}
//                       className="flex-1 bg-red-100 hover:bg-red-200 text-red-700 py-1.5 sm:py-2 rounded-lg font-semibold transition-colors flex items-center justify-center gap-1 sm:gap-2 text-xs sm:text-sm"
//                     >
//                       <Trash2 size={14} className="sm:w-4 sm:h-4" />
//                       <span>Delete</span>
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



//with multiple img and varient

// 'use client';

// import { useEffect, useState } from 'react';
// import { useRouter } from 'next/navigation';
// import { motion, AnimatePresence } from 'framer-motion';
// import { useAuth } from '@/lib/authContext';
// import { rtdb } from '@/lib/firebase';
// import { ref, onValue, set, remove, push } from 'firebase/database';
// import { uploadToImgBB } from '@/lib/imgbb';
// import { Upload, Trash2, Edit2, ArrowLeft, X, Star, Plus, Tags, Copy, Check, Package } from 'lucide-react';
// import Link from 'next/link';
// import toast, { Toaster } from 'react-hot-toast';

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
//   isFeatured?: boolean;
//   flavors?: Flavor[];
// }

// interface Flavor {
//   id: string;
//   name: string;
//   price: number;
//   discount?: number;
//   stock: number;
//   image?: string;
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
//   const [customCategory, setCustomCategory] = useState('');
//   const [showCustomCategory, setShowCustomCategory] = useState(false);
//   const [hasFlavors, setHasFlavors] = useState(false);

//   // ✅ Predefined Categories
//   const predefinedCategories = [
//     'Perfume',
//     'Wax',
//     'Facial Cream',
//     'Body Lotion',
//     'Soap',
//     'Scrub',
//     'Oil'
//   ];

//   const [formData, setFormData] = useState({
//     name: '',
//     price: '',
//     discount: '',
//     stock: '',
//     category: 'Perfume',
//     description: '',
//     image: '' as any,
//     additionalImages: [] as any[],
//     isFeatured: false,
//     flavors: [] as Flavor[]
//   });

//   const [additionalImagePreviews, setAdditionalImagePreviews] = useState<string[]>([]);
//   const [existingAdditionalImages, setExistingAdditionalImages] = useState<string[]>([]);
//   const [flavorPreviews, setFlavorPreviews] = useState<{ [key: string]: string }>({});

//   // Check admin access
//   useEffect(() => {
//     if (authLoading) return;
//     if (!user) {
//       router.push('/login');
//     } else if (!isAdmin) {
//       router.push('/');
//     }
//   }, [user, isAdmin, authLoading, router]);

//   // Fetch products
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

//   const featuredCount = products.filter(p => p.isFeatured === true).length;

//   // ✅ Handle Main Image
//   const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (!file) return;

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

//   // ✅ Handle Additional Images - Unlimited
//   const handleAdditionalImageChange = async (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
//     const file = e.target.files?.[0];
//     if (!file) return;

//     const reader = new FileReader();
//     reader.onloadend = () => {
//       const newPreviews = [...additionalImagePreviews];
//       newPreviews[index] = reader.result as string;
//       setAdditionalImagePreviews(newPreviews);
//     };
//     reader.readAsDataURL(file);

//     const newImages = [...formData.additionalImages];
//     newImages[index] = file;
//     setFormData(prev => ({
//       ...prev,
//       additionalImages: newImages
//     }));
//   };

//   // ✅ Add new additional image slot
//   const addAdditionalImageSlot = () => {
//     setFormData(prev => ({
//       ...prev,
//       additionalImages: [...prev.additionalImages, null]
//     }));
//     setAdditionalImagePreviews(prev => [...prev, '']);
//   };

//   // ✅ Remove additional image
//   const handleRemoveAdditionalImage = (index: number) => {
//     const newPreviews = [...additionalImagePreviews];
//     newPreviews.splice(index, 1);
//     setAdditionalImagePreviews(newPreviews);

//     const newImages = [...formData.additionalImages];
//     newImages.splice(index, 1);
//     setFormData(prev => ({
//       ...prev,
//       additionalImages: newImages
//     }));
//   };

//   // ✅ Handle Flavor Image
//   const handleFlavorImageChange = async (e: React.ChangeEvent<HTMLInputElement>, flavorIndex: number) => {
//     const file = e.target.files?.[0];
//     if (!file) return;

//     const reader = new FileReader();
//     reader.onloadend = () => {
//       setFlavorPreviews(prev => ({
//         ...prev,
//         [flavorIndex]: reader.result as string
//       }));
//     };
//     reader.readAsDataURL(file);

//     const newFlavors = [...formData.flavors];
//     newFlavors[flavorIndex] = {
//       ...newFlavors[flavorIndex],
//       image: file
//     };
//     setFormData(prev => ({
//       ...prev,
//       flavors: newFlavors
//     }));
//   };

//   // ✅ Add Flavor
//   const addFlavor = () => {
//     const newFlavor: Flavor = {
//       id: `flavor_${Date.now()}`,
//       name: '',
//       price: 0,
//       stock: 0,
//       discount: 0
//     };
//     setFormData(prev => ({
//       ...prev,
//       flavors: [...prev.flavors, newFlavor]
//     }));
//   };

//   // ✅ Remove Flavor
//   const removeFlavor = (index: number) => {
//     const newFlavors = [...formData.flavors];
//     newFlavors.splice(index, 1);
//     setFormData(prev => ({
//       ...prev,
//       flavors: newFlavors
//     }));
//   };

//   // ✅ Update Flavor
//   const updateFlavor = (index: number, field: keyof Flavor, value: any) => {
//     const newFlavors = [...formData.flavors];
//     newFlavors[index] = {
//       ...newFlavors[index],
//       [field]: value
//     };
//     setFormData(prev => ({
//       ...prev,
//       flavors: newFlavors
//     }));
//   };

//   // ✅ Handle Category Change
//   const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
//     const value = e.target.value;
//     if (value === 'custom') {
//       setShowCustomCategory(true);
//       setFormData(prev => ({ ...prev, category: '' }));
//     } else {
//       setShowCustomCategory(false);
//       setFormData(prev => ({ ...prev, category: value }));
//     }
//   };

//   const handleCustomCategoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const value = e.target.value;
//     setCustomCategory(value);
//     setFormData(prev => ({ ...prev, category: value }));
//   };

//   // ✅ Handle Submit
//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setUploading(true);

//     try {
//       let imageUrl = formData.image;

//       if (formData.image instanceof File) {
//         imageUrl = await uploadToImgBB(formData.image);
//       }

//       // ✅ Upload additional images
//       const additionalImageUrls: string[] = [];
      
//       // Keep existing images from edit mode
//       if (editingId) {
//         const existingImages = existingAdditionalImages.filter(url => url !== '');
//         additionalImageUrls.push(...existingImages);
//       }

//       // Upload new additional images
//       for (const img of formData.additionalImages) {
//         if (img instanceof File) {
//           const url = await uploadToImgBB(img);
//           additionalImageUrls.push(url);
//         } else if (typeof img === 'string' && img !== '') {
//           additionalImageUrls.push(img);
//         }
//       }

//       // ✅ Upload flavor images
//       const flavorData = await Promise.all(formData.flavors.map(async (flavor) => {
//         let flavorImageUrl = flavor.image || '';
//         if (flavor.image instanceof File) {
//           flavorImageUrl = await uploadToImgBB(flavor.image);
//         }
//         return {
//           ...flavor,
//           image: flavorImageUrl,
//           price: Number(flavor.price),
//           discount: Number(flavor.discount) || 0,
//           stock: Number(flavor.stock) || 0
//         };
//       }));

//       const productData: any = {
//         name: formData.name,
//         price: parseFloat(formData.price),
//         discount: formData.discount ? parseFloat(formData.discount) : 0,
//         stock: formData.stock ? parseInt(formData.stock) : 0,
//         category: formData.category || customCategory || 'Other',
//         description: formData.description,
//         image: imageUrl,
//         isFeatured: formData.isFeatured || false
//       };

//       if (additionalImageUrls.length > 0) {
//         productData.additionalImages = additionalImageUrls;
//       }

//       if (hasFlavors && flavorData.length > 0) {
//         productData.flavors = flavorData;
//         // Remove main stock/price if flavors exist
//         productData.hasFlavors = true;
//       } else {
//         productData.hasFlavors = false;
//       }

//       if (!editingId) {
//         productData.createdAt = new Date().toISOString();
//       }

//       if (editingId) {
//         await set(ref(rtdb, `products/${editingId}`), {
//           ...productData,
//           updatedAt: new Date().toISOString()
//         });
//         toast.success('✅ Product updated successfully!');
//       } else {
//         const newId = Date.now().toString();
//         await set(ref(rtdb, `products/${newId}`), productData);
//         toast.success('✅ Product added successfully!');
//       }

//       handleCancel();
//     } catch (error) {
//       console.error('[v0] Error saving product:', error);
//       toast.error('❌ Error saving product');
//     } finally {
//       setUploading(false);
//     }
//   };

//   const handleEdit = (product: Product) => {
//     setImagePreview(product.image);
    
//     const additionalImages = product.additionalImages || [];
//     setExistingAdditionalImages(additionalImages);
    
//     const previews = additionalImages.map(() => '');
//     setAdditionalImagePreviews(previews);

//     const isPredefined = predefinedCategories.includes(product.category);
//     if (isPredefined) {
//       setShowCustomCategory(false);
//       setCustomCategory('');
//     } else {
//       setShowCustomCategory(true);
//       setCustomCategory(product.category);
//     }

//     // ✅ Load flavors
//     const flavors = product.flavors || [];
//     setHasFlavors(flavors.length > 0);
//     setFlavorPreviews({});

//     setFormData({
//       name: product.name,
//       price: product.price.toString(),
//       discount: (product.discount || 0).toString(),
//       stock: (product.stock || 0).toString(),
//       category: product.category,
//       description: product.description || '',
//       image: product.image,
//       additionalImages: additionalImages,
//       isFeatured: product.isFeatured || false,
//       flavors: flavors
//     });
    
//     setEditingId(product.id);
//     setShowForm(true);
//   };

//   const handleDelete = async (id: string) => {
//     if (!confirm('Are you sure you want to delete this product?')) return;

//     try {
//       await remove(ref(rtdb, `products/${id}`));
//       toast.success('✅ Product deleted successfully!');
//     } catch (error) {
//       console.error('[v0] Error deleting product:', error);
//       toast.error('❌ Error deleting product');
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
//       additionalImages: [],
//       isFeatured: false,
//       flavors: []
//     });
//     setImagePreview('');
//     setAdditionalImagePreviews([]);
//     setExistingAdditionalImages([]);
//     setCustomCategory('');
//     setShowCustomCategory(false);
//     setHasFlavors(false);
//     setFlavorPreviews({});
//   };

//   // ✅ Add initial additional image slot when form opens
//   useEffect(() => {
//     if (showForm && formData.additionalImages.length === 0 && !editingId) {
//       setFormData(prev => ({
//         ...prev,
//         additionalImages: [null]
//       }));
//       setAdditionalImagePreviews(['']);
//     }
//   }, [showForm, editingId]);

//   if (authLoading) {
//     return (
//       <div className="min-h-screen bg-background flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
//           <p className="mt-4 text-muted-foreground">Loading...</p>
//         </div>
//       </div>
//     );
//   }

//   if (!user || !isAdmin) {
//     return null;
//   }

//   return (
//     <div className="min-h-screen bg-background">
//       <Toaster position="top-right" />

//       {/* Header */}
//       <div className="bg-secondary border-b border-border">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
//           <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
//             <div className="flex items-center gap-3 sm:gap-4">
//               <Link href="/admin" className="text-muted-foreground hover:text-foreground transition-colors">
//                 <ArrowLeft size={20} className="sm:w-6 sm:h-6" />
//               </Link>
//               <h1 className="text-xl sm:text-2xl md:text-3xl font-bold truncate">
//                 Product Management
//               </h1>
//             </div>
//             <div className="flex flex-wrap items-center gap-2 sm:gap-4">
//               <div className="bg-primary/10 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-sm sm:text-base whitespace-nowrap">
//                 <span className="font-semibold text-primary">
//                   ⭐ {featuredCount}/4 Featured
//                 </span>
//               </div>
//               <button
//                 onClick={() => {
//                   handleCancel();
//                   setShowForm(true);
//                 }}
//                 className="bg-primary text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg hover:opacity-90 transition-opacity text-sm sm:text-base whitespace-nowrap"
//               >
//                 + Add Product
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">

//         {/* Add/Edit Form */}
//         {showForm && (
//           <motion.div
//             initial={{ opacity: 0, y: -20 }}
//             animate={{ opacity: 1, y: 0 }}
//             className="bg-card rounded-lg p-4 sm:p-6 mb-6 sm:mb-8 border border-border shadow-lg"
//           >
//             <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">
//               {editingId ? 'Edit Product' : 'Add New Product'}
//             </h2>

//             <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
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
//                   <label className="block text-sm font-semibold mb-2 flex items-center gap-2">
//                     <Tags className="w-4 h-4" />
//                     Category
//                   </label>
//                   <select
//                     value={showCustomCategory ? 'custom' : formData.category}
//                     onChange={handleCategoryChange}
//                     className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-input"
//                   >
//                     {predefinedCategories.map((cat) => (
//                       <option key={cat} value={cat}>{cat}</option>
//                     ))}
//                     <option value="custom" className="text-primary font-semibold">
//                       ➕ Custom Category
//                     </option>
//                   </select>
//                 </div>

//                 {showCustomCategory && (
//                   <div className="md:col-span-2">
//                     <label className="block text-sm font-semibold mb-2 text-primary">
//                       Enter Custom Category
//                     </label>
//                     <input
//                       type="text"
//                       required
//                       value={customCategory}
//                       onChange={handleCustomCategoryChange}
//                       placeholder="e.g., Gift Set, Organic, Premium, etc."
//                       className="w-full px-4 py-2 border-2 border-primary/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-input"
//                     />
//                   </div>
//                 )}

//                 {/* Price */}
//                 <div>
//                   <label className="block text-sm font-semibold mb-2">Price (PKR)</label>
//                   <input
//                     type="number"
//                     required={!hasFlavors}
//                     step="0.01"
//                     value={formData.price}
//                     onChange={(e) => setFormData(prev => ({...prev, price: e.target.value}))}
//                     className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-input"
//                     placeholder="499"
//                     disabled={hasFlavors}
//                   />
//                   {hasFlavors && (
//                     <p className="text-xs text-muted-foreground mt-1">Price set per flavor below</p>
//                   )}
//                 </div>

//                 {/* Discount */}
//                 <div>
//                   <label className="block text-sm font-semibold mb-2">Discount Price (PKR) - Optional</label>
//                   <input
//                     type="number"
//                     step="0.01"
//                     value={formData.discount}
//                     onChange={(e) => setFormData(prev => ({...prev, discount: e.target.value}))}
//                     className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-input"
//                     placeholder="399"
//                     disabled={hasFlavors}
//                   />
//                 </div>

//                 {/* Stock */}
//                 <div>
//                   <label className="block text-sm font-semibold mb-2">Stock Quantity</label>
//                   <input
//                     type="number"
//                     required={!hasFlavors}
//                     min="0"
//                     value={formData.stock}
//                     onChange={(e) => setFormData(prev => ({...prev, stock: e.target.value}))}
//                     className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-input"
//                     placeholder="10"
//                     disabled={hasFlavors}
//                   />
//                 </div>
//               </div>

//               {/* ✅ Has Flavors Toggle */}
//               <div className="flex flex-wrap items-center gap-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
//                 <label className="flex items-center cursor-pointer">
//                   <input
//                     type="checkbox"
//                     checked={hasFlavors}
//                     onChange={(e) => {
//                       setHasFlavors(e.target.checked);
//                       if (!e.target.checked) {
//                         setFormData(prev => ({ ...prev, flavors: [] }));
//                       }
//                     }}
//                     className="w-5 h-5 text-blue-600 rounded border-blue-300 focus:ring-blue-500"
//                   />
//                   <span className="ml-3 font-semibold text-sm sm:text-base text-blue-700 flex items-center gap-2">
//                     <Package className="w-4 h-4" />
//                     This product has multiple flavors/variants
//                   </span>
//                 </label>
//                 {hasFlavors && (
//                   <span className="text-xs text-blue-600 font-medium">
//                     ✅ Add different flavors below
//                   </span>
//                 )}
//               </div>

//               {/* ✅ Flavors Section */}
//               {hasFlavors && (
//                 <div className="space-y-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
//                   <div className="flex items-center justify-between">
//                     <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
//                       <Package className="w-5 h-5 text-primary" />
//                       Flavors / Variants
//                     </h3>
//                     <button
//                       type="button"
//                       onClick={addFlavor}
//                       className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-semibold"
//                     >
//                       <Plus className="w-4 h-4" />
//                       Add Flavor
//                     </button>
//                   </div>

//                   <AnimatePresence>
//                     {formData.flavors.map((flavor, index) => (
//                       <motion.div
//                         key={flavor.id}
//                         initial={{ opacity: 0, y: -10 }}
//                         animate={{ opacity: 1, y: 0 }}
//                         exit={{ opacity: 0, y: -10 }}
//                         className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm"
//                       >
//                         <div className="flex justify-between items-start mb-3">
//                           <h4 className="font-semibold text-gray-700">Flavor #{index + 1}</h4>
//                           <button
//                             type="button"
//                             onClick={() => removeFlavor(index)}
//                             className="text-red-500 hover:text-red-700 transition-colors"
//                           >
//                             <Trash2 className="w-4 h-4" />
//                           </button>
//                         </div>

//                         <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
//                           <div>
//                             <label className="block text-xs font-semibold mb-1">Flavor Name</label>
//                             <input
//                               type="text"
//                               required
//                               value={flavor.name}
//                               onChange={(e) => updateFlavor(index, 'name', e.target.value)}
//                               className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
//                               placeholder="e.g., Rose, Jasmine, Vanilla"
//                             />
//                           </div>
//                           <div>
//                             <label className="block text-xs font-semibold mb-1">Price (PKR)</label>
//                             <input
//                               type="number"
//                               required
//                               step="0.01"
//                               value={flavor.price || ''}
//                               onChange={(e) => updateFlavor(index, 'price', parseFloat(e.target.value) || 0)}
//                               className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
//                               placeholder="599"
//                             />
//                           </div>
//                           <div>
//                             <label className="block text-xs font-semibold mb-1">Discount (PKR) - Optional</label>
//                             <input
//                               type="number"
//                               step="0.01"
//                               value={flavor.discount || ''}
//                               onChange={(e) => updateFlavor(index, 'discount', parseFloat(e.target.value) || 0)}
//                               className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
//                               placeholder="499"
//                             />
//                           </div>
//                           <div>
//                             <label className="block text-xs font-semibold mb-1">Stock</label>
//                             <input
//                               type="number"
//                               required
//                               min="0"
//                               value={flavor.stock || ''}
//                               onChange={(e) => updateFlavor(index, 'stock', parseInt(e.target.value) || 0)}
//                               className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
//                               placeholder="10"
//                             />
//                           </div>
//                           <div className="sm:col-span-2">
//                             <label className="block text-xs font-semibold mb-1">Flavor Image (Optional)</label>
//                             <div className="flex items-center gap-3">
//                               <div className="flex-1">
//                                 <div className="border-2 border-dashed border-gray-300 rounded-lg p-2 text-center hover:border-primary transition-colors cursor-pointer"
//                                   onClick={() => document.getElementById(`flavorImageInput${index}`)?.click()}
//                                 >
//                                   <Upload className="mx-auto mb-1 text-muted-foreground" size={16} />
//                                   <p className="text-xs text-muted-foreground">Upload image</p>
//                                 </div>
//                                 <input
//                                   id={`flavorImageInput${index}`}
//                                   type="file"
//                                   accept="image/*"
//                                   onChange={(e) => handleFlavorImageChange(e, index)}
//                                   className="hidden"
//                                 />
//                               </div>
//                               {flavorPreviews[index] && (
//                                 <div className="w-12 h-12 rounded-lg overflow-hidden border border-gray-200 flex-shrink-0">
//                                   <img
//                                     src={flavorPreviews[index]}
//                                     alt="Flavor preview"
//                                     className="w-full h-full object-cover"
//                                   />
//                                 </div>
//                               )}
//                             </div>
//                           </div>
//                         </div>
//                       </motion.div>
//                     ))}
//                   </AnimatePresence>

//                   {formData.flavors.length === 0 && (
//                     <p className="text-center text-gray-500 py-4">No flavors added yet. Click "Add Flavor" to add one.</p>
//                   )}
//                 </div>
//               )}

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

//               {/* Featured Toggle */}
//               <div className="flex flex-wrap items-center gap-3 p-4 bg-secondary/50 rounded-lg border border-border">
//                 <label className="flex items-center cursor-pointer">
//                   <input
//                     type="checkbox"
//                     checked={formData.isFeatured}
//                     onChange={(e) => {
//                       if (e.target.checked && featuredCount >= 4 && !editingId) {
//                         toast.error('❌ Maximum 4 products can be featured!');
//                         return;
//                       }
//                       if (e.target.checked && featuredCount >= 4 && editingId) {
//                         const currentProduct = products.find(p => p.id === editingId);
//                         if (!currentProduct?.isFeatured) {
//                           toast.error('❌ Maximum 4 products can be featured!');
//                           return;
//                         }
//                       }
//                       setFormData(prev => ({...prev, isFeatured: e.target.checked}));
//                     }}
//                     className="w-5 h-5 text-primary rounded border-border focus:ring-primary accent-primary"
//                   />
//                   <span className="ml-3 font-semibold text-sm sm:text-base">
//                     {formData.isFeatured ? '⭐ Featured Product' : '☆ Add to Featured'}
//                   </span>
//                 </label>
//                 {formData.isFeatured && (
//                   <span className="text-xs text-green-600 font-medium">
//                     ✅ Will show on home page
//                   </span>
//                 )}
//                 {!formData.isFeatured && (
//                   <span className="text-xs text-muted-foreground">
//                     (Max 4 products can be featured)
//                   </span>
//                 )}
//                 {featuredCount >= 4 && !formData.isFeatured && (
//                   <span className="text-xs text-red-500 font-medium">
//                     ⚠️ Slot full! (4/4)
//                   </span>
//                 )}
//               </div>

//               {/* Image Upload */}
//               <div>
//                 <label className="block text-sm font-semibold mb-2">Product Image (Main)</label>
//                 <div className="flex flex-wrap gap-4">
//                   <div className="flex-1 min-w-[200px]">
//                     <div className="border-2 border-dashed border-border rounded-lg p-4 sm:p-6 text-center hover:border-primary transition-colors cursor-pointer"
//                       onClick={() => document.getElementById('imageInput')?.click()}
//                     >
//                       <Upload className="mx-auto mb-2 text-muted-foreground" size={24} />
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

//                   {imagePreview && (
//                     <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg overflow-hidden border border-border flex-shrink-0">
//                       <img
//                         src={imagePreview}
//                         alt="Preview"
//                         className="w-full h-full object-contain"
//                       />
//                     </div>
//                   )}
//                 </div>
//               </div>

//               {/* ✅ Additional Images - Unlimited */}
//               <div>
//                 <div className="flex items-center justify-between mb-3">
//                   <label className="block text-sm font-semibold text-primary">Additional Images</label>
//                   <button
//                     type="button"
//                     onClick={addAdditionalImageSlot}
//                     className="flex items-center gap-1 text-xs bg-primary text-white px-3 py-1.5 rounded-lg hover:opacity-90 transition-opacity"
//                   >
//                     <Plus className="w-3 h-3" />
//                     Add Image
//                   </button>
//                 </div>
//                 <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
//                   {formData.additionalImages.map((img, index) => (
//                     <div key={index} className="relative">
//                       <div className={`border-2 border-dashed border-border rounded-lg p-3 text-center hover:border-primary transition-colors cursor-pointer ${
//                         additionalImagePreviews[index] || existingAdditionalImages[index] ? 'border-primary' : ''
//                       }`}
//                         onClick={() => document.getElementById(`additionalImageInput${index}`)?.click()}
//                       >
//                         <Upload className="mx-auto mb-1 text-muted-foreground" size={16} />
//                         <p className="text-xs text-muted-foreground">Image {index + 1}</p>
//                       </div>
//                       <input
//                         id={`additionalImageInput${index}`}
//                         type="file"
//                         accept="image/*"
//                         onChange={(e) => handleAdditionalImageChange(e, index)}
//                         className="hidden"
//                       />

//                       {(additionalImagePreviews[index] || existingAdditionalImages[index]) && (
//                         <div className="mt-1 relative w-full h-16 rounded-lg overflow-hidden border border-border">
//                           <img
//                             src={additionalImagePreviews[index] || existingAdditionalImages[index]}
//                             alt={`Preview ${index + 1}`}
//                             className="w-full h-full object-contain"
//                           />
//                           <button
//                             type="button"
//                             onClick={() => handleRemoveAdditionalImage(index)}
//                             className="absolute top-0.5 right-0.5 bg-red-500 text-white rounded-full p-0.5 hover:bg-red-600 transition-colors"
//                           >
//                             <X size={12} />
//                           </button>
//                         </div>
//                       )}
//                     </div>
//                   ))}
//                 </div>
//                 <p className="text-xs text-muted-foreground mt-2">
//                   💡 Click "Add Image" to add more images (unlimited)
//                 </p>
//               </div>

//               {/* Form Actions */}
//               <div className="flex flex-wrap gap-3">
//                 <button
//                   type="submit"
//                   disabled={uploading}
//                   className="bg-primary text-white px-4 sm:px-6 py-2 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 text-sm sm:text-base"
//                 >
//                   {uploading ? 'Uploading...' : editingId ? 'Update Product' : 'Add Product'}
//                 </button>
//                 <button
//                   type="button"
//                   onClick={handleCancel}
//                   className="bg-secondary text-foreground px-4 sm:px-6 py-2 rounded-lg hover:bg-muted transition-colors text-sm sm:text-base"
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
//             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
//             <p className="mt-4 text-muted-foreground">Loading products...</p>
//           </div>
//         ) : products.length > 0 ? (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6"
//           >
//             {products.map((product, index) => (
//               <motion.div
//                 key={product.id}
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ delay: index * 0.1 }}
//                 className={`bg-card rounded-lg overflow-hidden border shadow-md hover:shadow-lg transition-shadow ${
//                   product.isFeatured ? 'border-primary border-2' : 'border-border'
//                 }`}
//               >
//                 <div className="w-full aspect-square bg-secondary overflow-hidden relative flex items-center justify-center p-2">
//                   <img
//                     src={product.image}
//                     alt={product.name}
//                     className="w-full h-full object-contain"
//                     onError={(e) => {
//                       e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="300" height="300"%3E%3Crect fill="%23e8e3dc" width="300" height="300"/%3E%3C/svg%3E';
//                     }}
//                   />
//                   {product.isFeatured && (
//                     <div className="absolute top-2 left-2 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white text-xs px-2 sm:px-3 py-1 rounded-full font-semibold shadow-lg flex items-center gap-1">
//                       <Star className="w-3 h-3 fill-current" />
//                       <span className="hidden xs:inline">Featured</span>
//                     </div>
//                   )}
//                   {product.additionalImages && product.additionalImages.length > 0 && (
//                     <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
//                       +{product.additionalImages.length}
//                     </div>
//                   )}
//                   {product.hasFlavors && product.flavors && product.flavors.length > 0 && (
//                     <div className="absolute bottom-2 left-2 bg-blue-500/80 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
//                       <Package className="w-3 h-3" />
//                       {product.flavors.length} Flavors
//                     </div>
//                   )}
//                 </div>

//                 <div className="p-3 sm:p-4">
//                   <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wide truncate">
//                     {product.category}
//                   </p>
//                   <h3 className="font-semibold mb-2 line-clamp-2 text-sm sm:text-base">{product.name}</h3>
                  
//                   <div className="flex items-center gap-2 mb-2 sm:mb-3 flex-wrap">
//                     {product.hasFlavors && product.flavors ? (
//                       <span className="text-xs text-blue-600 font-medium">
//                         {product.flavors.length} flavors available
//                       </span>
//                     ) : (
//                       <>
//                         <span className="text-base sm:text-lg font-bold text-primary">
//                           PKR {Math.round(product.price - (product.discount || 0))}
//                         </span>
//                         {product.discount && product.discount > 0 && (
//                           <span className="text-xs sm:text-sm text-muted-foreground line-through">
//                             PKR {product.price}
//                           </span>
//                         )}
//                       </>
//                     )}
//                   </div>

//                   {product.description && (
//                     <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4 line-clamp-2">
//                       {product.description}
//                     </p>
//                   )}

//                   <div className="mb-3 sm:mb-4">
//                     {product.hasFlavors && product.flavors ? (
//                       <span className="text-xs px-2 py-1 rounded bg-blue-100 text-blue-700">
//                         Multiple Variants
//                       </span>
//                     ) : (
//                       <span className={`text-xs px-2 py-1 rounded ${
//                         (product.stock || 0) > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
//                       }`}>
//                         {(product.stock || 0) > 0 ? `In Stock (${product.stock})` : 'Out of Stock'}
//                       </span>
//                     )}
//                   </div>

//                   <div className="flex gap-2">
//                     <button
//                       onClick={() => handleEdit(product)}
//                       className="flex-1 bg-secondary hover:bg-muted text-foreground py-1.5 sm:py-2 rounded-lg font-semibold transition-colors flex items-center justify-center gap-1 sm:gap-2 text-xs sm:text-sm"
//                     >
//                       <Edit2 size={14} className="sm:w-4 sm:h-4" />
//                       <span>Edit</span>
//                     </button>
//                     <button
//                       onClick={() => handleDelete(product.id)}
//                       className="flex-1 bg-red-100 hover:bg-red-200 text-red-700 py-1.5 sm:py-2 rounded-lg font-semibold transition-colors flex items-center justify-center gap-1 sm:gap-2 text-xs sm:text-sm"
//                     >
//                       <Trash2 size={14} className="sm:w-4 sm:h-4" />
//                       <span>Delete</span>
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
// import { motion, AnimatePresence } from 'framer-motion';
// import { useAuth } from '@/lib/authContext';
// import { rtdb } from '@/lib/firebase';
// import { ref, onValue, set, remove } from 'firebase/database';
// import { uploadToImgBB } from '@/lib/imgbb';
// import { Upload, Trash2, Edit2, ArrowLeft, X, Star, Plus, Tags, Package } from 'lucide-react';
// import Link from 'next/link';
// import toast, { Toaster } from 'react-hot-toast';

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
//   isFeatured?: boolean;
//   hasFlavors?: boolean;
//   flavors?: string[];
//   createdAt?: string;
//   updatedAt?: string;
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
//   const [customCategory, setCustomCategory] = useState('');
//   const [showCustomCategory, setShowCustomCategory] = useState(false);
//   const [hasFlavors, setHasFlavors] = useState(false);

//   const predefinedCategories = [
//     'Perfume',
//     'Wax',
//     'Facial Cream',
//     'Body Lotion',
//     'Soap',
//     'Scrub',
//     'Oil'
//   ];

//   const [formData, setFormData] = useState({
//     name: '',
//     price: '',
//     discount: '',
//     stock: '',
//     category: 'Perfume',
//     description: '',
//     image: '' as any,
//     additionalImages: [] as any[],
//     isFeatured: false,
//     flavors: [] as string[]
//   });

//   const [additionalImagePreviews, setAdditionalImagePreviews] = useState<string[]>([]);
//   const [existingAdditionalImages, setExistingAdditionalImages] = useState<string[]>([]);

//   // ✅ Check admin access
//   useEffect(() => {
//     if (authLoading) return;
//     if (!user) {
//       router.push('/login');
//     } else if (!isAdmin) {
//       router.push('/');
//     }
//   }, [user, isAdmin, authLoading, router]);

//   // ✅ Fetch products
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

//   const featuredCount = products.filter(p => p.isFeatured === true).length;

//   // ✅ Handle Main Image
//   const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (!file) return;

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

//   // ✅ Handle Additional Images
//   const handleAdditionalImageChange = async (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
//     const file = e.target.files?.[0];
//     if (!file) return;

//     const reader = new FileReader();
//     reader.onloadend = () => {
//       const newPreviews = [...additionalImagePreviews];
//       newPreviews[index] = reader.result as string;
//       setAdditionalImagePreviews(newPreviews);
//     };
//     reader.readAsDataURL(file);

//     const newImages = [...formData.additionalImages];
//     newImages[index] = file;
//     setFormData(prev => ({
//       ...prev,
//       additionalImages: newImages
//     }));
//   };

//   const addAdditionalImageSlot = () => {
//     setFormData(prev => ({
//       ...prev,
//       additionalImages: [...prev.additionalImages, null]
//     }));
//     setAdditionalImagePreviews(prev => [...prev, '']);
//   };

//   const handleRemoveAdditionalImage = (index: number) => {
//     const newPreviews = [...additionalImagePreviews];
//     newPreviews.splice(index, 1);
//     setAdditionalImagePreviews(newPreviews);

//     const newImages = [...formData.additionalImages];
//     newImages.splice(index, 1);
//     setFormData(prev => ({
//       ...prev,
//       additionalImages: newImages
//     }));
//   };

//   // ✅ Add Flavor (only name)
//   const addFlavor = () => {
//     setFormData(prev => ({
//       ...prev,
//       flavors: [...prev.flavors, '']
//     }));
//   };

//   const removeFlavor = (index: number) => {
//     const newFlavors = [...formData.flavors];
//     newFlavors.splice(index, 1);
//     setFormData(prev => ({
//       ...prev,
//       flavors: newFlavors
//     }));
//   };

//   const updateFlavor = (index: number, value: string) => {
//     const newFlavors = [...formData.flavors];
//     newFlavors[index] = value;
//     setFormData(prev => ({
//       ...prev,
//       flavors: newFlavors
//     }));
//   };

//   // ✅ Handle Category Change
//   const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
//     const value = e.target.value;
//     if (value === 'custom') {
//       setShowCustomCategory(true);
//       setFormData(prev => ({ ...prev, category: '' }));
//     } else {
//       setShowCustomCategory(false);
//       setFormData(prev => ({ ...prev, category: value }));
//     }
//   };

//   const handleCustomCategoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const value = e.target.value;
//     setCustomCategory(value);
//     setFormData(prev => ({ ...prev, category: value }));
//   };

//   // ✅ Handle Submit
//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setUploading(true);

//     try {
//       let imageUrl = '';
//       if (formData.image instanceof File) {
//         imageUrl = await uploadToImgBB(formData.image);
//       } else if (typeof formData.image === 'string' && formData.image) {
//         imageUrl = formData.image;
//       }

//       // ✅ Upload additional images
//       const additionalImageUrls: string[] = [];
      
//       if (editingId) {
//         const existingImages = existingAdditionalImages.filter(url => url !== '');
//         additionalImageUrls.push(...existingImages);
//       }

//       for (const img of formData.additionalImages) {
//         if (img instanceof File) {
//           const url = await uploadToImgBB(img);
//           additionalImageUrls.push(url);
//         } else if (typeof img === 'string' && img) {
//           additionalImageUrls.push(img);
//         }
//       }

//       // ✅ Filter empty flavor names
//       const flavorNames = formData.flavors.filter(f => f.trim() !== '');

//       const productData: any = {
//         name: formData.name,
//         price: Number(formData.price),
//         discount: Number(formData.discount) || 0,
//         stock: Number(formData.stock) || 0,
//         category: formData.category || customCategory || 'Other',
//         description: formData.description,
//         isFeatured: formData.isFeatured || false,
//         hasFlavors: hasFlavors && flavorNames.length > 0,
//         image: imageUrl,
//       };

//       if (additionalImageUrls.length > 0) {
//         productData.additionalImages = additionalImageUrls;
//       }

//       if (hasFlavors && flavorNames.length > 0) {
//         productData.flavors = flavorNames;
//       }

//       if (!editingId) {
//         productData.createdAt = new Date().toISOString();
//       }

//       if (editingId) {
//         await set(ref(rtdb, `products/${editingId}`), {
//           ...productData,
//           updatedAt: new Date().toISOString()
//         });
//         toast.success('✅ Product updated successfully!');
//       } else {
//         const newId = Date.now().toString();
//         await set(ref(rtdb, `products/${newId}`), productData);
//         toast.success('✅ Product added successfully!');
//       }

//       handleCancel();
//     } catch (error) {
//       console.error('[v0] Error saving product:', error);
//       toast.error('❌ Error saving product');
//     } finally {
//       setUploading(false);
//     }
//   };

//   const handleEdit = (product: Product) => {
//     setHasFlavors(product.hasFlavors || false);
//     setImagePreview(product.image || '');

//     const additionalImages = product.additionalImages || [];
//     setExistingAdditionalImages(additionalImages);
//     setAdditionalImagePreviews(additionalImages.map(() => ''));

//     setFormData({
//       name: product.name,
//       price: product.price?.toString() || '',
//       discount: (product.discount || 0).toString(),
//       stock: (product.stock || 0).toString(),
//       category: product.category,
//       description: product.description || '',
//       image: product.image || '',
//       additionalImages: additionalImages,
//       isFeatured: product.isFeatured || false,
//       flavors: product.flavors || []
//     });

//     const isPredefined = predefinedCategories.includes(product.category);
//     if (isPredefined) {
//       setShowCustomCategory(false);
//       setCustomCategory('');
//     } else {
//       setShowCustomCategory(true);
//       setCustomCategory(product.category);
//     }

//     setEditingId(product.id);
//     setShowForm(true);
//   };

//   const handleDelete = async (id: string) => {
//     if (!confirm('Are you sure you want to delete this product?')) return;

//     try {
//       await remove(ref(rtdb, `products/${id}`));
//       toast.success('✅ Product deleted successfully!');
//     } catch (error) {
//       console.error('[v0] Error deleting product:', error);
//       toast.error('❌ Error deleting product');
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
//       additionalImages: [],
//       isFeatured: false,
//       flavors: []
//     });
//     setImagePreview('');
//     setAdditionalImagePreviews([]);
//     setExistingAdditionalImages([]);
//     setCustomCategory('');
//     setShowCustomCategory(false);
//     setHasFlavors(false);
//   };

//   useEffect(() => {
//     if (showForm && formData.additionalImages.length === 0 && !editingId) {
//       setFormData(prev => ({
//         ...prev,
//         additionalImages: [null]
//       }));
//       setAdditionalImagePreviews(['']);
//     }
//   }, [showForm, editingId]);

//   if (authLoading) {
//     return (
//       <div className="min-h-screen bg-background flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
//           <p className="mt-4 text-muted-foreground">Loading...</p>
//         </div>
//       </div>
//     );
//   }

//   if (!user || !isAdmin) {
//     return null;
//   }

//   return (
//     <div className="min-h-screen bg-background">
//       <Toaster position="top-right" />

//       {/* Header */}
//       <div className="bg-secondary border-b border-border">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
//           <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
//             <div className="flex items-center gap-3 sm:gap-4">
//               <Link href="/admin" className="text-muted-foreground hover:text-foreground transition-colors">
//                 <ArrowLeft size={20} className="sm:w-6 sm:h-6" />
//               </Link>
//               <h1 className="text-xl sm:text-2xl md:text-3xl font-bold truncate">
//                 Product Management
//               </h1>
//             </div>
//             <div className="flex flex-wrap items-center gap-2 sm:gap-4">
//               <div className="bg-primary/10 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-sm sm:text-base whitespace-nowrap">
//                 <span className="font-semibold text-primary">
//                   ⭐ {featuredCount}/4 Featured
//                 </span>
//               </div>
//               <button
//                 onClick={() => {
//                   handleCancel();
//                   setShowForm(true);
//                 }}
//                 className="bg-primary text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg hover:opacity-90 transition-opacity text-sm sm:text-base whitespace-nowrap"
//               >
//                 + Add Product
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">

//         {/* Add/Edit Form */}
//         {showForm && (
//           <motion.div
//             initial={{ opacity: 0, y: -20 }}
//             animate={{ opacity: 1, y: 0 }}
//             className="bg-card rounded-lg p-4 sm:p-6 mb-6 sm:mb-8 border border-border shadow-lg"
//           >
//             <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">
//               {editingId ? 'Edit Product' : 'Add New Product'}
//             </h2>

//             <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
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
//                   <label className="block text-sm font-semibold mb-2 flex items-center gap-2">
//                     <Tags className="w-4 h-4" />
//                     Category
//                   </label>
//                   <select
//                     value={showCustomCategory ? 'custom' : formData.category}
//                     onChange={handleCategoryChange}
//                     className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-input"
//                   >
//                     {predefinedCategories.map((cat) => (
//                       <option key={cat} value={cat}>{cat}</option>
//                     ))}
//                     <option value="custom" className="text-primary font-semibold">
//                       ➕ Custom Category
//                     </option>
//                   </select>
//                 </div>

//                 {showCustomCategory && (
//                   <div className="md:col-span-2">
//                     <label className="block text-sm font-semibold mb-2 text-primary">
//                       Enter Custom Category
//                     </label>
//                     <input
//                       type="text"
//                       required
//                       value={customCategory}
//                       onChange={handleCustomCategoryChange}
//                       placeholder="e.g., Gift Set, Organic, Premium, etc."
//                       className="w-full px-4 py-2 border-2 border-primary/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-input"
//                     />
//                   </div>
//                 )}

//                 {/* Price - Always shown */}
//                 <div>
//                   <label className="block text-sm font-semibold mb-2">Price (PKR)</label>
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

//                 {/* Discount - Always shown */}
//                 <div>
//                   <label className="block text-sm font-semibold mb-2">Discount Price (PKR) - Optional</label>
//                   <input
//                     type="number"
//                     step="0.01"
//                     value={formData.discount}
//                     onChange={(e) => setFormData(prev => ({...prev, discount: e.target.value}))}
//                     className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-input"
//                     placeholder="399"
//                   />
//                 </div>

//                 {/* Stock - Always shown */}
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

//               {/* Has Flavors Toggle */}
//               <div className="flex flex-wrap items-center gap-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
//                 <label className="flex items-center cursor-pointer">
//                   <input
//                     type="checkbox"
//                     checked={hasFlavors}
//                     onChange={(e) => {
//                       setHasFlavors(e.target.checked);
//                       if (!e.target.checked) {
//                         setFormData(prev => ({ ...prev, flavors: [] }));
//                       }
//                     }}
//                     className="w-5 h-5 text-blue-600 rounded border-blue-300 focus:ring-blue-500"
//                   />
//                   <span className="ml-3 font-semibold text-sm sm:text-base text-blue-700 flex items-center gap-2">
//                     <Package className="w-4 h-4" />
//                     This product has multiple flavors/variants
//                   </span>
//                 </label>
//                 {hasFlavors && (
//                   <span className="text-xs text-blue-600 font-medium">
//                     ✅ Add flavor names below (price/stock shared)
//                   </span>
//                 )}
//               </div>

//               {/* Flavors Section - Only Name */}
//               {hasFlavors && (
//                 <div className="space-y-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
//                   <div className="flex items-center justify-between">
//                     <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
//                       <Package className="w-5 h-5 text-primary" />
//                       Flavors / Variants
//                     </h3>
//                     <button
//                       type="button"
//                       onClick={addFlavor}
//                       className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-semibold"
//                     >
//                       <Plus className="w-4 h-4" />
//                       Add Flavor
//                     </button>
//                   </div>

//                   <p className="text-xs text-muted-foreground">
//                     Enter flavor names (e.g., Rose, Jasmine, Vanilla). Price, discount, and stock are shared across all flavors.
//                   </p>

//                   <AnimatePresence>
//                     {formData.flavors.map((flavor, index) => (
//                       <motion.div
//                         key={index}
//                         initial={{ opacity: 0, y: -10 }}
//                         animate={{ opacity: 1, y: 0 }}
//                         exit={{ opacity: 0, y: -10 }}
//                         className="flex items-center gap-3 bg-white p-3 rounded-lg border border-gray-200 shadow-sm"
//                       >
//                         <span className="text-sm font-semibold text-gray-500 w-8">#{index + 1}</span>
//                         <input
//                           type="text"
//                           value={flavor}
//                           onChange={(e) => updateFlavor(index, e.target.value)}
//                           placeholder="Enter flavor name..."
//                           className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
//                         />
//                         <button
//                           type="button"
//                           onClick={() => removeFlavor(index)}
//                           className="text-red-500 hover:text-red-700 transition-colors p-1"
//                         >
//                           <Trash2 className="w-4 h-4" />
//                         </button>
//                       </motion.div>
//                     ))}
//                   </AnimatePresence>

//                   {formData.flavors.length === 0 && (
//                     <p className="text-center text-gray-500 py-4">No flavors added yet. Click "Add Flavor" to add one.</p>
//                   )}
//                 </div>
//               )}

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

//               {/* Featured Toggle */}
//               <div className="flex flex-wrap items-center gap-3 p-4 bg-secondary/50 rounded-lg border border-border">
//                 <label className="flex items-center cursor-pointer">
//                   <input
//                     type="checkbox"
//                     checked={formData.isFeatured}
//                     onChange={(e) => {
//                       if (e.target.checked && featuredCount >= 4 && !editingId) {
//                         toast.error('❌ Maximum 4 products can be featured!');
//                         return;
//                       }
//                       if (e.target.checked && featuredCount >= 4 && editingId) {
//                         const currentProduct = products.find(p => p.id === editingId);
//                         if (!currentProduct?.isFeatured) {
//                           toast.error('❌ Maximum 4 products can be featured!');
//                           return;
//                         }
//                       }
//                       setFormData(prev => ({...prev, isFeatured: e.target.checked}));
//                     }}
//                     className="w-5 h-5 text-primary rounded border-border focus:ring-primary accent-primary"
//                   />
//                   <span className="ml-3 font-semibold text-sm sm:text-base">
//                     {formData.isFeatured ? '⭐ Featured Product' : '☆ Add to Featured'}
//                   </span>
//                 </label>
//                 {formData.isFeatured && (
//                   <span className="text-xs text-green-600 font-medium">
//                     ✅ Will show on home page
//                   </span>
//                 )}
//                 {!formData.isFeatured && (
//                   <span className="text-xs text-muted-foreground">
//                     (Max 4 products can be featured)
//                   </span>
//                 )}
//                 {featuredCount >= 4 && !formData.isFeatured && (
//                   <span className="text-xs text-red-500 font-medium">
//                     ⚠️ Slot full! (4/4)
//                   </span>
//                 )}
//               </div>

//               {/* Main Image */}
//               <div>
//                 <label className="block text-sm font-semibold mb-2">Main Product Image</label>
//                 <div className="flex flex-wrap gap-4">
//                   <div className="flex-1 min-w-[200px]">
//                     <div className="border-2 border-dashed border-border rounded-lg p-4 sm:p-6 text-center hover:border-primary transition-colors cursor-pointer"
//                       onClick={() => document.getElementById('imageInput')?.click()}
//                     >
//                       <Upload className="mx-auto mb-2 text-muted-foreground" size={24} />
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

//                   {imagePreview && (
//                     <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg overflow-hidden border border-border flex-shrink-0">
//                       <img
//                         src={imagePreview}
//                         alt="Preview"
//                         className="w-full h-full object-contain"
//                       />
//                     </div>
//                   )}
//                 </div>
//               </div>

//               {/* Additional Images */}
//               <div>
//                 <div className="flex items-center justify-between mb-3">
//                   <label className="block text-sm font-semibold text-primary">Additional Images</label>
//                   <button
//                     type="button"
//                     onClick={addAdditionalImageSlot}
//                     className="flex items-center gap-1 text-xs bg-primary text-white px-3 py-1.5 rounded-lg hover:opacity-90 transition-opacity"
//                   >
//                     <Plus className="w-3 h-3" />
//                     Add Image
//                   </button>
//                 </div>
//                 <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
//                   {formData.additionalImages.map((img, index) => (
//                     <div key={index} className="relative">
//                       <div className={`border-2 border-dashed border-border rounded-lg p-3 text-center hover:border-primary transition-colors cursor-pointer ${
//                         additionalImagePreviews[index] || existingAdditionalImages[index] ? 'border-primary' : ''
//                       }`}
//                         onClick={() => document.getElementById(`additionalImageInput${index}`)?.click()}
//                       >
//                         <Upload className="mx-auto mb-1 text-muted-foreground" size={16} />
//                         <p className="text-xs text-muted-foreground">Image {index + 1}</p>
//                       </div>
//                       <input
//                         id={`additionalImageInput${index}`}
//                         type="file"
//                         accept="image/*"
//                         onChange={(e) => handleAdditionalImageChange(e, index)}
//                         className="hidden"
//                       />

//                       {(additionalImagePreviews[index] || existingAdditionalImages[index]) && (
//                         <div className="mt-1 relative w-full h-16 rounded-lg overflow-hidden border border-border">
//                           <img
//                             src={additionalImagePreviews[index] || existingAdditionalImages[index]}
//                             alt={`Preview ${index + 1}`}
//                             className="w-full h-full object-contain"
//                           />
//                           <button
//                             type="button"
//                             onClick={() => handleRemoveAdditionalImage(index)}
//                             className="absolute top-0.5 right-0.5 bg-red-500 text-white rounded-full p-0.5 hover:bg-red-600 transition-colors"
//                           >
//                             <X size={12} />
//                           </button>
//                         </div>
//                       )}
//                     </div>
//                   ))}
//                 </div>
//                 <p className="text-xs text-muted-foreground mt-2">
//                   💡 Click "Add Image" to add more images (unlimited)
//                 </p>
//               </div>

//               {/* Form Actions */}
//               <div className="flex flex-wrap gap-3">
//                 <button
//                   type="submit"
//                   disabled={uploading}
//                   className="bg-primary text-white px-4 sm:px-6 py-2 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 text-sm sm:text-base"
//                 >
//                   {uploading ? 'Uploading...' : editingId ? 'Update Product' : 'Add Product'}
//                 </button>
//                 <button
//                   type="button"
//                   onClick={handleCancel}
//                   className="bg-secondary text-foreground px-4 sm:px-6 py-2 rounded-lg hover:bg-muted transition-colors text-sm sm:text-base"
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
//             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
//             <p className="mt-4 text-muted-foreground">Loading products...</p>
//           </div>
//         ) : products.length > 0 ? (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6"
//           >
//             {products.map((product, index) => (
//               <motion.div
//                 key={product.id}
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ delay: index * 0.1 }}
//                 className={`bg-card rounded-lg overflow-hidden border shadow-md hover:shadow-lg transition-shadow ${
//                   product.isFeatured ? 'border-primary border-2' : 'border-border'
//                 }`}
//               >
//                 {/* Product Image */}
//                 <div className="w-full aspect-square bg-secondary overflow-hidden relative flex items-center justify-center p-2">
//                   <img
//                     src={product.image || ''}
//                     alt={product.name}
//                     className="w-full h-full object-contain"
//                     onError={(e) => {
//                       e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="300" height="300"%3E%3Crect fill="%23e8e3dc" width="300" height="300"/%3E%3C/svg%3E';
//                     }}
//                   />
//                   {product.isFeatured && (
//                     <div className="absolute top-2 left-2 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white text-xs px-2 sm:px-3 py-1 rounded-full font-semibold shadow-lg flex items-center gap-1">
//                       <Star className="w-3 h-3 fill-current" />
//                       <span className="hidden xs:inline">Featured</span>
//                     </div>
//                   )}
//                   {product.hasFlavors && product.flavors && product.flavors.length > 0 && (
//                     <div className="absolute bottom-2 left-2 bg-blue-500/80 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
//                       <Package className="w-3 h-3" />
//                       {product.flavors.length} Flavors
//                     </div>
//                   )}
//                   {product.additionalImages && product.additionalImages.length > 0 && (
//                     <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
//                       +{product.additionalImages.length}
//                     </div>
//                   )}
//                 </div>

//                 {/* Product Info */}
//                 <div className="p-3 sm:p-4">
//                   <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wide truncate">
//                     {product.category}
//                   </p>
//                   <h3 className="font-semibold mb-2 line-clamp-2 text-sm sm:text-base">{product.name}</h3>
                  
//                   <div className="flex items-center gap-2 mb-2 sm:mb-3 flex-wrap">
//                     <span className="text-base sm:text-lg font-bold text-primary">
//                       PKR {Math.round((product.price || 0) - (product.discount || 0))}
//                     </span>
//                     {product.discount && product.discount > 0 && (
//                       <span className="text-xs sm:text-sm text-muted-foreground line-through">
//                         PKR {product.price}
//                       </span>
//                     )}
//                     {product.hasFlavors && product.flavors && (
//                       <span className="text-xs text-blue-600 font-medium ml-2">
//                         {product.flavors.length} flavors
//                       </span>
//                     )}
//                   </div>

//                   {product.description && (
//                     <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4 line-clamp-2">
//                       {product.description}
//                     </p>
//                   )}

//                   <div className="mb-3 sm:mb-4">
//                     <span className={`text-xs px-2 py-1 rounded ${
//                       (product.stock || 0) > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
//                     }`}>
//                       {(product.stock || 0) > 0 ? `In Stock (${product.stock})` : 'Out of Stock'}
//                     </span>
//                     {product.hasFlavors && product.flavors && (
//                       <span className="text-xs px-2 py-1 rounded bg-blue-100 text-blue-700 ml-2">
//                         {product.flavors.length} Variants
//                       </span>
//                     )}
//                   </div>

//                   {/* Action Buttons */}
//                   <div className="flex gap-2">
//                     <button
//                       onClick={() => handleEdit(product)}
//                       className="flex-1 bg-secondary hover:bg-muted text-foreground py-1.5 sm:py-2 rounded-lg font-semibold transition-colors flex items-center justify-center gap-1 sm:gap-2 text-xs sm:text-sm"
//                     >
//                       <Edit2 size={14} className="sm:w-4 sm:h-4" />
//                       <span>Edit</span>
//                     </button>
//                     <button
//                       onClick={() => handleDelete(product.id)}
//                       className="flex-1 bg-red-100 hover:bg-red-200 text-red-700 py-1.5 sm:py-2 rounded-lg font-semibold transition-colors flex items-center justify-center gap-1 sm:gap-2 text-xs sm:text-sm"
//                     >
//                       <Trash2 size={14} className="sm:w-4 sm:h-4" />
//                       <span>Delete</span>
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


//with deals and without deal bg color

// 'use client';

// import { useEffect, useState } from 'react';
// import { useRouter } from 'next/navigation';
// import { motion, AnimatePresence } from 'framer-motion';
// import { useAuth } from '@/lib/authContext';
// import { rtdb } from '@/lib/firebase';
// import { ref, onValue, set, remove } from 'firebase/database';
// import { uploadToImgBB } from '@/lib/imgbb';
// import { Upload, Trash2, Edit2, ArrowLeft, X, Star, Plus, Tags, Package, Tag } from 'lucide-react';
// import Link from 'next/link';
// import toast, { Toaster } from 'react-hot-toast';

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
//   isFeatured?: boolean;
//   hasFlavors?: boolean;
//   flavors?: string[];
//   dealName?: string; // ✅ Deal name field
//   createdAt?: string;
//   updatedAt?: string;
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
//   const [customCategory, setCustomCategory] = useState('');
//   const [showCustomCategory, setShowCustomCategory] = useState(false);
//   const [hasFlavors, setHasFlavors] = useState(false);

//   const predefinedCategories = [
//     'Perfume',
//     'Wax',
//     'Facial Cream',
//     'Body Lotion',
//     'Soap',
//     'Scrub',
//     'Oil',
//     'Deal' // ✅ Deal category added
//   ];

//   const [formData, setFormData] = useState({
//     name: '',
//     price: '',
//     discount: '',
//     stock: '',
//     category: 'Perfume',
//     description: '',
//     image: '' as any,
//     additionalImages: [] as any[],
//     isFeatured: false,
//     flavors: [] as string[],
//     dealName: '' // ✅ Deal name field
//   });

//   const [additionalImagePreviews, setAdditionalImagePreviews] = useState<string[]>([]);
//   const [existingAdditionalImages, setExistingAdditionalImages] = useState<string[]>([]);

//   // ✅ Check admin access
//   useEffect(() => {
//     if (authLoading) return;
//     if (!user) {
//       router.push('/login');
//     } else if (!isAdmin) {
//       router.push('/');
//     }
//   }, [user, isAdmin, authLoading, router]);

//   // ✅ Fetch products
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

//   const featuredCount = products.filter(p => p.isFeatured === true).length;

//   // ✅ Handle Main Image
//   const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (!file) return;

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

//   // ✅ Handle Additional Images
//   const handleAdditionalImageChange = async (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
//     const file = e.target.files?.[0];
//     if (!file) return;

//     const reader = new FileReader();
//     reader.onloadend = () => {
//       const newPreviews = [...additionalImagePreviews];
//       newPreviews[index] = reader.result as string;
//       setAdditionalImagePreviews(newPreviews);
//     };
//     reader.readAsDataURL(file);

//     const newImages = [...formData.additionalImages];
//     newImages[index] = file;
//     setFormData(prev => ({
//       ...prev,
//       additionalImages: newImages
//     }));
//   };

//   const addAdditionalImageSlot = () => {
//     setFormData(prev => ({
//       ...prev,
//       additionalImages: [...prev.additionalImages, null]
//     }));
//     setAdditionalImagePreviews(prev => [...prev, '']);
//   };

//   const handleRemoveAdditionalImage = (index: number) => {
//     const newPreviews = [...additionalImagePreviews];
//     newPreviews.splice(index, 1);
//     setAdditionalImagePreviews(newPreviews);

//     const newImages = [...formData.additionalImages];
//     newImages.splice(index, 1);
//     setFormData(prev => ({
//       ...prev,
//       additionalImages: newImages
//     }));
//   };

//   // ✅ Add Flavor
//   const addFlavor = () => {
//     setFormData(prev => ({
//       ...prev,
//       flavors: [...prev.flavors, '']
//     }));
//   };

//   const removeFlavor = (index: number) => {
//     const newFlavors = [...formData.flavors];
//     newFlavors.splice(index, 1);
//     setFormData(prev => ({
//       ...prev,
//       flavors: newFlavors
//     }));
//   };

//   const updateFlavor = (index: number, value: string) => {
//     const newFlavors = [...formData.flavors];
//     newFlavors[index] = value;
//     setFormData(prev => ({
//       ...prev,
//       flavors: newFlavors
//     }));
//   };

//   // ✅ Handle Category Change
//   const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
//     const value = e.target.value;
//     if (value === 'custom') {
//       setShowCustomCategory(true);
//       setFormData(prev => ({ ...prev, category: '' }));
//     } else {
//       setShowCustomCategory(false);
//       setFormData(prev => ({ ...prev, category: value }));
      
//       // ✅ If Deal category selected, clear deal name field
//       if (value !== 'Deal') {
//         setFormData(prev => ({ ...prev, dealName: '' }));
//       }
//     }
//   };

//   const handleCustomCategoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const value = e.target.value;
//     setCustomCategory(value);
//     setFormData(prev => ({ ...prev, category: value }));
//   };

//   // ✅ Handle Deal Name Change
//   const handleDealNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setFormData(prev => ({ ...prev, dealName: e.target.value }));
//   };

//   // ✅ Handle Submit
//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setUploading(true);

//     try {
//       let imageUrl = '';
//       if (formData.image instanceof File) {
//         imageUrl = await uploadToImgBB(formData.image);
//       } else if (typeof formData.image === 'string' && formData.image) {
//         imageUrl = formData.image;
//       }

//       // ✅ Upload additional images
//       const additionalImageUrls: string[] = [];
      
//       if (editingId) {
//         const existingImages = existingAdditionalImages.filter(url => url !== '');
//         additionalImageUrls.push(...existingImages);
//       }

//       for (const img of formData.additionalImages) {
//         if (img instanceof File) {
//           const url = await uploadToImgBB(img);
//           additionalImageUrls.push(url);
//         } else if (typeof img === 'string' && img) {
//           additionalImageUrls.push(img);
//         }
//       }

//       // ✅ Filter empty flavor names
//       const flavorNames = formData.flavors.filter(f => f.trim() !== '');

//       const productData: any = {
//         name: formData.name,
//         price: Number(formData.price),
//         discount: Number(formData.discount) || 0,
//         stock: Number(formData.stock) || 0,
//         category: formData.category || customCategory || 'Other',
//         description: formData.description,
//         isFeatured: formData.isFeatured || false,
//         hasFlavors: hasFlavors && flavorNames.length > 0,
//         image: imageUrl,
//       };

//       // ✅ Save deal name only if category is "Deal"
//       if (formData.category === 'Deal' && formData.dealName) {
//         productData.dealName = formData.dealName;
//       }

//       if (additionalImageUrls.length > 0) {
//         productData.additionalImages = additionalImageUrls;
//       }

//       if (hasFlavors && flavorNames.length > 0) {
//         productData.flavors = flavorNames;
//       }

//       if (!editingId) {
//         productData.createdAt = new Date().toISOString();
//       }

//       if (editingId) {
//         await set(ref(rtdb, `products/${editingId}`), {
//           ...productData,
//           updatedAt: new Date().toISOString()
//         });
//         toast.success('✅ Product updated successfully!');
//       } else {
//         const newId = Date.now().toString();
//         await set(ref(rtdb, `products/${newId}`), productData);
//         toast.success('✅ Product added successfully!');
//       }

//       handleCancel();
//     } catch (error) {
//       console.error('[v0] Error saving product:', error);
//       toast.error('❌ Error saving product');
//     } finally {
//       setUploading(false);
//     }
//   };

//   const handleEdit = (product: Product) => {
//     setHasFlavors(product.hasFlavors || false);
//     setImagePreview(product.image || '');

//     const additionalImages = product.additionalImages || [];
//     setExistingAdditionalImages(additionalImages);
//     setAdditionalImagePreviews(additionalImages.map(() => ''));

//     setFormData({
//       name: product.name,
//       price: product.price?.toString() || '',
//       discount: (product.discount || 0).toString(),
//       stock: (product.stock || 0).toString(),
//       category: product.category,
//       description: product.description || '',
//       image: product.image || '',
//       additionalImages: additionalImages,
//       isFeatured: product.isFeatured || false,
//       flavors: product.flavors || [],
//       dealName: product.dealName || ''
//     });

//     const isPredefined = predefinedCategories.includes(product.category);
//     if (isPredefined) {
//       setShowCustomCategory(false);
//       setCustomCategory('');
//     } else {
//       setShowCustomCategory(true);
//       setCustomCategory(product.category);
//     }

//     setEditingId(product.id);
//     setShowForm(true);
//   };

//   const handleDelete = async (id: string) => {
//     if (!confirm('Are you sure you want to delete this product?')) return;

//     try {
//       await remove(ref(rtdb, `products/${id}`));
//       toast.success('✅ Product deleted successfully!');
//     } catch (error) {
//       console.error('[v0] Error deleting product:', error);
//       toast.error('❌ Error deleting product');
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
//       additionalImages: [],
//       isFeatured: false,
//       flavors: [],
//       dealName: ''
//     });
//     setImagePreview('');
//     setAdditionalImagePreviews([]);
//     setExistingAdditionalImages([]);
//     setCustomCategory('');
//     setShowCustomCategory(false);
//     setHasFlavors(false);
//   };

//   useEffect(() => {
//     if (showForm && formData.additionalImages.length === 0 && !editingId) {
//       setFormData(prev => ({
//         ...prev,
//         additionalImages: [null]
//       }));
//       setAdditionalImagePreviews(['']);
//     }
//   }, [showForm, editingId]);

//   if (authLoading) {
//     return (
//       <div className="min-h-screen bg-background flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
//           <p className="mt-4 text-muted-foreground">Loading...</p>
//         </div>
//       </div>
//     );
//   }

//   if (!user || !isAdmin) {
//     return null;
//   }

//   return (
//     <div className="min-h-screen bg-background">
//       <Toaster position="top-right" />

//       {/* Header */}
//       <div className="bg-secondary border-b border-border">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
//           <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
//             <div className="flex items-center gap-3 sm:gap-4">
//               <Link href="/admin" className="text-muted-foreground hover:text-foreground transition-colors">
//                 <ArrowLeft size={20} className="sm:w-6 sm:h-6" />
//               </Link>
//               <h1 className="text-xl sm:text-2xl md:text-3xl font-bold truncate">
//                 Product Management
//               </h1>
//             </div>
//             <div className="flex flex-wrap items-center gap-2 sm:gap-4">
//               <div className="bg-primary/10 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-sm sm:text-base whitespace-nowrap">
//                 <span className="font-semibold text-primary">
//                   ⭐ {featuredCount}/4 Featured
//                 </span>
//               </div>
//               <button
//                 onClick={() => {
//                   handleCancel();
//                   setShowForm(true);
//                 }}
//                 className="bg-primary text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg hover:opacity-90 transition-opacity text-sm sm:text-base whitespace-nowrap"
//               >
//                 + Add Product
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">

//         {/* Add/Edit Form */}
//         {showForm && (
//           <motion.div
//             initial={{ opacity: 0, y: -20 }}
//             animate={{ opacity: 1, y: 0 }}
//             className="bg-card rounded-lg p-4 sm:p-6 mb-6 sm:mb-8 border border-border shadow-lg"
//           >
//             <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">
//               {editingId ? 'Edit Product' : 'Add New Product'}
//             </h2>

//             <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
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
//                   <label className="block text-sm font-semibold mb-2 flex items-center gap-2">
//                     <Tags className="w-4 h-4" />
//                     Category
//                   </label>
//                   <select
//                     value={showCustomCategory ? 'custom' : formData.category}
//                     onChange={handleCategoryChange}
//                     className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-input"
//                   >
//                     {predefinedCategories.map((cat) => (
//                       <option key={cat} value={cat}>{cat}</option>
//                     ))}
//                     <option value="custom" className="text-primary font-semibold">
//                       ➕ Custom Category
//                     </option>
//                   </select>
//                 </div>

//                 {showCustomCategory && (
//                   <div className="md:col-span-2">
//                     <label className="block text-sm font-semibold mb-2 text-primary">
//                       Enter Custom Category
//                     </label>
//                     <input
//                       type="text"
//                       required
//                       value={customCategory}
//                       onChange={handleCustomCategoryChange}
//                       placeholder="e.g., Gift Set, Organic, Premium, etc."
//                       className="w-full px-4 py-2 border-2 border-primary/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-input"
//                     />
//                   </div>
//                 )}

//                 {/* ✅ Deal Name - Only show when category is Deal */}
//                 {formData.category === 'Deal' && (
//                   <div className="md:col-span-2">
//                     <label className="block text-sm font-semibold mb-2 flex items-center gap-2 text-orange-600">
//                       <Tag className="w-4 h-4" />
//                       Deal Name <span className="text-red-500">*</span>
//                     </label>
//                     <input
//                       type="text"
//                       required={formData.category === 'Deal'}
//                       value={formData.dealName}
//                       onChange={handleDealNameChange}
//                       placeholder="e.g., Summer Sale, Eid Special, Buy 1 Get 1, etc."
//                       className="w-full px-4 py-2 border-2 border-orange-300/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-orange-50/30"
//                     />
//                     <p className="text-xs text-muted-foreground mt-1">
//                       💡 Enter a catchy deal name for this product (e.g., "Eid Special Offer", "Summer Sale", etc.)
//                     </p>
//                   </div>
//                 )}

//                 {/* Price */}
//                 <div>
//                   <label className="block text-sm font-semibold mb-2">Price (PKR)</label>
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
//                   <label className="block text-sm font-semibold mb-2">Discount Price (PKR) - Optional</label>
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

//               {/* Has Flavors Toggle */}
//               <div className="flex flex-wrap items-center gap-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
//                 <label className="flex items-center cursor-pointer">
//                   <input
//                     type="checkbox"
//                     checked={hasFlavors}
//                     onChange={(e) => {
//                       setHasFlavors(e.target.checked);
//                       if (!e.target.checked) {
//                         setFormData(prev => ({ ...prev, flavors: [] }));
//                       }
//                     }}
//                     className="w-5 h-5 text-blue-600 rounded border-blue-300 focus:ring-blue-500"
//                   />
//                   <span className="ml-3 font-semibold text-sm sm:text-base text-blue-700 flex items-center gap-2">
//                     <Package className="w-4 h-4" />
//                     This product has multiple flavors/variants
//                   </span>
//                 </label>
//                 {hasFlavors && (
//                   <span className="text-xs text-blue-600 font-medium">
//                     ✅ Add flavor names below (price/stock shared)
//                   </span>
//                 )}
//               </div>

//               {/* Flavors Section */}
//               {hasFlavors && (
//                 <div className="space-y-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
//                   <div className="flex items-center justify-between">
//                     <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
//                       <Package className="w-5 h-5 text-primary" />
//                       Flavors / Variants
//                     </h3>
//                     <button
//                       type="button"
//                       onClick={addFlavor}
//                       className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-semibold"
//                     >
//                       <Plus className="w-4 h-4" />
//                       Add Flavor
//                     </button>
//                   </div>

//                   <p className="text-xs text-muted-foreground">
//                     Enter flavor names (e.g., Rose, Jasmine, Vanilla). Price, discount, and stock are shared across all flavors.
//                   </p>

//                   <AnimatePresence>
//                     {formData.flavors.map((flavor, index) => (
//                       <motion.div
//                         key={index}
//                         initial={{ opacity: 0, y: -10 }}
//                         animate={{ opacity: 1, y: 0 }}
//                         exit={{ opacity: 0, y: -10 }}
//                         className="flex items-center gap-3 bg-white p-3 rounded-lg border border-gray-200 shadow-sm"
//                       >
//                         <span className="text-sm font-semibold text-gray-500 w-8">#{index + 1}</span>
//                         <input
//                           type="text"
//                           value={flavor}
//                           onChange={(e) => updateFlavor(index, e.target.value)}
//                           placeholder="Enter flavor name..."
//                           className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
//                         />
//                         <button
//                           type="button"
//                           onClick={() => removeFlavor(index)}
//                           className="text-red-500 hover:text-red-700 transition-colors p-1"
//                         >
//                           <Trash2 className="w-4 h-4" />
//                         </button>
//                       </motion.div>
//                     ))}
//                   </AnimatePresence>

//                   {formData.flavors.length === 0 && (
//                     <p className="text-center text-gray-500 py-4">No flavors added yet. Click "Add Flavor" to add one.</p>
//                   )}
//                 </div>
//               )}

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

//               {/* Featured Toggle */}
//               <div className="flex flex-wrap items-center gap-3 p-4 bg-secondary/50 rounded-lg border border-border">
//                 <label className="flex items-center cursor-pointer">
//                   <input
//                     type="checkbox"
//                     checked={formData.isFeatured}
//                     onChange={(e) => {
//                       if (e.target.checked && featuredCount >= 4 && !editingId) {
//                         toast.error('❌ Maximum 4 products can be featured!');
//                         return;
//                       }
//                       if (e.target.checked && featuredCount >= 4 && editingId) {
//                         const currentProduct = products.find(p => p.id === editingId);
//                         if (!currentProduct?.isFeatured) {
//                           toast.error('❌ Maximum 4 products can be featured!');
//                           return;
//                         }
//                       }
//                       setFormData(prev => ({...prev, isFeatured: e.target.checked}));
//                     }}
//                     className="w-5 h-5 text-primary rounded border-border focus:ring-primary accent-primary"
//                   />
//                   <span className="ml-3 font-semibold text-sm sm:text-base">
//                     {formData.isFeatured ? '⭐ Featured Product' : '☆ Add to Featured'}
//                   </span>
//                 </label>
//                 {formData.isFeatured && (
//                   <span className="text-xs text-green-600 font-medium">
//                     ✅ Will show on home page
//                   </span>
//                 )}
//                 {!formData.isFeatured && (
//                   <span className="text-xs text-muted-foreground">
//                     (Max 4 products can be featured)
//                   </span>
//                 )}
//                 {featuredCount >= 4 && !formData.isFeatured && (
//                   <span className="text-xs text-red-500 font-medium">
//                     ⚠️ Slot full! (4/4)
//                   </span>
//                 )}
//               </div>

//               {/* Main Image */}
//               <div>
//                 <label className="block text-sm font-semibold mb-2">Main Product Image</label>
//                 <div className="flex flex-wrap gap-4">
//                   <div className="flex-1 min-w-[200px]">
//                     <div className="border-2 border-dashed border-border rounded-lg p-4 sm:p-6 text-center hover:border-primary transition-colors cursor-pointer"
//                       onClick={() => document.getElementById('imageInput')?.click()}
//                     >
//                       <Upload className="mx-auto mb-2 text-muted-foreground" size={24} />
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

//                   {imagePreview && (
//                     <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg overflow-hidden border border-border flex-shrink-0">
//                       <img
//                         src={imagePreview}
//                         alt="Preview"
//                         className="w-full h-full object-contain"
//                       />
//                     </div>
//                   )}
//                 </div>
//               </div>

//               {/* Additional Images */}
//               <div>
//                 <div className="flex items-center justify-between mb-3">
//                   <label className="block text-sm font-semibold text-primary">Additional Images</label>
//                   <button
//                     type="button"
//                     onClick={addAdditionalImageSlot}
//                     className="flex items-center gap-1 text-xs bg-primary text-white px-3 py-1.5 rounded-lg hover:opacity-90 transition-opacity"
//                   >
//                     <Plus className="w-3 h-3" />
//                     Add Image
//                   </button>
//                 </div>
//                 <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
//                   {formData.additionalImages.map((img, index) => (
//                     <div key={index} className="relative">
//                       <div className={`border-2 border-dashed border-border rounded-lg p-3 text-center hover:border-primary transition-colors cursor-pointer ${
//                         additionalImagePreviews[index] || existingAdditionalImages[index] ? 'border-primary' : ''
//                       }`}
//                         onClick={() => document.getElementById(`additionalImageInput${index}`)?.click()}
//                       >
//                         <Upload className="mx-auto mb-1 text-muted-foreground" size={16} />
//                         <p className="text-xs text-muted-foreground">Image {index + 1}</p>
//                       </div>
//                       <input
//                         id={`additionalImageInput${index}`}
//                         type="file"
//                         accept="image/*"
//                         onChange={(e) => handleAdditionalImageChange(e, index)}
//                         className="hidden"
//                       />

//                       {(additionalImagePreviews[index] || existingAdditionalImages[index]) && (
//                         <div className="mt-1 relative w-full h-16 rounded-lg overflow-hidden border border-border">
//                           <img
//                             src={additionalImagePreviews[index] || existingAdditionalImages[index]}
//                             alt={`Preview ${index + 1}`}
//                             className="w-full h-full object-contain"
//                           />
//                           <button
//                             type="button"
//                             onClick={() => handleRemoveAdditionalImage(index)}
//                             className="absolute top-0.5 right-0.5 bg-red-500 text-white rounded-full p-0.5 hover:bg-red-600 transition-colors"
//                           >
//                             <X size={12} />
//                           </button>
//                         </div>
//                       )}
//                     </div>
//                   ))}
//                 </div>
//                 <p className="text-xs text-muted-foreground mt-2">
//                   💡 Click "Add Image" to add more images (unlimited)
//                 </p>
//               </div>

//               {/* Form Actions */}
//               <div className="flex flex-wrap gap-3">
//                 <button
//                   type="submit"
//                   disabled={uploading}
//                   className="bg-primary text-white px-4 sm:px-6 py-2 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 text-sm sm:text-base"
//                 >
//                   {uploading ? 'Uploading...' : editingId ? 'Update Product' : 'Add Product'}
//                 </button>
//                 <button
//                   type="button"
//                   onClick={handleCancel}
//                   className="bg-secondary text-foreground px-4 sm:px-6 py-2 rounded-lg hover:bg-muted transition-colors text-sm sm:text-base"
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
//             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
//             <p className="mt-4 text-muted-foreground">Loading products...</p>
//           </div>
//         ) : products.length > 0 ? (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6"
//           >
//             {products.map((product, index) => (
//               <motion.div
//                 key={product.id}
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ delay: index * 0.1 }}
//                 className={`bg-card rounded-lg overflow-hidden border shadow-md hover:shadow-lg transition-shadow ${
//                   product.isFeatured ? 'border-primary border-2' : 'border-border'
//                 }`}
//               >
//                 {/* Product Image */}
//                 <div className="w-full aspect-square bg-secondary overflow-hidden relative flex items-center justify-center p-2">
//                   <img
//                     src={product.image || ''}
//                     alt={product.name}
//                     className="w-full h-full object-contain"
//                     onError={(e) => {
//                       e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="300" height="300"%3E%3Crect fill="%23e8e3dc" width="300" height="300"/%3E%3C/svg%3E';
//                     }}
//                   />
//                   {product.isFeatured && (
//                     <div className="absolute top-2 left-2 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white text-xs px-2 sm:px-3 py-1 rounded-full font-semibold shadow-lg flex items-center gap-1">
//                       <Star className="w-3 h-3 fill-current" />
//                       <span className="hidden xs:inline">Featured</span>
//                     </div>
//                   )}
//                   {/* ✅ Deal Badge */}
//                   {product.category === 'Deal' && product.dealName && (
//                     <div className="absolute top-2 right-2 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs px-2 sm:px-3 py-1 rounded-full font-semibold shadow-lg flex items-center gap-1 animate-pulse">
//                       <Tag className="w-3 h-3" />
//                       {product.dealName}
//                     </div>
//                   )}
//                   {product.hasFlavors && product.flavors && product.flavors.length > 0 && (
//                     <div className="absolute bottom-2 left-2 bg-blue-500/80 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
//                       <Package className="w-3 h-3" />
//                       {product.flavors.length} Flavors
//                     </div>
//                   )}
//                   {product.additionalImages && product.additionalImages.length > 0 && (
//                     <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
//                       +{product.additionalImages.length}
//                     </div>
//                   )}
//                 </div>

//                 {/* Product Info */}
//                 <div className="p-3 sm:p-4">
//                   <div className="flex items-center justify-between mb-1">
//                     <p className="text-xs text-muted-foreground uppercase tracking-wide truncate">
//                       {product.category}
//                     </p>
//                     {product.category === 'Deal' && product.dealName && (
//                       <span className="text-[10px] bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full font-semibold truncate max-w-[60%]">
//                         {product.dealName}
//                       </span>
//                     )}
//                   </div>
//                   <h3 className="font-semibold mb-2 line-clamp-2 text-sm sm:text-base">{product.name}</h3>
                  
//                   <div className="flex items-center gap-2 mb-2 sm:mb-3 flex-wrap">
//                     <span className="text-base sm:text-lg font-bold text-primary">
//                       PKR {Math.round((product.price || 0) - (product.discount || 0))}
//                     </span>
//                     {product.discount && product.discount > 0 && (
//                       <span className="text-xs sm:text-sm text-muted-foreground line-through">
//                         PKR {product.price}
//                       </span>
//                     )}
//                     {product.hasFlavors && product.flavors && (
//                       <span className="text-xs text-blue-600 font-medium ml-2">
//                         {product.flavors.length} flavors
//                       </span>
//                     )}
//                   </div>

//                   {product.description && (
//                     <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4 line-clamp-2">
//                       {product.description}
//                     </p>
//                   )}

//                   <div className="mb-3 sm:mb-4">
//                     <span className={`text-xs px-2 py-1 rounded ${
//                       (product.stock || 0) > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
//                     }`}>
//                       {(product.stock || 0) > 0 ? `In Stock (${product.stock})` : 'Out of Stock'}
//                     </span>
//                     {product.hasFlavors && product.flavors && (
//                       <span className="text-xs px-2 py-1 rounded bg-blue-100 text-blue-700 ml-2">
//                         {product.flavors.length} Variants
//                       </span>
//                     )}
//                   </div>

//                   {/* Action Buttons */}
//                   <div className="flex gap-2">
//                     <button
//                       onClick={() => handleEdit(product)}
//                       className="flex-1 bg-secondary hover:bg-muted text-foreground py-1.5 sm:py-2 rounded-lg font-semibold transition-colors flex items-center justify-center gap-1 sm:gap-2 text-xs sm:text-sm"
//                     >
//                       <Edit2 size={14} className="sm:w-4 sm:h-4" />
//                       <span>Edit</span>
//                     </button>
//                     <button
//                       onClick={() => handleDelete(product.id)}
//                       className="flex-1 bg-red-100 hover:bg-red-200 text-red-700 py-1.5 sm:py-2 rounded-lg font-semibold transition-colors flex items-center justify-center gap-1 sm:gap-2 text-xs sm:text-sm"
//                     >
//                       <Trash2 size={14} className="sm:w-4 sm:h-4" />
//                       <span>Delete</span>
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


//with deal bg

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/lib/authContext';
import { rtdb } from '@/lib/firebase';
import { ref, onValue, set, remove } from 'firebase/database';
import { uploadToImgBB } from '@/lib/imgbb';
import { Upload, Trash2, Edit2, ArrowLeft, X, Star, Plus, Tags, Package, Tag, Palette } from 'lucide-react';
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
  hasFlavors?: boolean;
  flavors?: string[];
  dealName?: string;
  dealColor?: string;
  createdAt?: string;
  updatedAt?: string;
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
  const [customCategory, setCustomCategory] = useState('');
  const [showCustomCategory, setShowCustomCategory] = useState(false);
  const [hasFlavors, setHasFlavors] = useState(false);

  // ✅ Predefined deal colors
  const dealColors = [
    '#FF6B35', // Orange
    '#FF4444', // Red
    '#FF8C00', // Dark Orange
    '#DC143C', // Crimson
    '#FF4500', // Orange Red
    '#FF6347', // Tomato
    '#FF1493', // Deep Pink
    '#FFD700', // Gold
    '#FF4081', // Pink
    '#E74C3C', // Red
    '#F39C12', // Yellow Orange
    '#D35400', // Burnt Orange
  ];

  const predefinedCategories = [
    'Perfume',
    'Wax',
    'Facial Cream',
    'Body Lotion',
    'Soap',
    'Scrub',
    'Oil',
    'Deal'
  ];

  const [formData, setFormData] = useState({
    name: '',
    price: '',
    discount: '',
    stock: '',
    category: 'Perfume',
    description: '',
    image: '' as any,
    additionalImages: [] as any[],
    isFeatured: false,
    flavors: [] as string[],
    dealName: '',
    dealColor: '#FF6B35'
  });

  const [additionalImagePreviews, setAdditionalImagePreviews] = useState<string[]>([]);
  const [existingAdditionalImages, setExistingAdditionalImages] = useState<string[]>([]);

  // ✅ Check admin access
  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.push('/login');
    } else if (!isAdmin) {
      router.push('/');
    }
  }, [user, isAdmin, authLoading, router]);

  // ✅ Fetch products
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

  const featuredCount = products.filter(p => p.isFeatured === true).length;

  // ✅ Handle Main Image
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

  // ✅ Handle Additional Images
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

    const newImages = [...formData.additionalImages];
    newImages[index] = file;
    setFormData(prev => ({
      ...prev,
      additionalImages: newImages
    }));
  };

  const addAdditionalImageSlot = () => {
    setFormData(prev => ({
      ...prev,
      additionalImages: [...prev.additionalImages, null]
    }));
    setAdditionalImagePreviews(prev => [...prev, '']);
  };

  const handleRemoveAdditionalImage = (index: number) => {
    const newPreviews = [...additionalImagePreviews];
    newPreviews.splice(index, 1);
    setAdditionalImagePreviews(newPreviews);

    const newImages = [...formData.additionalImages];
    newImages.splice(index, 1);
    setFormData(prev => ({
      ...prev,
      additionalImages: newImages
    }));
  };

  // ✅ Add Flavor
  const addFlavor = () => {
    setFormData(prev => ({
      ...prev,
      flavors: [...prev.flavors, '']
    }));
  };

  const removeFlavor = (index: number) => {
    const newFlavors = [...formData.flavors];
    newFlavors.splice(index, 1);
    setFormData(prev => ({
      ...prev,
      flavors: newFlavors
    }));
  };

  const updateFlavor = (index: number, value: string) => {
    const newFlavors = [...formData.flavors];
    newFlavors[index] = value;
    setFormData(prev => ({
      ...prev,
      flavors: newFlavors
    }));
  };

  // ✅ Handle Category Change
  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value === 'custom') {
      setShowCustomCategory(true);
      setFormData(prev => ({ ...prev, category: '' }));
    } else {
      setShowCustomCategory(false);
      setFormData(prev => ({ ...prev, category: value }));
      
      if (value !== 'Deal') {
        setFormData(prev => ({ ...prev, dealName: '', dealColor: '#FF6B35' }));
      }
    }
  };

  const handleCustomCategoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCustomCategory(value);
    setFormData(prev => ({ ...prev, category: value }));
  };

  // ✅ Handle Deal Name Change
  const handleDealNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, dealName: e.target.value }));
  };

  // ✅ Handle Deal Color Change
  const handleDealColorChange = (color: string) => {
    setFormData(prev => ({ ...prev, dealColor: color }));
  };

  // ✅ Handle Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);

    try {
      let imageUrl = '';
      if (formData.image instanceof File) {
        imageUrl = await uploadToImgBB(formData.image);
      } else if (typeof formData.image === 'string' && formData.image) {
        imageUrl = formData.image;
      }

      // ✅ Upload additional images
      const additionalImageUrls: string[] = [];
      
      if (editingId) {
        const existingImages = existingAdditionalImages.filter(url => url !== '');
        additionalImageUrls.push(...existingImages);
      }

      for (const img of formData.additionalImages) {
        if (img instanceof File) {
          const url = await uploadToImgBB(img);
          additionalImageUrls.push(url);
        } else if (typeof img === 'string' && img) {
          additionalImageUrls.push(img);
        }
      }

      // ✅ Filter empty flavor names
      const flavorNames = formData.flavors.filter(f => f.trim() !== '');

      const productData: any = {
        name: formData.name,
        price: Number(formData.price),
        discount: Number(formData.discount) || 0,
        stock: Number(formData.stock) || 0,
        category: formData.category || customCategory || 'Other',
        description: formData.description,
        isFeatured: formData.isFeatured || false,
        hasFlavors: hasFlavors && flavorNames.length > 0,
        image: imageUrl,
      };

      // ✅ Save deal name and color only if category is "Deal"
      if (formData.category === 'Deal') {
        if (formData.dealName) {
          productData.dealName = formData.dealName;
        }
        if (formData.dealColor) {
          productData.dealColor = formData.dealColor;
        }
      }

      if (additionalImageUrls.length > 0) {
        productData.additionalImages = additionalImageUrls;
      }

      if (hasFlavors && flavorNames.length > 0) {
        productData.flavors = flavorNames;
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
    setHasFlavors(product.hasFlavors || false);
    setImagePreview(product.image || '');

    const additionalImages = product.additionalImages || [];
    setExistingAdditionalImages(additionalImages);
    setAdditionalImagePreviews(additionalImages.map(() => ''));

    setFormData({
      name: product.name,
      price: product.price?.toString() || '',
      discount: (product.discount || 0).toString(),
      stock: (product.stock || 0).toString(),
      category: product.category,
      description: product.description || '',
      image: product.image || '',
      additionalImages: additionalImages,
      isFeatured: product.isFeatured || false,
      flavors: product.flavors || [],
      dealName: product.dealName || '',
      dealColor: product.dealColor || '#FF6B35'
    });

    const isPredefined = predefinedCategories.includes(product.category);
    if (isPredefined) {
      setShowCustomCategory(false);
      setCustomCategory('');
    } else {
      setShowCustomCategory(true);
      setCustomCategory(product.category);
    }

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
      additionalImages: [],
      isFeatured: false,
      flavors: [],
      dealName: '',
      dealColor: '#FF6B35'
    });
    setImagePreview('');
    setAdditionalImagePreviews([]);
    setExistingAdditionalImages([]);
    setCustomCategory('');
    setShowCustomCategory(false);
    setHasFlavors(false);
  };

  useEffect(() => {
    if (showForm && formData.additionalImages.length === 0 && !editingId) {
      setFormData(prev => ({
        ...prev,
        additionalImages: [null]
      }));
      setAdditionalImagePreviews(['']);
    }
  }, [showForm, editingId]);

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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
            <div className="flex items-center gap-3 sm:gap-4">
              <Link href="/admin" className="text-muted-foreground hover:text-foreground transition-colors">
                <ArrowLeft size={20} className="sm:w-6 sm:h-6" />
              </Link>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold truncate">
                Product Management
              </h1>
            </div>
            <div className="flex flex-wrap items-center gap-2 sm:gap-4">
              <div className="bg-primary/10 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-sm sm:text-base whitespace-nowrap">
                <span className="font-semibold text-primary">
                  ⭐ {featuredCount}/4 Featured
                </span>
              </div>
              <button
                onClick={() => {
                  handleCancel();
                  setShowForm(true);
                }}
                className="bg-primary text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg hover:opacity-90 transition-opacity text-sm sm:text-base whitespace-nowrap"
              >
                + Add Product
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">

        {/* Add/Edit Form */}
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card rounded-lg p-4 sm:p-6 mb-6 sm:mb-8 border border-border shadow-lg"
          >
            <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">
              {editingId ? 'Edit Product' : 'Add New Product'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
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
                  <label className="block text-sm font-semibold mb-2 flex items-center gap-2">
                    <Tags className="w-4 h-4" />
                    Category
                  </label>
                  <select
                    value={showCustomCategory ? 'custom' : formData.category}
                    onChange={handleCategoryChange}
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-input"
                  >
                    {predefinedCategories.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                    <option value="custom" className="text-primary font-semibold">
                      ➕ Custom Category
                    </option>
                  </select>
                </div>

                {showCustomCategory && (
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold mb-2 text-primary">
                      Enter Custom Category
                    </label>
                    <input
                      type="text"
                      required
                      value={customCategory}
                      onChange={handleCustomCategoryChange}
                      placeholder="e.g., Gift Set, Organic, Premium, etc."
                      className="w-full px-4 py-2 border-2 border-primary/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-input"
                    />
                  </div>
                )}

                {/* ✅ Deal Name - Only show when category is Deal */}
                {formData.category === 'Deal' && (
                  <>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold mb-2 flex items-center gap-2 text-orange-600">
                        <Tag className="w-4 h-4" />
                        Deal Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required={formData.category === 'Deal'}
                        value={formData.dealName}
                        onChange={handleDealNameChange}
                        placeholder="e.g., Summer Sale, Eid Special, Buy 1 Get 1, etc."
                        className="w-full px-4 py-2 border-2 border-orange-300/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 bg-orange-50/30"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        💡 Enter a catchy deal name for this product
                      </p>
                    </div>

                    {/* ✅ Deal Color Palette */}
                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold mb-2 flex items-center gap-2 text-orange-600">
                        <Palette className="w-4 h-4" />
                        Deal Color <span className="text-red-500">*</span>
                      </label>
                      <div className="flex flex-wrap gap-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
                        {dealColors.map((color) => (
                          <button
                            key={color}
                            type="button"
                            onClick={() => handleDealColorChange(color)}
                            className={`w-10 h-10 rounded-full border-2 transition-all hover:scale-110 ${
                              formData.dealColor === color
                                ? 'border-gray-900 ring-2 ring-offset-2 ring-gray-900 scale-110'
                                : 'border-gray-300 hover:border-gray-500'
                            }`}
                            style={{ backgroundColor: color }}
                            title={color}
                          />
                        ))}
                        {/* Custom Color Input */}
                        <div className="flex items-center gap-2 ml-2">
                          <input
                            type="color"
                            value={formData.dealColor}
                            onChange={(e) => handleDealColorChange(e.target.value)}
                            className="w-10 h-10 rounded-full border-2 border-gray-300 cursor-pointer p-0"
                          />
                          <span className="text-xs text-gray-500">Custom</span>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        🎨 Select a color for the deal badge (will appear on home page)
                      </p>
                    </div>
                  </>
                )}

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

              {/* Has Flavors Toggle */}
              <div className="flex flex-wrap items-center gap-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={hasFlavors}
                    onChange={(e) => {
                      setHasFlavors(e.target.checked);
                      if (!e.target.checked) {
                        setFormData(prev => ({ ...prev, flavors: [] }));
                      }
                    }}
                    className="w-5 h-5 text-blue-600 rounded border-blue-300 focus:ring-blue-500"
                  />
                  <span className="ml-3 font-semibold text-sm sm:text-base text-blue-700 flex items-center gap-2">
                    <Package className="w-4 h-4" />
                    This product has multiple flavors/variants
                  </span>
                </label>
                {hasFlavors && (
                  <span className="text-xs text-blue-600 font-medium">
                    ✅ Add flavor names below (price/stock shared)
                  </span>
                )}
              </div>

              {/* Flavors Section */}
              {hasFlavors && (
                <div className="space-y-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                      <Package className="w-5 h-5 text-primary" />
                      Flavors / Variants
                    </h3>
                    <button
                      type="button"
                      onClick={addFlavor}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-semibold"
                    >
                      <Plus className="w-4 h-4" />
                      Add Flavor
                    </button>
                  </div>

                  <p className="text-xs text-muted-foreground">
                    Enter flavor names (e.g., Rose, Jasmine, Vanilla). Price, discount, and stock are shared across all flavors.
                  </p>

                  <AnimatePresence>
                    {formData.flavors.map((flavor, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="flex items-center gap-3 bg-white p-3 rounded-lg border border-gray-200 shadow-sm"
                      >
                        <span className="text-sm font-semibold text-gray-500 w-8">#{index + 1}</span>
                        <input
                          type="text"
                          value={flavor}
                          onChange={(e) => updateFlavor(index, e.target.value)}
                          placeholder="Enter flavor name..."
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                        />
                        <button
                          type="button"
                          onClick={() => removeFlavor(index)}
                          className="text-red-500 hover:text-red-700 transition-colors p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </motion.div>
                    ))}
                  </AnimatePresence>

                  {formData.flavors.length === 0 && (
                    <p className="text-center text-gray-500 py-4">No flavors added yet. Click "Add Flavor" to add one.</p>
                  )}
                </div>
              )}

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
              <div className="flex flex-wrap items-center gap-3 p-4 bg-secondary/50 rounded-lg border border-border">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isFeatured}
                    onChange={(e) => {
                      if (e.target.checked && featuredCount >= 4 && !editingId) {
                        toast.error('❌ Maximum 4 products can be featured!');
                        return;
                      }
                      if (e.target.checked && featuredCount >= 4 && editingId) {
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
                  <span className="ml-3 font-semibold text-sm sm:text-base">
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

              {/* Main Image */}
              <div>
                <label className="block text-sm font-semibold mb-2">Main Product Image</label>
                <div className="flex flex-wrap gap-4">
                  <div className="flex-1 min-w-[200px]">
                    <div className="border-2 border-dashed border-border rounded-lg p-4 sm:p-6 text-center hover:border-primary transition-colors cursor-pointer"
                      onClick={() => document.getElementById('imageInput')?.click()}
                    >
                      <Upload className="mx-auto mb-2 text-muted-foreground" size={24} />
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

                  {imagePreview && (
                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg overflow-hidden border border-border flex-shrink-0">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-full object-contain"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Additional Images */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-sm font-semibold text-primary">Additional Images</label>
                  <button
                    type="button"
                    onClick={addAdditionalImageSlot}
                    className="flex items-center gap-1 text-xs bg-primary text-white px-3 py-1.5 rounded-lg hover:opacity-90 transition-opacity"
                  >
                    <Plus className="w-3 h-3" />
                    Add Image
                  </button>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {formData.additionalImages.map((img, index) => (
                    <div key={index} className="relative">
                      <div className={`border-2 border-dashed border-border rounded-lg p-3 text-center hover:border-primary transition-colors cursor-pointer ${
                        additionalImagePreviews[index] || existingAdditionalImages[index] ? 'border-primary' : ''
                      }`}
                        onClick={() => document.getElementById(`additionalImageInput${index}`)?.click()}
                      >
                        <Upload className="mx-auto mb-1 text-muted-foreground" size={16} />
                        <p className="text-xs text-muted-foreground">Image {index + 1}</p>
                      </div>
                      <input
                        id={`additionalImageInput${index}`}
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleAdditionalImageChange(e, index)}
                        className="hidden"
                      />

                      {(additionalImagePreviews[index] || existingAdditionalImages[index]) && (
                        <div className="mt-1 relative w-full h-16 rounded-lg overflow-hidden border border-border">
                          <img
                            src={additionalImagePreviews[index] || existingAdditionalImages[index]}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-full object-contain"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveAdditionalImage(index)}
                            className="absolute top-0.5 right-0.5 bg-red-500 text-white rounded-full p-0.5 hover:bg-red-600 transition-colors"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  💡 Click "Add Image" to add more images (unlimited)
                </p>
              </div>

              {/* Form Actions */}
              <div className="flex flex-wrap gap-3">
                <button
                  type="submit"
                  disabled={uploading}
                  className="bg-primary text-white px-4 sm:px-6 py-2 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 text-sm sm:text-base"
                >
                  {uploading ? 'Uploading...' : editingId ? 'Update Product' : 'Add Product'}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="bg-secondary text-foreground px-4 sm:px-6 py-2 rounded-lg hover:bg-muted transition-colors text-sm sm:text-base"
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
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6"
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
                <div className="w-full aspect-square bg-secondary overflow-hidden relative flex items-center justify-center p-2">
                  <img
                    src={product.image || ''}
                    alt={product.name}
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="300" height="300"%3E%3Crect fill="%23e8e3dc" width="300" height="300"/%3E%3C/svg%3E';
                    }}
                  />
                  {product.isFeatured && (
                    <div className="absolute top-2 left-2 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white text-xs px-2 sm:px-3 py-1 rounded-full font-semibold shadow-lg flex items-center gap-1">
                      <Star className="w-3 h-3 fill-current" />
                      <span className="hidden xs:inline">Featured</span>
                    </div>
                  )}
                  {/* ✅ Deal Badge with Color */}
                  {product.category === 'Deal' && product.dealName && (
                    <div 
                      className="absolute top-2 right-2 text-white text-xs px-2 sm:px-3 py-1 rounded-full font-semibold shadow-lg flex items-center gap-1 animate-pulse"
                      style={{ backgroundColor: product.dealColor || '#FF6B35' }}
                    >
                      <Tag className="w-3 h-3" />
                      {product.dealName}
                    </div>
                  )}
                  {product.hasFlavors && product.flavors && product.flavors.length > 0 && (
                    <div className="absolute bottom-2 left-2 bg-blue-500/80 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
                      <Package className="w-3 h-3" />
                      {product.flavors.length} Flavors
                    </div>
                  )}
                  {product.additionalImages && product.additionalImages.length > 0 && (
                    <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                      +{product.additionalImages.length}
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className="p-3 sm:p-4">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-xs text-muted-foreground uppercase tracking-wide truncate">
                      {product.category}
                    </p>
                    {product.category === 'Deal' && product.dealName && (
                      <span 
                        className="text-[10px] text-white px-2 py-0.5 rounded-full font-semibold truncate max-w-[60%]"
                        style={{ backgroundColor: product.dealColor || '#FF6B35' }}
                      >
                        {product.dealName}
                      </span>
                    )}
                  </div>
                  <h3 className="font-semibold mb-2 line-clamp-2 text-sm sm:text-base">{product.name}</h3>
                  
                  <div className="flex items-center gap-2 mb-2 sm:mb-3 flex-wrap">
                    <span className="text-base sm:text-lg font-bold text-primary">
                      PKR {Math.round((product.price || 0) - (product.discount || 0))}
                    </span>
                    {product.discount && product.discount > 0 && (
                      <span className="text-xs sm:text-sm text-muted-foreground line-through">
                        PKR {product.price}
                      </span>
                    )}
                    {product.hasFlavors && product.flavors && (
                      <span className="text-xs text-blue-600 font-medium ml-2">
                        {product.flavors.length} flavors
                      </span>
                    )}
                  </div>

                  {product.description && (
                    <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4 line-clamp-2">
                      {product.description}
                    </p>
                  )}

                  <div className="mb-3 sm:mb-4">
                    <span className={`text-xs px-2 py-1 rounded ${
                      (product.stock || 0) > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {(product.stock || 0) > 0 ? `In Stock (${product.stock})` : 'Out of Stock'}
                    </span>
                    {product.hasFlavors && product.flavors && (
                      <span className="text-xs px-2 py-1 rounded bg-blue-100 text-blue-700 ml-2">
                        {product.flavors.length} Variants
                      </span>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(product)}
                      className="flex-1 bg-secondary hover:bg-muted text-foreground py-1.5 sm:py-2 rounded-lg font-semibold transition-colors flex items-center justify-center gap-1 sm:gap-2 text-xs sm:text-sm"
                    >
                      <Edit2 size={14} className="sm:w-4 sm:h-4" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="flex-1 bg-red-100 hover:bg-red-200 text-red-700 py-1.5 sm:py-2 rounded-lg font-semibold transition-colors flex items-center justify-center gap-1 sm:gap-2 text-xs sm:text-sm"
                    >
                      <Trash2 size={14} className="sm:w-4 sm:h-4" />
                      <span>Delete</span>
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