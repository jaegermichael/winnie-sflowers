/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Phone, 
  MessageCircle, 
  MapPin, 
  Clock, 
  Menu, 
  X, 
  ChevronRight,
  Send,
  ExternalLink,
  Gift,
  Heart,
  Instagram,
  Facebook,
  Smartphone,
  Flower,
  Camera,
  Star,
  CircleDollarSign
} from 'lucide-react';
import { 
  BUSINESS_NAME, 
  PHONE_NUMBER, 
  ADDRESS, 
  CATEGORIES, 
  POPULAR_PACKAGES, 
  GALLERY_IMAGES, 
  TRUST_CARDS,
  OCCASIONS,
  PACKAGE_CATEGORIES,
  COLORS,
  BUDGETS,
  type Package
} from './constants.ts';
import {
  LOGO_MAIN,
  HERO_IMAGE,
  IMG_ABOUT_1,
  IMG_ABOUT_2,
  IMG_WEDDING_1,
  IMG_WEDDING_2,
  IMG_WEDDING_3,
  IMG_WEDDING_4,
  FALLBACK_BOUQUET
} from './assets';

const APP_DATA_KEY = 'winnies_flowers_packages_v3';

export default function App() {
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = FALLBACK_BOUQUET;
  };
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  
  // Package Management State
  const [packages, setPackages] = useState<Package[]>([]);
  const [selectedPackageIds, setSelectedPackageIds] = useState<string[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentPackage, setCurrentPackage] = useState<Partial<Package>>({
    name: '',
    category: PACKAGE_CATEGORIES[0],
    description: '',
    price: 'Custom',
    image: '',
    isAvailable: true,
    isFeatured: false,
    showInGallery: true
  });

  // Load packages
  useEffect(() => {
    const saved = localStorage.getItem(APP_DATA_KEY);
    if (saved) {
      try {
        setPackages(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse packages', e);
        setPackages(getDefaultPackages());
      }
    } else {
      setPackages(getDefaultPackages());
    }
  }, []);

  // Save packages
  useEffect(() => {
    if (packages.length > 0) {
      localStorage.setItem(APP_DATA_KEY, JSON.stringify(packages));
    }
  }, [packages]);

  function getDefaultPackages(): Package[] {
    return POPULAR_PACKAGES.map(pkg => ({
      ...pkg,
      category: pkg.category,
      isAvailable: true,
      isFeatured: true,
      showInGallery: true
    }));
  }

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPassword === 'Winnie123') {
      setIsAdminLoggedIn(true);
      setShowAdminLogin(false);
      setAdminPassword('');
    } else {
      alert('Incorrect password');
    }
  };

  const handleSavePackage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPackage.name || !currentPackage.image) {
      alert('Please fill Name and Image');
      return;
    }

    if (isEditing) {
      setPackages(prev => prev.map(p => p.id === currentPackage.id ? currentPackage as Package : p));
      setIsEditing(false);
    } else {
      const newPackage = {
        ...currentPackage,
        id: `pkg_${Date.now()}`
      } as Package;
      setPackages(prev => [...prev, newPackage]);
    }

    setCurrentPackage({
      name: '',
      category: PACKAGE_CATEGORIES[0],
      description: '',
      price: 'Custom',
      image: '',
      isAvailable: true,
      isFeatured: false,
      showInGallery: true
    });
  };

  const compressImage = (base64Str: string): Promise<string> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = base64Str;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 800;
        const MAX_HEIGHT = 800;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.6)); // Balanced quality/size
      };
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const result = reader.result as string;
        // Basic check to avoid compressing tiny icons or already compressed strings if needed
        // but generally we want to ensure everything is within limits
        const compressed = await compressImage(result);
        setCurrentPackage(prev => ({ ...prev, image: compressed }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleExport = () => {
    const blob = new Blob([JSON.stringify(packages, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `winnies_flowers_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        try {
          const data = JSON.parse(ev.target?.result as string);
          if (Array.isArray(data)) {
            setPackages(data);
            alert('Import successful!');
          }
        } catch (e) {
          alert('Invalid JSON file');
        }
      };
      reader.readAsText(file);
    }
  };

  const handleBulkAction = (action: 'availability' | 'category' | 'delete', value?: string) => {
    if (selectedPackageIds.length === 0) return;

    if (action === 'delete') {
      if (confirm(`Are you sure you want to delete these ${selectedPackageIds.length} selected packages?`)) {
        setPackages(prev => prev.filter(p => !selectedPackageIds.includes(p.id)));
        setSelectedPackageIds([]);
      }
      return;
    }

    setPackages(prev => prev.map(p => {
      if (selectedPackageIds.includes(p.id)) {
        if (action === 'availability') return { ...p, isAvailable: !p.isAvailable };
        if (action === 'category' && value) return { ...p, category: value };
      }
      return p;
    }));
    
    if (action !== 'availability') {
      setSelectedPackageIds([]);
    }
  };

  const togglePackageSelection = (id: string) => {
    setSelectedPackageIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handlePackageOrder = (pkg: Package) => {
    const message = `Hello Winnie’s Flowers, I would like to order/enquire about:
*Package:* ${pkg.name}
*Category:* ${pkg.category}
*Price:* ${pkg.price}

I saw this on your website and I'm interested in placing an order!`;
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${PHONE_NUMBER.replace(/\+/g, '')}?text=${encodedMessage}`, '_blank');
  };

  const [formData, setFormData] = useState({
    name: '',
    whatsapp: '',
    occasion: '',
    packageType: '',
    colors: '',
    budget: '',
    deliveryType: 'Collection',
    message: ''
  });

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleWhatsAppOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const message = `Hello Winnie's Flowers! I would like to place an order:
    
*Name:* ${formData.name}
*WhatsApp:* ${formData.whatsapp}
*Occasion:* ${formData.occasion}
*Package Type:* ${formData.packageType}
*Preferred Colors:* ${formData.colors}
*Budget Range:* ${formData.budget}
*Type:* ${formData.deliveryType}
*Special Request:* ${formData.message}`;

    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${PHONE_NUMBER.replace(/\+/g, '')}?text=${encodedMessage}`, '_blank');
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
    setIsNavOpen(false);
  };

  const readyPackages: Package[] = POPULAR_PACKAGES.map(pkg => ({
    ...pkg,
    isAvailable: true,
    isFeatured: true,
    showInGallery: true
  }));

  const galleryItems = [
    ...readyPackages,
    ...GALLERY_IMAGES.map((img, i) => ({ id: `gal_${i}`, image: img }))
  ].filter((item, index, allItems) => {
    const image = 'image' in item ? item.image : item;
    return allItems.findIndex(candidate => {
      const candidateImage = 'image' in candidate ? candidate.image : candidate;
      return candidateImage === image;
    }) === index;
  });

  return (
    <div className="min-h-screen text-gray-900 bg-white selection:bg-brand-red selection:text-white">
      {/* Navigation */}
      <nav 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? 'bg-white shadow-sm py-3' : 'bg-transparent py-5'
        }`}
      >
        <div className="container mx-auto px-6 lg:px-10 flex items-center justify-between">
            <div 
              className="flex items-center cursor-pointer group" 
              onClick={() => scrollToSection('home')}
            >
              <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center p-2 mr-3 shadow-lg shadow-brand-red/5 group-hover:scale-105 transition-transform overflow-hidden border border-gray-100 flex-shrink-0">
                <img 
                  src={LOGO_MAIN} 
                  alt={`${BUSINESS_NAME} Logo`}
                  onError={handleImageError}
                  className="max-w-full max-h-full object-contain"
                />
              </div>
              <span className="text-2xl font-bold font-serif tracking-tight text-brand-red hidden sm:block">
                Winnie's Flowers
              </span>
            </div>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-8">
            {['Home', 'Bouquets', 'Hampers', 'Weddings'].map((item) => (
              <button 
                key={item}
                onClick={() => scrollToSection(item.toLowerCase())}
                className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 hover:text-brand-red transition-colors"
              >
                {item}
              </button>
            ))}
            <button 
              onClick={() => isAdminLoggedIn ? setIsAdminLoggedIn(false) : setShowAdminLogin(true)}
              className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 hover:text-brand-red transition-colors"
            >
              {isAdminLoggedIn ? 'Logout' : 'Admin'}
            </button>
            <a 
              href={`https://wa.me/${PHONE_NUMBER.replace(/\+/g, '')}`}
              target="_blank"
              rel="noreferrer"
              className="bg-brand-red text-white px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-tight hover:bg-brand-red-dark transition-all shadow-lg shadow-brand-red/10"
            >
              Order on WhatsApp
            </a>
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            className="lg:hidden p-2 text-gray-900"
            onClick={() => setIsNavOpen(!isNavOpen)}
          >
            {isNavOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile Nav Menu */}
      <AnimatePresence>
        {isNavOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-white pt-24 px-6 lg:hidden"
          >
            <div className="flex flex-col space-y-6 text-center">
              {['Home', 'Bouquets', 'Hampers', 'Weddings', 'Gallery', 'Contact'].map((item) => (
                <button 
                  key={item}
                  onClick={() => scrollToSection(item.toLowerCase())}
                  className="text-2xl font-serif font-semibold text-gray-900 hover:text-brand-red"
                >
                  {item}
                </button>
              ))}
              <a 
                href={`https://wa.me/${PHONE_NUMBER.replace(/\+/g, '')}`}
                target="_blank"
                rel="noreferrer"
                className="bg-brand-red text-white px-8 py-4 rounded-full text-lg font-bold hover:bg-brand-red-dark transition-all flex items-center justify-center mx-auto w-full shadow-xl shadow-brand-red/20"
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                Order on WhatsApp
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main>
        {/* Admin Login Modal */}
        <AnimatePresence>
          {showAdminLogin && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 pb-24 lg:pb-6">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={() => setShowAdminLogin(false)}
              />
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="relative bg-white w-full max-w-md rounded-[2.5rem] p-10 shadow-2xl"
              >
                <div className="text-center mb-8">
                  <div className="w-20 h-20 bg-brand-red/10 rounded-3xl flex items-center justify-center mx-auto mb-6">
                    <Flower className="text-brand-red w-10 h-10" />
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">Admin Login</h2>
                  <p className="text-gray-500">Enter password to manage packages</p>
                </div>
                <form onSubmit={handleAdminLogin} className="space-y-6">
                  <input 
                    type="password"
                    placeholder="Winnie123"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    className="w-full px-6 py-4 rounded-2xl bg-gray-50 border border-gray-100 focus:outline-none focus:ring-2 focus:ring-brand-red/50 transition-all font-mono"
                    autoFocus
                  />
                  <button 
                    type="submit"
                    className="w-full bg-gray-900 text-white font-bold py-5 rounded-2xl shadow-xl hover:bg-brand-red transition-all"
                  >
                    Enter Dashboard
                  </button>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Admin Dashboard */}
        {isAdminLoggedIn && (
          <section id="admin" className="py-24 bg-gray-50 border-b border-gray-200">
            <div className="container mx-auto px-6">
              <div className="flex flex-col lg:flex-row justify-between items-end mb-12 gap-6">
                <div>
                  <span className="text-brand-red font-bold tracking-[0.3em] uppercase text-[10px] mb-4 block underline decoration-brand-red/30 underline-offset-4">Owner Panel</span>
                  <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 tracking-tight">Admin <span className="text-brand-red italic opacity-80">Dashboard</span></h2>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  {selectedPackageIds.length > 0 && (
                    <div className="flex items-center gap-2 bg-brand-red/5 p-2 rounded-2xl border border-brand-red/10 mr-4">
                      <span className="text-[10px] font-bold text-brand-red uppercase px-3">{selectedPackageIds.length} Selected</span>
                      <select 
                        onChange={(e) => handleBulkAction('category', e.target.value)}
                        className="bg-white border border-gray-100 text-[10px] font-bold px-3 py-2 rounded-xl focus:outline-none"
                      >
                        <option value="">Move Category</option>
                        {PACKAGE_CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                      </select>
                      <button 
                        onClick={() => handleBulkAction('availability')}
                        className="bg-white border border-gray-100 text-[10px] font-bold px-4 py-2 rounded-xl hover:bg-gray-50"
                      >
                        Toggle Stock
                      </button>
                      <button 
                        onClick={() => handleBulkAction('delete')}
                        className="bg-white border border-red-100 text-red-500 text-[10px] font-bold px-4 py-2 rounded-xl hover:bg-red-50"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                  <button 
                    onClick={() => {
                      if (selectedPackageIds.length === packages.length) setSelectedPackageIds([]);
                      else setSelectedPackageIds(packages.map(p => p.id));
                    }}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-600 px-6 py-3 rounded-xl font-bold text-xs transition-colors border border-gray-200"
                  >
                    {selectedPackageIds.length === packages.length ? 'Deselect All' : 'Select All'}
                  </button>
                  <label className="bg-gray-100 hover:bg-gray-200 text-gray-600 px-6 py-3 rounded-xl font-bold text-xs cursor-pointer transition-colors border border-gray-200">
                    Import Backup
                    <input type="file" hidden accept=".json" onChange={handleImport} />
                  </label>
                  <button 
                    onClick={handleExport}
                    className="bg-white hover:bg-gray-50 text-gray-900 px-6 py-3 rounded-xl font-bold text-xs shadow-sm border border-gray-100 transition-colors"
                  >
                    Export Backup
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-[2.5rem] p-8 lg:p-12 shadow-xl border border-gray-100 mb-12">
                <h3 className="text-xl font-bold mb-8 flex items-center gap-2">
                  <span className="w-1.5 h-6 bg-brand-red rounded-full"></span>
                  {isEditing ? 'Edit Package' : 'Add New Package'}
                </h3>
                <form onSubmit={handleSavePackage} className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                  {/* Image Upload Column */}
                  <div className="lg:col-span-1">
                    <div className="aspect-square rounded-3xl bg-gray-50 border-2 border-dashed border-gray-200 overflow-hidden relative group">
                      {currentPackage.image ? (
                        <>
                          <img src={currentPackage.image} className="w-full h-full object-cover" alt="Preview" />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <span className="text-white font-bold text-xs">Replace Image</span>
                          </div>
                        </>
                      ) : (
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400">
                          <Camera className="w-12 h-12 mb-4 opacity-50" />
                          <span className="text-xs font-bold">Primary Photo</span>
                        </div>
                      )}
                      <input 
                        type="file" 
                        accept="image/*"
                        className="absolute inset-0 opacity-0 cursor-pointer" 
                        onChange={handleImageUpload}
                      />
                    </div>
                    <p className="mt-4 text-[10px] text-gray-400 text-center uppercase tracking-widest font-bold">JPG, PNG or WEBP from device</p>
                  </div>

                  {/* Details Column */}
                  <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="sm:col-span-2">
                      <label className="text-[10px] font-bold text-gray-400 uppercase ml-1 mb-2 block">Package Name</label>
                      <input 
                        type="text"
                        placeholder="e.g. Premium Money Bouquet"
                        value={currentPackage.name}
                        onChange={(e) => setCurrentPackage(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full px-6 py-4 rounded-xl bg-gray-50 border border-transparent focus:bg-white focus:border-brand-red/30 transition-all font-medium"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-gray-400 uppercase ml-1 mb-2 block">Category</label>
                      <select 
                        value={currentPackage.category}
                        onChange={(e) => setCurrentPackage(prev => ({ ...prev, category: e.target.value }))}
                        className="w-full px-6 py-4 rounded-xl bg-gray-50 border border-transparent focus:bg-white focus:border-brand-red/30 transition-all font-medium appearance-none"
                      >
                        {PACKAGE_CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                      </select>
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-gray-400 uppercase ml-1 mb-2 block">Price Tag</label>
                      <input 
                        type="text"
                        placeholder="Custom / $25"
                        value={currentPackage.price}
                        onChange={(e) => setCurrentPackage(prev => ({ ...prev, price: e.target.value }))}
                        className="w-full px-6 py-4 rounded-xl bg-gray-50 border border-transparent focus:bg-white focus:border-brand-red/30 transition-all font-medium"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="text-[10px] font-bold text-gray-400 uppercase ml-1 mb-2 block">Description</label>
                      <textarea 
                        rows={3}
                        placeholder="Detail about the products included..."
                        value={currentPackage.description}
                        onChange={(e) => setCurrentPackage(prev => ({ ...prev, description: e.target.value }))}
                        className="w-full px-6 py-4 rounded-xl bg-gray-50 border border-transparent focus:bg-white focus:border-brand-red/30 transition-all font-medium"
                      />
                    </div>

                    <div className="flex items-center gap-6 py-4">
                      <label className="flex items-center gap-3 cursor-pointer group">
                        <input 
                          type="checkbox"
                          checked={currentPackage.isFeatured}
                          onChange={(e) => setCurrentPackage(prev => ({ ...prev, isFeatured: e.target.checked }))}
                          className="w-5 h-5 rounded border-gray-300 text-brand-red focus:ring-brand-red"
                        />
                        <span className="text-xs font-bold text-gray-600 group-hover:text-brand-red transition-colors">Featured Pick</span>
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer group">
                        <input 
                          type="checkbox"
                          checked={currentPackage.showInGallery}
                          onChange={(e) => setCurrentPackage(prev => ({ ...prev, showInGallery: e.target.checked }))}
                          className="w-5 h-5 rounded border-gray-300 text-brand-red focus:ring-brand-red"
                        />
                        <span className="text-xs font-bold text-gray-600 group-hover:text-brand-red transition-colors">Show in Gallery</span>
                      </label>
                    </div>

                    <div className="sm:col-span-2 flex gap-4 mt-4">
                      <button 
                        type="submit"
                        className="flex-1 bg-gray-900 text-white py-5 rounded-2xl font-bold hover:bg-brand-red transition-all shadow-lg"
                      >
                        {isEditing ? 'Update Package' : 'Save Package'}
                      </button>
                      {isEditing && (
                        <button 
                          type="button"
                          onClick={() => {
                            setIsEditing(false);
                            setCurrentPackage({
                              name: '',
                              category: PACKAGE_CATEGORIES[0],
                              description: '',
                              price: 'Custom',
                              image: '',
                              isAvailable: true,
                              isFeatured: false,
                              showInGallery: true
                            });
                          }}
                          className="px-8 border border-gray-200 text-gray-400 hover:text-gray-900 rounded-2xl font-bold transition-all"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>
                </form>
              </div>

              {/* Package List Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {packages.map(pkg => (
                  <div 
                    key={pkg.id} 
                    className={`bg-white rounded-3xl p-6 border transition-all flex flex-col group relative ${
                      selectedPackageIds.includes(pkg.id) ? 'border-brand-red ring-4 ring-brand-red/5' : 'border-gray-100 shadow-sm'
                    }`}
                  >
                    <div className="absolute top-4 right-4 z-10">
                      <input 
                        type="checkbox"
                        checked={selectedPackageIds.includes(pkg.id)}
                        onChange={() => togglePackageSelection(pkg.id)}
                        className="w-5 h-5 rounded border-gray-300 text-brand-red focus:ring-brand-red cursor-pointer"
                      />
                    </div>
                    <div className="aspect-square rounded-2xl overflow-hidden mb-5">
                      <img src={pkg.image} className="w-full h-full object-cover grayscale-[0.5] group-hover:grayscale-0 transition-all duration-700" alt={pkg.name} />
                    </div>
                    <div className="flex-grow">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[8px] font-bold uppercase tracking-[0.2em] text-brand-red bg-brand-red/10 px-2 py-0.5 rounded-md leading-none">{pkg.category}</span>
                        <div className="flex items-center gap-1">
                          {!pkg.isAvailable && <span className="text-[8px] font-bold uppercase text-gray-400 bg-gray-100 px-2 py-0.5 rounded-md">Out of Stock</span>}
                          {pkg.isFeatured && <Star className="w-3 h-3 text-brand-red fill-current" />}
                        </div>
                      </div>
                      <h4 className="font-bold text-lg leading-tight mb-2 truncate">{pkg.name}</h4>
                      <p className="text-xs text-gray-400 line-clamp-2 italic">{pkg.description}</p>
                    </div>
                    <div className="flex items-center gap-2 mt-6 pt-6 border-t border-gray-50">
                      <button 
                        onClick={() => {
                          setCurrentPackage(pkg);
                          setIsEditing(true);
                          window.scrollTo({ top: document.getElementById('admin')?.offsetTop || 0, behavior: 'smooth' });
                        }}
                        className="flex-1 bg-gray-50 py-3 rounded-xl text-[10px] font-bold uppercase hover:bg-gray-100 transition-colors"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => {
                          if (confirm('Delete this package permanently?')) {
                            setPackages(prev => prev.filter(p => p.id !== pkg.id));
                          }
                        }}
                        className="flex-1 bg-white border border-gray-100 py-3 rounded-xl text-[10px] font-bold uppercase text-gray-300 hover:text-brand-red hover:border-brand-red transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Architectural Hero Section */}
        <section id="home" className="relative min-h-screen flex flex-col lg:flex-row overflow-hidden pt-24 lg:pt-28">
          {/* Left Content Column (7/12) */}
          <div className="w-full lg:w-7/12 bg-gray-50 flex flex-col justify-center px-6 lg:px-16 py-12 lg:py-16 relative overflow-hidden">
            {/* Hero Background Image - Logo Watermark */}
            <div className="absolute inset-0 z-0">
              <img 
                src={HERO_IMAGE} 
                onError={handleImageError}
                className="w-full h-full object-cover opacity-[0.15]"
                alt="Winnie's Flowers Logo Background"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-gray-50 via-gray-50/80 to-transparent"></div>
            </div>

            <div className="accent-circle -top-20 -left-20 w-80 h-80 bg-brand-red/10"></div>
            <div className="accent-circle bottom-10 right-10 w-64 h-64 bg-brand-red/5"></div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="relative z-10"
            >
              {/* Hero Logo */}
              <div className="mb-8 w-32 h-32 lg:w-40 lg:h-40 bg-white rounded-3xl p-5 shadow-2xl shadow-brand-red/10 border border-gray-100 flex items-center justify-center overflow-hidden rotate-3 hover:rotate-0 transition-transform duration-500 flex-shrink-0">
                <img 
                  src={LOGO_MAIN}
                  alt={`${BUSINESS_NAME} Logo`}
                  onError={handleImageError}
                  className="max-w-full max-h-full object-contain scale-110"
                />
              </div>

              <h1 className="text-5xl lg:text-7xl font-bold leading-tight text-gray-900 mb-6 italic lg:not-italic">
                Beautiful <br/>
                <span className="text-brand-red italic block lg:inline">Bouquets</span> <br className="hidden lg:block"/>
                & Events
              </h1>
              <p className="text-lg lg:text-xl text-gray-600 max-w-lg mb-8 leading-relaxed">
                Real bouquets, chocolate boxes, money arrangements, and gift combos from the Winnie&apos;s Flowers collection <span className="text-brand-red font-serif italic">born to make you happy.</span>
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <button 
                  onClick={() => scrollToSection('bouquets')}
                  className="bg-brand-red text-white px-8 py-4 rounded-lg font-bold text-lg shadow-xl shadow-brand-red/20 hover:bg-brand-red-dark transition-all"
                >
                  View Packages
                </button>
                <button 
                  onClick={() => scrollToSection('about')}
                  className="border-2 border-brand-red text-brand-red px-8 py-4 rounded-lg font-bold text-lg hover:bg-brand-red/5 transition-all"
                >
                  Our Story
                </button>
              </div>

              {/* Stats/Info Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                <div className="flex flex-col border-l-2 border-brand-red pl-4">
                  <span className="text-[10px] uppercase tracking-widest text-gray-400 mb-1 font-bold">Location</span>
                  <span className="text-sm font-semibold text-gray-800">Bulawayo,<br/> Nola Bldg Basement</span>
                </div>
                <div className="flex flex-col border-l-2 border-brand-red pl-4">
                  <span className="text-[10px] uppercase tracking-widest text-gray-400 mb-1 font-bold">Hours</span>
                  <span className="text-sm font-semibold text-gray-800">Mon - Sat<br/> 08:00 - 17:30</span>
                </div>
                <div className="flex flex-col border-l-2 border-brand-red pl-4">
                  <span className="text-[10px] uppercase tracking-widest text-gray-400 mb-1 font-bold">Contact</span>
                  <span className="text-sm font-semibold text-gray-800">+263 77 234 9508<br/> WhatsApp Ready</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Column (5/12) - Interaction Panel */}
          <div className="w-full lg:w-5/12 bg-white flex flex-col justify-between px-6 lg:px-12 py-12 lg:py-16">
            <div className="mb-12">
              <h3 className="text-xs font-bold uppercase tracking-widest text-brand-red mb-8 flex items-center gap-2">
                <span className="w-8 h-px bg-brand-red"></span>
                Build Your Package
              </h3>
              
              <form onSubmit={handleWhatsAppOrder} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1 ml-1">Full Name</label>
                    <input 
                      required
                      type="text" 
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Jane" 
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1 ml-1">WhatsApp Number</label>
                    <input 
                      required
                      type="tel" 
                      name="whatsapp"
                      value={formData.whatsapp}
                      onChange={handleInputChange}
                      placeholder="+263..." 
                      className="input-field"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1 ml-1">Occasion</label>
                    <select 
                      name="occasion"
                      value={formData.occasion}
                      onChange={handleInputChange}
                      className="input-field"
                    >
                      {OCCASIONS.map(occ => <option key={occ} value={occ}>{occ}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1 ml-1">Package Type</label>
                    <select 
                      name="packageType"
                      value={formData.packageType}
                      onChange={handleInputChange}
                      className="input-field"
                    >
                      {PACKAGE_CATEGORIES.map(pkg => <option key={pkg} value={pkg}>{pkg}</option>)}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1 ml-1">Budget</label>
                    <select 
                      name="budget"
                      value={formData.budget}
                      onChange={handleInputChange}
                      className="input-field"
                    >
                      {BUDGETS.map(budget => <option key={budget} value={budget}>{budget}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1 ml-1">Delivery</label>
                    <select 
                      name="deliveryType"
                      value={formData.deliveryType}
                      onChange={handleInputChange}
                      className="input-field"
                    >
                      <option value="Collection">Collection</option>
                      <option value="Delivery">Delivery</option>
                    </select>
                  </div>
                </div>

                <button 
                  type="submit"
                  className="w-full bg-green-600 text-white font-bold py-4 rounded-xl text-sm shadow-lg shadow-green-200 hover:bg-green-700 transition-all flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  Send Request on WhatsApp
                </button>
              </form>
            </div>

            <div>
              <h3 className="text-xs font-bold uppercase tracking-widest text-brand-red mb-6">Our Specialties</h3>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { icon: Flower, label: 'Flowers' },
                  { icon: CircleDollarSign, label: 'Money' },
                  { icon: Gift, label: 'Choco' },
                  { icon: Heart, label: 'Candy' },
                  { icon: Star, label: 'Hamper' },
                  { icon: Camera, label: 'Wedding' }
                ].map((item, i) => (
                  <div key={i} className="bg-gray-50 border border-gray-100 p-4 rounded-2xl text-center group hover:border-brand-red transition-colors cursor-default">
                    <item.icon className="w-6 h-6 mx-auto mb-2 text-brand-red group-hover:scale-110 transition-transform" />
                    <span className="text-[10px] font-bold uppercase text-gray-500 group-hover:text-brand-red transition-colors">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="py-24 bg-white relative">
          <div className="container mx-auto px-6">
            <div className="flex flex-col lg:flex-row items-center gap-16">
              <motion.div 
                whileInView={{ opacity: 1, x: 0 }}
                initial={{ opacity: 0, x: -30 }}
                className="lg:w-1/2"
              >
                <div className="grid grid-cols-2 gap-4">
                  <img 
                    src={IMG_ABOUT_1} 
                    loading="lazy"
                    decoding="async"
                    onError={handleImageError}
                    className="w-full h-64 object-cover rounded-2xl shadow-lg mt-12" 
                    alt="Rose detail"
                  />
                  <img 
                    src={IMG_ABOUT_2} 
                    loading="lazy"
                    decoding="async"
                    onError={handleImageError}
                    className="w-full h-80 object-cover rounded-2xl shadow-lg" 
                    alt="Bouquet arrangement"
                  />
                </div>
              </motion.div>
              <motion.div 
                whileInView={{ opacity: 1, x: 0 }}
                initial={{ opacity: 0, x: 30 }}
                className="lg:w-1/2"
              >
                <h2 className="text-4xl lg:text-5xl font-bold mb-8 text-gray-900 leading-tight">
                  Crafting Smiles with <span className="text-brand-red">Every Petal</span>
                </h2>
                <p className="text-lg text-gray-600 mb-8 leading-relaxed italic">
                  "At Winnie’s Flowers, we help you celebrate life’s special moments with beautifully arranged flowers, custom bouquets, candy hampers, chocolate gifts, and wedding floral arrangements."
                </p>
                <p className="text-gray-600 mb-8 leading-relaxed">
                  Whether it’s a birthday, anniversary, wedding, Valentine’s gift, or a surprise for someone special, we create packages designed to impress. Our goal is to bring your vision to life through creative design and meticulous attention to detail.
                </p>
                <div className="grid grid-cols-2 gap-6 mb-10">
                  <div className="flex items-center p-4 bg-white rounded-xl shadow-sm border border-gray-100">
                    <div className="w-10 h-10 bg-brand-red/10 rounded-full flex items-center justify-center text-brand-red mr-3">
                      <Clock className="w-5 h-5" />
                    </div>
                    <span className="font-semibold text-sm">Quick Turnaround</span>
                  </div>
                  <div className="flex items-center p-4 bg-white rounded-xl shadow-sm border border-gray-100">
                    <div className="w-10 h-10 bg-brand-red/10 rounded-full flex items-center justify-center text-brand-red mr-3">
                      <Heart className="w-5 h-5" />
                    </div>
                    <span className="font-semibold text-sm">Made with Love</span>
                  </div>
                </div>
            <button 
              onClick={() => scrollToSection('home')}
              className="text-brand-red font-bold flex items-center hover:translate-x-2 transition-transform group"
            >
              Start Your Custom Order 
              <ChevronRight className="w-5 h-5 ml-2 group-hover:ml-3 transition-all" />
            </button>
              </motion.div>
            </div>
          </div>
        </section>

        {/* What We Offer Section */}
        <section id="bouquets" className="py-24 bg-white relative">
          <div className="container mx-auto px-6 text-center mb-20">
            <span className="text-brand-red font-bold tracking-[0.3em] uppercase text-[10px] mb-4 block">Handcrafted Excellence</span>
            <h2 className="text-5xl lg:text-7xl bold-heading mb-6">What We <span className="text-brand-red italic">Offer</span></h2>
            <div className="w-24 h-1 bg-brand-red mx-auto"></div>
          </div>

          <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {CATEGORIES.map((category, index) => {
              const pkgForCat = readyPackages.find(p => p.category === category.title);
              
              return (
                <motion.div 
                  key={category.title}
                  whileInView={{ opacity: 1, y: 0 }}
                  initial={{ opacity: 0, y: 30 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ 
                    duration: 0.8,
                    delay: index * 0.1,
                    ease: [0.21, 0.47, 0.32, 0.98]
                  }}
                  className="group flex flex-col"
                >
                  <div className="h-80 overflow-hidden relative rounded-2xl mb-6 shadow-xl shadow-gray-200">
                    <motion.img 
                      whileInView={{ scale: 1 }}
                      initial={{ scale: 1.15 }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                      viewport={{ once: true }}
                      src={category.image || FALLBACK_BOUQUET} 
                      loading="lazy"
                      decoding="async"
                      onError={handleImageError}
                      alt={category.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity"></div>
                    {pkgForCat?.price && pkgForCat.price !== 'Custom' && (
                      <div className="absolute top-5 right-5 bg-white text-brand-red px-4 py-1.5 rounded-full text-xs font-black shadow-xl">
                        From {pkgForCat.price}
                      </div>
                    )}
                    <div className="absolute bottom-6 left-6 p-1 rounded-full bg-white/20 backdrop-blur-md shadow-lg text-white">
                      <category.icon className="w-8 h-8 m-2" />
                    </div>
                  </div>
                  <h3 className="text-3xl font-bold mb-3 tracking-tight group-hover:text-brand-red transition-colors">{category.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed mb-6 font-medium">
                    {category.description}
                  </p>
                  <button 
                    onClick={() => {
                      setFormData(prev => ({ ...prev, packageType: category.title }));
                      scrollToSection('home'); 
                    }}
                    className="text-brand-red font-bold text-xs tracking-widest uppercase flex items-center group-hover:gap-2 transition-all"
                  >
                    Configure This Package <ChevronRight className="w-4 h-4 ml-1" />
                  </button>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* Popular Packages */}
        <section id="hampers" className="py-32 bg-gray-900 text-white overflow-hidden relative">
          <div className="container mx-auto px-6 relative z-10">
            <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
              <div className="text-left">
                <span className="text-brand-red font-bold tracking-[0.3em] uppercase text-[10px] mb-4 block">Priced Favorites</span>
                <h2 className="text-5xl lg:text-7xl bold-heading mb-6">Ready <span className="text-brand-red italic">Packages</span></h2>
                <div className="w-24 h-1 bg-brand-red"></div>
              </div>
              <button 
                onClick={() => scrollToSection('gallery')}
                className="group border border-white/20 text-white px-10 py-4 rounded-full hover:bg-white hover:text-gray-900 transition-all font-bold text-sm flex items-center"
              >
                View Gallery <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
              {readyPackages.map((pkg) => (
                <motion.div 
                  key={pkg.id}
                  whileInView={{ opacity: 1, y: 0 }}
                  initial={{ opacity: 0, y: 30 }}
                  className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl overflow-hidden flex flex-col group hover:bg-white/10 transition-colors"
                >
                  <div className="relative h-80 overflow-hidden">
                    <img 
                      src={pkg.image} 
                      loading="lazy"
                      decoding="async"
                      onError={handleImageError}
                      alt={pkg.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                    />
                    <div className="absolute top-6 right-6 bg-brand-red text-white px-5 py-1.5 rounded-full text-xs font-bold shadow-2xl">
                      {pkg.price}
                    </div>
                  </div>
                  <div className="p-10 flex flex-col flex-grow">
                    <h3 className="text-2xl font-bold mb-3">{pkg.name}</h3>
                    <p className="text-gray-400 text-sm mb-10 leading-relaxed italic">{pkg.description}</p>
                    <button 
                      onClick={() => handlePackageOrder(pkg)}
                      className="w-full bg-white text-gray-900 py-4 rounded-xl font-bold hover:bg-brand-red hover:text-white transition-all shadow-xl shadow-white/5 active:scale-95"
                    >
                      Quick Order
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
          {/* Decorative gradients */}
          <div className="absolute top-0 right-0 w-1/2 h-full bg-brand-red/5 blur-[120px] pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-1/3 h-1/2 bg-brand-red/5 blur-[120px] pointer-events-none"></div>
        </section>

        {/* Gallery Section */}
        <section id="gallery" className="py-32 bg-white">
          <div className="container mx-auto px-6 text-center mb-20">
            <span className="text-brand-red font-bold tracking-[0.3em] uppercase text-[10px] mb-4 block">Our Portfolio</span>
            <h2 className="text-5xl lg:text-7xl bold-heading mb-6">Floral <span className="text-brand-red italic">Gallery</span></h2>
            <div className="w-24 h-1 bg-brand-red mx-auto"></div>
          </div>
          
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {galleryItems.map((item, i) => (
                <motion.div 
                  key={i}
                  whileInView={{ opacity: 1, y: 0 }}
                  initial={{ opacity: 0, y: 20 }}
                  transition={{ delay: i * 0.05 }}
                  className={`relative cursor-pointer overflow-hidden rounded-2xl group ${
                    i === 1 || i === 4 ? 'md:row-span-2' : ''
                  }`}
                  onClick={() => {
                    if ('name' in item) {
                       handlePackageOrder(item as Package);
                    }
                  }}
                >
                  <img 
                    src={('image' in item ? item.image : item) as string} 
                    loading="lazy"
                    decoding="async"
                    onError={handleImageError}
                    alt={`Gallery ${i}`}
                    className="w-full h-full object-cover aspect-square md:aspect-auto md:h-full transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-brand-red/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    {'name' in item ? (
                      <div className="text-white text-center p-4">
                        <p className="font-bold text-sm uppercase mb-1">{(item as Package).name}</p>
                        <p className="text-[8px] font-bold tracking-widest opacity-80 uppercase">Order Now</p>
                      </div>
                    ) : (
                      <ExternalLink className="text-white w-8 h-8" />
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Weddings & Events Section */}
        <section id="weddings" className="relative py-40 bg-white overflow-hidden group">
          <div className="container mx-auto px-6 relative z-10">
            <div className="flex flex-col lg:flex-row items-center gap-20">
              <div className="lg:w-12/25">
                <span className="text-brand-red font-bold tracking-[0.3em] uppercase text-[10px] mb-6 block">Memorable Moments</span>
                <h2 className="text-6xl lg:text-8xl bold-heading mb-10 leading-tight">Events & <span className="text-brand-red italic">Special</span> Days</h2>
                <p className="text-xl text-gray-600 mb-12 leading-relaxed italic max-w-xl">
                  "From grand weddings and corporate events to respectful funeral tributes, Winnie’s Flowers provides curated floral artistry for every milestone."
                </p>
                <div className="flex flex-wrap gap-4">
                  <button 
                    onClick={() => {
                      setFormData(prev => ({ 
                        ...prev, 
                        occasion: 'Wedding', 
                        packageType: 'Wedding Flowers' 
                      }));
                      scrollToSection('home');
                    }}
                    className="bg-brand-red text-white px-10 py-5 rounded-lg font-bold text-lg hover:bg-brand-red-dark transition-all shadow-2xl shadow-brand-red/30 inline-flex items-center group-hover:scale-105"
                  >
                    Weddings & Events
                    <ChevronRight className="w-5 h-5 ml-2" />
                  </button>
                  <button 
                    onClick={() => {
                      setFormData(prev => ({ 
                        ...prev, 
                        occasion: 'Funeral', 
                        packageType: 'Funeral Tributes' 
                      }));
                      scrollToSection('home');
                    }}
                    className="border-2 border-gray-200 text-gray-900 px-10 py-5 rounded-lg font-bold text-lg hover:border-brand-red hover:text-brand-red transition-all inline-flex items-center"
                  >
                    Funeral Flowers
                  </button>
                </div>
              </div>
              <div className="lg:w-13/25 relative">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <img src={IMG_WEDDING_1} loading="lazy" decoding="async" onError={handleImageError} className="rounded-2xl shadow-2xl w-full h-full object-cover" alt="Bridal prep" />
                    <img src={IMG_WEDDING_2} loading="lazy" decoding="async" onError={handleImageError} className="rounded-2xl shadow-2xl w-full h-full object-cover" alt="Wedding bouquet" />
                  </div>
                  <div className="pt-12 space-y-4">
                    <img src={IMG_WEDDING_3} loading="lazy" decoding="async" onError={handleImageError} className="rounded-2xl shadow-2xl w-full h-full object-cover" alt="Ceremony decor" />
                    <img src={IMG_WEDDING_4} loading="lazy" decoding="async" onError={handleImageError} className="rounded-2xl shadow-2xl w-full h-full object-cover" alt="Reception flowers" />
                  </div>
                </div>
                {/* Architectural background lines */}
                <div className="absolute -z-10 top-0 right-0 w-64 h-64 border-t-2 border-r-2 border-brand-red/10 rounded-tr-[4rem]"></div>
              </div>
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="py-24 bg-gray-50">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
              {TRUST_CARDS.map((card, i) => (
                <motion.div 
                  key={i}
                  whileInView={{ opacity: 1, y: 0 }}
                  initial={{ opacity: 0, y: 20 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex flex-col items-center text-center group"
                >
                  <div className="w-16 h-16 bg-white border border-gray-100 rounded-full flex items-center justify-center text-brand-red mb-6 group-hover:bg-brand-red group-hover:text-white transition-all shadow-sm">
                    <card.icon className="w-8 h-8" />
                  </div>
                  <h4 className="font-bold text-gray-900 max-w-[150px] uppercase text-[10px] tracking-widest leading-relaxed">{card.title}</h4>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Order Section (Form) */}
        <section id="order" className="py-24 bg-gray-50">
          <div className="container mx-auto px-6">
            <div className="max-w-5xl mx-auto bg-white rounded-[2rem] shadow-2xl overflow-hidden border border-gray-100 flex flex-col lg:flex-row">
              <div className="lg:w-1/3 bg-brand-red p-12 text-white flex flex-col justify-between relative overflow-hidden">
                <div className="relative z-10">
                  <h2 className="text-4xl font-bold mb-6 italic">Build Your Package</h2>
                  <p className="text-white/80 mb-8 leading-relaxed">
                    Tell us your vision and we'll bring it to life. Fill in the details and we'll chat on WhatsApp!
                  </p>
                  <div className="space-y-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                        <Smartphone className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-xs text-white/60">Phone / WhatsApp</p>
                        <p className="font-bold text-lg">{PHONE_NUMBER}</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
                <div className="absolute top-20 right-0 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
              </div>

              <div className="lg:w-2/3 p-8 lg:p-12">
                <form onSubmit={handleWhatsAppOrder} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-400">Full Name</label>
                    <input 
                      required
                      type="text" 
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Jane Doe" 
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-red focus:border-transparent transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-400">WhatsApp Number</label>
                    <input 
                      required
                      type="tel" 
                      name="whatsapp"
                      value={formData.whatsapp}
                      onChange={handleInputChange}
                      placeholder="+263 ..." 
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-red focus:border-transparent transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-400">Occasion</label>
                    <select 
                      name="occasion"
                      value={formData.occasion}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-red focus:border-transparent transition-all appearance-none"
                    >
                      <option value="">Select Occasion</option>
                      {OCCASIONS.map(occ => <option key={occ} value={occ}>{occ}</option>)}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-400">Package Type</label>
                    <select 
                      name="packageType"
                      value={formData.packageType}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-red focus:border-transparent transition-all appearance-none"
                    >
                      <option value="">Select Package</option>
                      {PACKAGE_CATEGORIES.map(pkg => <option key={pkg} value={pkg}>{pkg}</option>)}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-400">Preferred Colors</label>
                    <select 
                      name="colors"
                      value={formData.colors}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-red focus:border-transparent transition-all appearance-none"
                    >
                      <option value="">Select Color</option>
                      {COLORS.map(color => <option key={color} value={color}>{color}</option>)}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-400">Budget Range</label>
                    <select 
                      name="budget"
                      value={formData.budget}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-red focus:border-transparent transition-all appearance-none"
                    >
                      <option value="">Select Budget</option>
                      {BUDGETS.map(budget => <option key={budget} value={budget}>{budget}</option>)}
                    </select>
                  </div>
                  <div className="md:col-span-2 space-y-2">
                     <label className="text-xs font-bold uppercase tracking-wider text-gray-400 block mb-2">Delivery / Collection</label>
                     <div className="flex space-x-4">
                        {['Collection', 'Delivery'].map((type) => (
                           <label key={type} className="flex-1 cursor-pointer">
                              <input 
                                 type="radio" 
                                 name="deliveryType" 
                                 value={type}
                                 checked={formData.deliveryType === type}
                                 onChange={handleInputChange}
                                 className="hidden peer"
                              />
                              <div className="text-center py-2 px-4 rounded-xl border border-gray-200 font-bold text-sm peer-checked:bg-brand-red peer-checked:text-white peer-checked:border-brand-red transition-all">
                                 {type}
                              </div>
                           </label>
                        ))}
                     </div>
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-400">Message / Special Request</label>
                    <textarea 
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      rows={3}
                      placeholder="Add any specific details or preferences here..." 
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-red focus:border-transparent transition-all"
                    ></textarea>
                  </div>
                  <div className="md:col-span-2">
                    <button 
                      type="submit"
                      className="w-full bg-brand-red text-white py-4 rounded-xl font-bold hover:bg-brand-red-dark transition-all flex items-center justify-center shadow-lg shadow-brand-red/20"
                    >
                      <Send className="w-5 h-5 mr-2" />
                      Send Order Request on WhatsApp
                    </button>
                    <p className="text-center text-gray-400 text-xs mt-4">
                      By clicking you will be redirected to WhatsApp to confirm your order.
                    </p>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-32 bg-white">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
              <div>
                <span className="text-brand-red font-bold tracking-[0.3em] uppercase text-[10px] mb-4 block">Get in touch</span>
                <h2 className="text-5xl lg:text-7xl bold-heading mb-10 italic">Visit Our <span className="text-brand-red">Studio</span></h2>
                <div className="space-y-10">
                  <div className="flex items-start space-x-6">
                    <div className="w-14 h-14 bg-gray-50 border border-gray-100 rounded-2xl flex items-center justify-center text-brand-red shrink-0">
                      <MapPin className="w-7 h-7" />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg mb-1 uppercase tracking-tight">Our Location</h4>
                      <p className="text-gray-500 leading-relaxed max-w-sm">Nola Building Basement, Between 8th & 9th Avenue, Bulawayo (Next to Booties Pharmacy)</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-6">
                    <div className="w-14 h-14 bg-gray-50 border border-gray-100 rounded-2xl flex items-center justify-center text-brand-red shrink-0">
                      <Phone className="w-7 h-7" />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg mb-1 uppercase tracking-tight">Call / WhatsApp</h4>
                      <p className="text-brand-red leading-relaxed text-2xl font-bold font-serif">{PHONE_NUMBER}</p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-16 flex flex-col sm:flex-row gap-4">
                  <a 
                    href={`tel:${PHONE_NUMBER}`}
                    className="flex-1 bg-white text-gray-900 border-2 border-gray-100 py-5 rounded-xl font-bold flex items-center justify-center hover:border-brand-red transition-all"
                  >
                    <Phone className="w-5 h-5 mr-3" />
                    Call Now
                  </a>
                  <a 
                    href={`https://wa.me/${PHONE_NUMBER.replace(/\+/g, '')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 bg-brand-red text-white py-5 rounded-xl font-bold flex items-center justify-center hover:bg-brand-red-dark transition-all shadow-xl shadow-brand-red/20"
                  >
                    <MessageCircle className="w-5 h-5 mr-3" />
                    WhatsApp Order
                  </a>
                </div>
              </div>
              <div className="rounded-[3rem] overflow-hidden h-[550px] shadow-[0_40px_100px_-15px_rgba(0,0,0,0.2)] relative group">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3732.162773229643!2d28.583!3d-20.150!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjDCsDA5JzAwLjAiUyAyOMKwMzUnMDAuMCJF!5e0!3m2!1sen!2szw!4v1620210000000!5m2!1sen!2szw" 
                  width="100%" 
                  height="100%" 
                  style={{ border: 0 }} 
                  allowFullScreen 
                  loading="lazy"
                  className="grayscale group-hover:grayscale-0 transition-all duration-1000"
                  title="Winnie's Flowers Location"
                ></iframe>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white pt-32 pb-12 border-t border-gray-100 relative overflow-hidden">
        <div className="accent-circle -bottom-20 -right-20 w-80 h-80 bg-brand-red/5"></div>
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-20 mb-24">
            <div className="lg:col-span-1">
              <div className="flex items-center mb-8">
                <div className="w-16 h-16 bg-white border border-gray-100 rounded-2xl flex items-center justify-center p-3 mr-3 shadow-xl shadow-brand-red/5 overflow-hidden flex-shrink-0">
                  <img 
                    src={LOGO_MAIN} 
                    loading="lazy"
                    decoding="async"
                    onError={handleImageError}
                    alt={`${BUSINESS_NAME} Logo`}
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
                <span className="text-3xl font-bold font-serif text-brand-red tracking-tight">{BUSINESS_NAME}</span>
              </div>
              <p className="text-gray-500 text-sm leading-relaxed mb-8 font-medium">
                Bulawayo's premium floral boutique specializing in bespoke bouquets and luxury gift hampers. 
              </p>
              <div className="flex space-x-6">
                <a href="#" className="text-gray-400 hover:text-brand-red transition-colors"><Instagram className="w-6 h-6" /></a>
                <a href="#" className="text-gray-400 hover:text-brand-red transition-colors"><Facebook className="w-6 h-6" /></a>
                <a href="#" className="text-gray-400 hover:text-brand-red transition-colors"><MessageCircle className="w-6 h-6" /></a>
              </div>
            </div>

            <div>
              <h4 className="font-bold text-gray-900 mb-8 uppercase text-[10px] tracking-[0.2em] decoration-brand-red decoration-2 underline-offset-8 underline">Explore</h4>
              <ul className="space-y-6 text-xs font-bold uppercase tracking-widest text-gray-400">
                {['Home', 'Bouquets', 'Hampers', 'Weddings', 'Gallery'].map(item => (
                  <li key={item}>
                    <button 
                      onClick={() => scrollToSection(item.toLowerCase())}
                      className="hover:text-brand-red transition-colors"
                    >
                      {item}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-gray-900 mb-8 uppercase text-[10px] tracking-[0.2em] decoration-brand-red decoration-2 underline-offset-8 underline">Connect</h4>
              <ul className="space-y-6 text-sm text-gray-500 font-medium">
                <li className="flex items-start">
                  <MapPin className="w-4 h-4 mr-3 text-brand-red shrink-0" />
                  {ADDRESS}
                </li>
                <li className="flex items-center text-lg font-bold text-gray-900 font-serif italic">
                  <Phone className="w-5 h-5 mr-3 text-brand-red" />
                  {PHONE_NUMBER}
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-5xl font-serif font-bold text-brand-red italic mb-8 leading-tight">Born to make you happy.</h4>
              <p className="text-gray-500 text-sm italic mb-10 leading-relaxed font-medium">
                Every arrangement is a promise of quality and creativity. Let us transform your emotions into floral art.
              </p>
              <button 
                onClick={() => scrollToSection('home')}
                className="w-full bg-gray-900 text-white px-8 py-4 rounded-lg hover:bg-brand-red transition-all font-bold text-xs uppercase tracking-widest shadow-2xl shadow-gray-900/10"
              >
                Inquire Now
              </button>
            </div>
          </div>
          
          <div className="pt-12 border-t border-gray-100 text-center">
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-300">
              &copy; {new Date().getFullYear()} {BUSINESS_NAME} &bull; Bulawayo &bull; Handmade with Heart
            </p>
          </div>
        </div>
      </footer>

      {/* Sticky WhatsApp Floating Button */}
      <motion.a 
        href={`https://wa.me/${PHONE_NUMBER.replace(/\+/g, '')}`}
        target="_blank"
        rel="noreferrer"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="fixed bottom-8 right-8 z-50 bg-[#25D366] text-white p-4 rounded-full shadow-2xl hover:bg-[#128C7E] transition-all group"
      >
        <MessageCircle className="w-8 h-8" />
        <span className="absolute right-full mr-4 top-1/2 -translate-y-1/2 bg-white text-gray-900 px-4 py-2 rounded-xl border border-gray-100 shadow-xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none font-bold text-sm">
          Chat with Winnie
        </span>
      </motion.a>
    </div>
  );
}
