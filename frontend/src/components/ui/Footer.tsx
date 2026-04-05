import logoImage from "../../../public/logo.png";
import Image from "next/image";

export const Footer = () => {
  return (
    <footer className="relative z-10 border-t border-yellow-500/20 bg-black/80 backdrop-blur-sm mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center">
            <Image
              src={logoImage}
              alt="SAMBEE Logo"
              className="h-20 w-auto object-contain"
            />
          </div>
          <p className="text-sm text-gray-400">
            © 2026 SAMBEE. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
