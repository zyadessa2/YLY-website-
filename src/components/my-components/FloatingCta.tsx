// File: src/components/FloatingCta.tsx
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { X } from "lucide-react";

const FloatingCta = () => {
  const [visible, setVisible] = useState(true);
  if (!visible) return null;
  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-xs w-[360px] bg-white/95 dark:bg-neutral-900/95 rounded-2xl shadow-2xl border border-primary/20 p-4 flex items-center gap-3 backdrop-blur-md">
      {/* زر الإغلاق */}
      <button
        onClick={() => setVisible(false)}
        className="absolute top-2 left-2 text-gray-400 hover:text-red-500 transition p-2 rounded-full focus:outline-none"
        aria-label="إغلاق الكرت"
      >
        <X className="w-5 h-5" />
      </button>
      <Image
        src="/images/belo.png" // Change to your mascot image path
        alt="belo"
        width={100}
        height={100}
        className="drop-shadow-md  "
      />
      <div className="flex-1 text-center">
        <div className="text-sm font-semibold text-primary mb-1">
          التسجيل للموسم الجديد فتح
        </div>
        <div className="text-xs text-gray-700 dark:text-gray-200 mb-2">
          يعني متضيعش الفرصة دي. سجل دلوقتي وابدأ رحلتك معانا!
        </div>
        <Link
          href="/register"
          className="inline-block px-4 py-1.5 rounded-lg bg-primary text-white text-xs font-bold shadow hover:bg-primary/90 transition"
        >
          فورم التسجيل
        </Link>
      </div>
      {/* <Image
      src="/images/mascot.png" // Optional: another mascot on the right
      alt="YLY Mascot"
      width={40}
      height={40}
      className="hidden md:block drop-shadow-md"
    /> */}
    </div>
  );
};

export default FloatingCta;