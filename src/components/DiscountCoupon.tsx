import React, { useState } from 'react';
import { Copy, Check, Tag } from 'lucide-react';

interface DiscountCouponProps {
  code: string;
  discount: string;
  expiry: string;
}

const DiscountCoupon: React.FC<DiscountCouponProps> = ({ code, discount, expiry }) => {
  const [copied, setCopied] = useState(false);
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };
  
  // Format expiry date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };
  
  return (
    <div 
      className="mb-6 cursor-pointer transition-all hover:shadow-xl rounded-lg shadow-lg"
      onClick={copyToClipboard}
      role="button"
      aria-label={`Copy discount code ${code}`}
      style={{ backgroundColor: '#00ffad' }}
    >
      <div className="flex flex-col sm:flex-row w-full justify-between items-start sm:items-center gap-4 p-4 text-black">
        <div className="flex items-center">
          <Tag className="flex-shrink-0 h-6 w-6 mr-3" />
          <div>
            <h3 className="font-bold text-base md:text-lg">Discount Coupon Available!</h3>
            <div className="text-xs md:text-sm opacity-90">Save {discount} on any course purchase. Expires {formatDate(expiry)}</div>
          </div>
        </div>
        
        <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
          <div className="font-mono bg-white px-3 py-1 rounded-md select-all text-sm md:text-base flex-grow sm:flex-grow-0 text-center sm:text-left">
            {code}
          </div>
          <button 
            className="btn btn-sm btn-circle flex-shrink-0 bg-white border-white hover:bg-gray-200 text-black"
            aria-label={copied ? "Code copied" : "Copy code"}
          >
            {copied ? <Check size={16} /> : <Copy size={16} />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DiscountCoupon;
