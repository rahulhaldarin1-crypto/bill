import { Language } from '../types/invoice';

export interface Translations {
  navBuilder: string;
  navSaved: string;
  navSettings: string;
  downloadPdf: string;
  downloadingPdf: string;
  printBill: string;
  newBill: string;
  saveBill: string;
  billSavedToast: string;
  quickPasteBtn: string;
  quickPasteTitle: string;
  quickPasteDesc: string;
  quickPastePlaceholder: string;
  applyParsed: string;
  cancel: string;
  sectionCustomer: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  customerCityPin: string;
  sectionInvoiceMeta: string;
  invoiceNo: string;
  autoNext: string;
  orderDate: string;
  deliveryDate: string;
  orderVia: string;
  paymentTag: string;
  sectionItems: string;
  quickAddProduct: string;
  addItem: string;
  productName: string;
  size: string;
  qty: string;
  originalPrice: string;
  discountedPrice: string;
  amount: string;
  sectionShippingCharges: string;
  courier: string;
  trackingId: string;
  trackingUrl: string;
  deliveryCharge: string;
  gstPercent: string;
  sectionPayment: string;
  paymentMethod: string;
  codAmountHelper: string;
  previewLabel: string;
  zoomFit: string;
  savedTitle: string;
  savedSubtitle: string;
  searchPlaceholder: string;
  filterAll: string;
  emptySavedTitle: string;
  emptySavedDesc: string;
  createFirstBill: string;
  colInvoice: string;
  colCustomer: string;
  colItems: string;
  colPayment: string;
  colTotal: string;
  colActions: string;
  loadEditor: string;
  duplicate: string;
  delete: string;
  settingsTitle: string;
  settingsSubtitle: string;
  saveSettings: string;
  resetDefaults: string;
  settingsSavedToast: string;
}

