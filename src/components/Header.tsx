
import React, { useState } from 'react';
import { ChevronDown, Menu, X } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Header = () => {
  const [activeMenu, setActiveMenu] = useState('Job Postings');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const serviceItems = [
    {
      name: "Payroll Outsourcing Services",
      url: "https://ahscorp.in/payroll-outsourcing-services/"
    },
    {
      name: "Payroll Compliance Services", 
      url: "https://ahscorp.in/payroll-compliance-services/"
    },
    {
      name: "Third Party Payroll Services",
      url: "https://ahscorp.in/third-party-payroll-services/"
    },
    {
      name: "Establishment Compliance Services",
      url: "https://ahscorp.in/establishment-compliance-services/"
    },
    {
      name: "HR Audit Services",
      url: "https://ahscorp.in/hr-audit-services/"
    },
    {
      name: "Recruitment",
      url: "https://ahscorp.in/recruitment/"
    }
  ];

  const menuItems = [
    { name: 'Home', url: 'https://ahscorp.in/' },
    { name: 'About Us', url: 'https://ahscorp.in/about-us/' },
    { name: 'Gallery', url: 'https://ahscorp.in/gallery/' },
    { name: 'Job Postings', url: 'https://jobs.ahscorp.in/', isActive: true },
    { name: 'Contact Us', url: 'https://ahscorp.in/contact-us/' }
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-5">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <a href="https://ahscorp.in/" target="_blank" rel="noopener noreferrer">
              <img 
                src="/lovable-uploads/7a848fb6-9c19-4716-aec5-9a19f5fff7d2.png" 
                alt="AHS HR Solutions" 
                className="h-12 w-auto"
              />
            </a>
          </div>

          {/* Desktop Navigation Menu */}
          <nav className="hidden md:flex items-center space-x-8">
            {menuItems.map((item) => (
              <a
                key={item.name}
                href={item.url}
                className={`relative text-sm font-medium transition-colors hover:text-[#09b1cc] ${
                  item.isActive 
                    ? 'text-[#09b1cc] after:content-[""] after:absolute after:bottom-[-4px] after:left-0 after:w-full after:h-[2px] after:bg-black' 
                    : 'text-gray-700'
                }`}
                onClick={() => setActiveMenu(item.name)}
              >
                {item.name}
              </a>
            ))}

            {/* Services Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center text-sm font-medium text-gray-700 hover:text-[#09b1cc] transition-colors">
                Services
                <ChevronDown className="ml-1 h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64 bg-white border shadow-lg z-50">
                {serviceItems.map((service) => (
                  <DropdownMenuItem key={service.name} asChild>
                    <a
                      href={service.url}
                      className="w-full px-3 py-2 text-sm text-gray-700 hover:text-[#09b1cc] hover:bg-gray-50 transition-colors block"
                    >
                      {service.name}
                    </a>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button 
              onClick={toggleMobileMenu}
              className="text-gray-700 hover:text-[#09b1cc] p-2"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t">
            <nav className="py-4 space-y-2">
              {menuItems.map((item) => (
                <a
                  key={item.name}
                  href={item.url}
                  className={`block px-4 py-2 text-sm font-medium transition-colors hover:text-[#09b1cc] hover:bg-gray-50 ${
                    item.isActive ? 'text-[#09b1cc] bg-gray-50' : 'text-gray-700'
                  }`}
                  onClick={() => {
                    setActiveMenu(item.name);
                    setIsMobileMenuOpen(false);
                  }}
                >
                  {item.name}
                </a>
              ))}
              
              {/* Mobile Services Menu */}
              <div className="px-4 py-2">
                <div className="text-sm font-medium text-gray-700 mb-2">Services</div>
                <div className="pl-4 space-y-2">
                  {serviceItems.map((service) => (
                    <a
                      key={service.name}
                      href={service.url}
                      className="block py-1 text-sm text-gray-600 hover:text-[#09b1cc] transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {service.name}
                    </a>
                  ))}
                </div>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
