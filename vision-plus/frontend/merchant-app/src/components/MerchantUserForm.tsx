import React, { useState, ChangeEvent, FormEvent } from "react";
import { createMerchantUser } from "../lib/services";

// Hardcoded chains and tokens
const CHAINS = [
  { label: "Ethereum", value: "ethereum" },
  { label: "Tron", value: "tron" }
];
const TOKENS_BY_CHAIN = {
  ethereum: [
    { label: "ETH", value: "ETH" },
    { label: "USDT", value: "USDT" },
    { label: "USDC", value: "USDC" }
  ],
  tron: [
    { label: "TRX", value: "TRX" },
    { label: "USDT", value: "USDT" },
    { label: "USDC", value: "USDC" }
  ]
};

interface MerchantUserFormProps {
  onUserCreated: (merchantId: string) => void;
}

interface MerchantUserFormData {
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  contact_type: string;
  title: string;
}

interface MerchantUserFormErrors {
  email?: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  contact_type?: string;
  title?: string;
}

const MerchantUserForm: React.FC<MerchantUserFormProps> = ({ onUserCreated }) => {
  const [form, setForm] = useState<MerchantUserFormData>({
    email: "yazan@test.com ",
    first_name: "Yazan ",
    last_name: "Ad",
    phone: "+963980033496",
    contact_type: "type",
    title: "Non"
  });
  const [errors, setErrors] = useState<MerchantUserFormErrors>({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const requiredFields: (keyof MerchantUserFormData)[] = [
    "email",
    "first_name",
    "last_name",
    "phone",
    "contact_type",
    "title"
  ];

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const newErrors: MerchantUserFormErrors = {};
    requiredFields.forEach((field) => {
      if (!form[field]) newErrors[field] = "Required";
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setApiError(null);
    if (!validate()) return;
    setLoading(true);
    try {
      const data = await createMerchantUser(form);
      if (data && data.data && data.data.id) {
        onUserCreated(data.data.id);
      } else {
        throw new Error("merchant_id not returned");
      }
    } catch (err: any) {
      setApiError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen from-indigo-100 via-blue-50 to-white flex items-center justify-center px-4 py-10">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg bg-white backdrop-blur-md bg-opacity-70 rounded-3xl shadow-xl border border-indigo-200 p-8 sm:p-12 grid grid-cols-2 gap-8 font-sans"
      >
        {/* Header */}
        <header className="text-center col-span-2">
          <h1 className="text-4xl font-extrabold text-indigo-700 mb-2">Create Merchant User</h1>
          <p className="text-indigo-600/80 text-lg max-w-md mx-auto">
            Fill in the details below to create a new merchant user.
          </p>
        </header>

        {/* Email */}
        <div className="flex flex-col">
          <label htmlFor="email" className="mb-2 font-semibold text-indigo-800">
            Email
          </label>
          <input
            id="email"
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
            className="rounded-xl border border-indigo-300 bg-indigo-50 px-4 py-3 text-indigo-900 placeholder-indigo-400 focus:outline-none focus:ring-4 focus:ring-indigo-300 transition-shadow shadow-sm hover:shadow-md"
            placeholder="Enter email"
          />
          {errors.email && <span className="text-red-600 text-sm mt-1">{errors.email}</span>}
        </div>

        {/* First Name */}
        <div className="flex flex-col">
          <label htmlFor="first_name" className="mb-2 font-semibold text-indigo-800">
            First Name
          </label>
          <input
            id="first_name"
            type="text"
            name="first_name"
            value={form.first_name}
            onChange={handleChange}
            required
            className="rounded-xl border border-indigo-300 bg-indigo-50 px-4 py-3 text-indigo-900 placeholder-indigo-400 focus:outline-none focus:ring-4 focus:ring-indigo-300 transition-shadow shadow-sm hover:shadow-md"
            placeholder="Enter first name"
          />
          {errors.first_name && (
            <span className="text-red-600 text-sm mt-1">{errors.first_name}</span>
          )}
        </div>

        {/* Last Name */}
        <div className="flex flex-col">
          <label htmlFor="last_name" className="mb-2 font-semibold text-indigo-800">
            Last Name
          </label>
          <input
            id="last_name"
            type="text"
            name="last_name"
            value={form.last_name}
            onChange={handleChange}
            required
            className="rounded-xl border border-indigo-300 bg-indigo-50 px-4 py-3 text-indigo-900 placeholder-indigo-400 focus:outline-none focus:ring-4 focus:ring-indigo-300 transition-shadow shadow-sm hover:shadow-md"
            placeholder="Enter last name"
          />
          {errors.last_name && (
            <span className="text-red-600 text-sm mt-1">{errors.last_name}</span>
          )}
        </div>

        {/* Phone */}
        <div className="flex flex-col">
          <label htmlFor="phone" className="mb-2 font-semibold text-indigo-800">
            Phone
          </label>
          <input
            id="phone"
            type="tel"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            required
            className="rounded-xl border border-indigo-300 bg-indigo-50 px-4 py-3 text-indigo-900 placeholder-indigo-400 focus:outline-none focus:ring-4 focus:ring-indigo-300 transition-shadow shadow-sm hover:shadow-md"
            placeholder="Enter phone number"
          />
          {errors.phone && <span className="text-red-600 text-sm mt-1">{errors.phone}</span>}
        </div>

        {/* Contact Type */}
        <div className="flex flex-col">
          <label htmlFor="contact_type" className="mb-2 font-semibold text-indigo-800">
            Contact Type
          </label>
          <input
            id="contact_type"
            type="text"
            name="contact_type"
            value={form.contact_type}
            onChange={handleChange}
            required
            className="rounded-xl border border-indigo-300 bg-indigo-50 px-4 py-3 text-indigo-900 placeholder-indigo-400 focus:outline-none focus:ring-4 focus:ring-indigo-300 transition-shadow shadow-sm hover:shadow-md"
            placeholder="Enter contact type"
          />
          {errors.contact_type && (
            <span className="text-red-600 text-sm mt-1">{errors.contact_type}</span>
          )}
        </div>

        {/* Title */}
        <div className="flex flex-col">
          <label htmlFor="title" className="mb-2 font-semibold text-indigo-800">
            Title
          </label>
          <input
            id="title"
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            required
            className="rounded-xl border border-indigo-300 bg-indigo-50 px-4 py-3 text-indigo-900 placeholder-indigo-400 focus:outline-none focus:ring-4 focus:ring-indigo-300 transition-shadow shadow-sm hover:shadow-md"
            placeholder="Enter title"
          />
          {errors.title && <span className="text-red-600 text-sm mt-1">{errors.title}</span>}
        </div>

        {/* Submit button */}
        <div className="col-span-2 flex justify-center">
          <button
            type="submit"
            disabled={loading}
            className="py-4 px-12 rounded-2xl hover:cursor-pointer w-full bg-gradient-to-r from-indigo-600 to-blue-500 text-white text-xl font-bold shadow-lg hover:from-blue-600 hover:to-indigo-600 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? <span className="animate-pulse">Submitting...</span> : "Create User"}
          </button>
        </div>

        {/* Error message */}
        {apiError && (
          <div className="col-span-2 rounded-lg bg-red-100 border border-red-300 text-red-700 px-4 py-3 text-center font-medium shadow-sm">
            {apiError}
          </div>
        )}
      </form>
    </div>
  );
};

export default MerchantUserForm;