export const TRANSLATIONS: Record<Language, Translations> = {
  en: {
    navBuilder: 'Invoice Builder',
    navSaved: 'Saved Bills',
    navSettings: 'Store Settings',
    downloadPdf: 'Download PDF',
    downloadingPdf: 'Generating PDF...',
    printBill: 'Print',
    newBill: 'New Bill',
    saveBill: 'Save Bill',
    billSavedToast: 'Invoice saved to Saved Bills',
    quickPasteBtn: 'Paste Customer Text',
    quickPasteTitle: 'Auto-Fill Customer Details',
    quickPasteDesc:
      'Paste a WhatsApp message or address block with Name, Phone, Address, and PIN. Details will fill automatically.',
    quickPastePlaceholder:
      'Name: Anil Barman\nPhone: +916000294107\nAddress: Near Chandra Choudhury Path, Guwahati\nPIN: Assam-781028',
    applyParsed: 'Fill Customer Details',
    cancel: 'Cancel',
    sectionCustomer: 'Customer Details (Bill To)',
    customerName: 'Customer Name',
    customerPhone: 'Phone Number',
    customerAddress: 'Street Address',
    customerCityPin: 'City / State / PIN',
    sectionInvoiceMeta: 'Invoice & Order Details',
    invoiceNo: 'Invoice No',
    autoNext: 'Next #',
    orderDate: 'Order Date',
    deliveryDate: 'Delivery Date',
    orderVia: 'Order Via',
    paymentTag: 'Payment Label',
    sectionItems: 'Order Items',
    quickAddProduct: 'Quick add preset...',
    addItem: 'Add Product',
    productName: 'Product Name',
    size: 'Size',
    qty: 'Qty',
    originalPrice: 'Original (₹)',
    discountedPrice: 'Price (₹)',
    amount: 'Amount',
    sectionShippingCharges: 'Shipping, Delivery & GST',
    courier: 'Courier Partner',
    trackingId: 'Tracking / AWB No',
    trackingUrl: 'Tracking URL',
    deliveryCharge: 'Delivery Charge (₹)',
    gstPercent: 'GST (%)',
    sectionPayment: 'Payment Method',
    paymentMethod: 'Select Method Used',
    codAmountHelper: 'COD Amount (auto-syncs with Grand Total if blank)',
    previewLabel: 'Live A4 Invoice Preview',
    zoomFit: 'Fit',
    savedTitle: 'Saved Invoices',
    savedSubtitle: 'View, reload, duplicate, or export previously generated customer bills.',
    searchPlaceholder: 'Search by customer name, phone, or invoice no...',
    filterAll: 'All',
    emptySavedTitle: 'No saved invoices yet',
    emptySavedDesc: 'Save a bill from the Invoice Builder or download a PDF to keep a record here.',
    createFirstBill: 'Open Invoice Builder',
    colInvoice: 'Invoice No',
    colCustomer: 'Customer',
    colItems: 'Items',
    colPayment: 'Payment',
    colTotal: 'Grand Total',
    colActions: 'Actions',
    loadEditor: 'Edit',
    duplicate: 'Duplicate',
    delete: 'Delete',
    settingsTitle: 'Store Profile & Invoice Template',
    settingsSubtitle: 'Customize branding, UPI/Bank details, logo crest, and footer notes.',
    saveSettings: 'Save Settings',
    resetDefaults: 'Restore Defaults',
    settingsSavedToast: 'Store settings updated',
  },
  bn: {
    navBuilder: 'বিল তৈরি করুন',
    navSaved: 'সেভ করা বিল',
    navSettings: 'দোকান সেটিংস',
    downloadPdf: 'PDF সেভ করুন',
    downloadingPdf: 'PDF তৈরি হচ্ছে...',
    printBill: 'প্রিন্ট',
    newBill: 'নতুন বিল',
    saveBill: 'বিল সেভ করুন',
    billSavedToast: 'বিলটি সফলভাবে সেভ হয়েছে',
    quickPasteBtn: 'মেসেজ পেস্ট করে অটো-ফিল',
    quickPasteTitle: 'কাস্টমারের তথ্য অটো-ফিল করুন',
    quickPasteDesc:
      'হোয়াটসঅ্যাপ মেসেজ থেকে নাম, ফোন নম্বর, ঠিকানা ও পিন কোড এখানে পেস্ট করুন—অটোমেটিক ঘরগুলো পূরণ হয়ে যাবে।',
    quickPastePlaceholder:
      'Name: Anil Barman\nPhone: +916000294107\nAddress: Near Chandra Choudhury Path, Guwahati\nPIN: Assam-781028',
    applyParsed: 'তথ্য বসান',
    cancel: 'বাতিল',
    sectionCustomer: 'কাস্টমারের বিবরণ (Bill To)',
    customerName: 'কাস্টমারের নাম',
    customerPhone: 'ফোন নম্বর',
    customerAddress: 'সম্পূর্ণ ঠিকানা',
    customerCityPin: 'শহর / রাজ্য / পিন কোড',
    sectionInvoiceMeta: 'ইনভয়েস ও অর্ডারের তথ্য',
    invoiceNo: 'ইনভয়েস নম্বর',
    autoNext: 'পরবর্তী #',
    orderDate: 'অর্ডারের তারিখ',
    deliveryDate: 'ডেলিভারির তারিখ',
    orderVia: 'অর্ডারের মাধ্যম',
    paymentTag: 'পেমেন্ট স্ট্যাটাস',
    sectionItems: 'অর্ডার করা পণ্য (Items)',
    quickAddProduct: 'দ্রুত পণ্য যোগ করুন...',
    addItem: 'নতুন পণ্য যোগ করুন',
    productName: 'পণ্যের নাম',
    size: 'সাইজ',
    qty: 'সংখ্যা',
    originalPrice: 'আসল দাম (₹)',
    discountedPrice: 'বিক্রয় মূল্য (₹)',
    amount: 'মোট',
    sectionShippingCharges: 'ডেলিভারি চার্জ, GST ও ট্র্যাকিং',
    courier: 'কুরিয়ার সার্ভিস',
    trackingId: 'ট্র্যাকিং / AWB নম্বর',
    trackingUrl: 'ট্র্যাকিং লিংক',
    deliveryCharge: 'ডেলিভারি চার্জ (₹)',
    gstPercent: 'GST (%)',
    sectionPayment: 'পেমেন্ট পদ্ধতি',
    paymentMethod: 'ব্যবহৃত পেমেন্ট মাধ্যম',
    codAmountHelper: 'COD পরিমাণ (খালি রাখলে মোট বিলের টাকা অটোমেটিক বসবে)',
    previewLabel: 'লাইভ A4 বিল প্রিভিউ',
    zoomFit: 'ফিট',
    savedTitle: 'সেভ করা বিলসমূহ',
    savedSubtitle: 'আগের তৈরি করা বিলগুলো দেখুন, এডিট করুন বা সরাসরি PDF ডাউনলোড করুন।',
    searchPlaceholder: 'নাম, ফোন বা ইনভয়েস নম্বর দিয়ে খুঁজুন...',
    filterAll: 'সবগুলো',
    emptySavedTitle: 'এখনো কোনো বিল সেভ করা নেই',
    emptySavedDesc: 'বিল তৈরি করে সেভ বা PDF ডাউনলোড করলে এখানে তালিকা দেখতে পাবেন।',
    createFirstBill: 'বিল তৈরি শুরু করুন',
    colInvoice: 'ইনভয়েস নং',
    colCustomer: 'কাস্টমার',
    colItems: 'পণ্য',
    colPayment: 'পেমেন্ট',
    colTotal: 'সর্বমোট বিল',
    colActions: 'অ্যাকশন',
    loadEditor: 'এডিট',
    duplicate: 'কপি',
    delete: 'মুছুন',
    settingsTitle: 'দোকানের তথ্য ও বিল সেটিংস',
    settingsSubtitle: 'দোকানের নাম, লোগো, UPI QR, ব্যাংক ডিটেইলস এবং নিচের নোট পরিবর্তন করুন।',
    saveSettings: 'সেটিংস সেভ করুন',
    resetDefaults: 'ডিফল্ট ফিরিয়ে আনুন',
    settingsSavedToast: 'দোকানের সেটিংস সেভ হয়েছে',
  },
};
