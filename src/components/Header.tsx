
import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Header = () => {
  const [activeMenu, setActiveMenu] = useState('Job Postings');

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

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <img 
              src="/lovable-uploads/7a848fb6-9c19-4716-aec5-9a19f5fff7d2.png" 
              alt="AHS HR Solutions" 
              className="h-12 w-auto"
            />
          </div>

          {/* Navigation Menu */}
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
            <button className="text-gray-700 hover:text-[#09b1cc]">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
