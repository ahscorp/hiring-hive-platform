
import React from 'react';
import { Facebook, Instagram, Linkedin, Youtube } from 'lucide-react';

const Footer = () => {
  const companyLinks = [
    { name: 'About Us', url: 'https://ahscorp.in/about-us/' },
    { name: 'Blogs', url: '#' },
    { name: 'Career', url: '#' },
    { name: 'Job Postings', url: 'https://jobs.ahscorp.in/' },
    { name: 'Talent Hub', url: '#' }
  ];

  const solutionLinks = [
    { name: 'Payroll Outsourcing Services', url: 'https://ahscorp.in/payroll-outsourcing-services/' },
    { name: 'Payroll Compliance Services', url: 'https://ahscorp.in/payroll-compliance-services/' },
    { name: 'Third Party Payroll Services', url: 'https://ahscorp.in/third-party-payroll-services/' },
    { name: 'Establishment Compliance Services', url: 'https://ahscorp.in/establishment-compliance-services/' },
    { name: 'HR Audit Services', url: 'https://ahscorp.in/hr-audit-services/' },
    { name: 'Recruitment', url: 'https://ahscorp.in/recruitment/' }
  ];

  const socialLinks = [
    { icon: Facebook, url: 'https://www.facebook.com/p/AHS-Corporate-Services-Pvt-Ltd-100063896206968' },
    { icon: Instagram, url: 'https://www.instagram.com/ahs_corporateservices/' },
    { icon: Linkedin, url: 'https://www.linkedin.com/company/ahscorp-in/' },
    { icon: Youtube, url: 'https://www.youtube.com/@All_HR_Solutions' }
  ];

  return (
    <footer className="bg-[#272E59] text-white">
      <div className="container mx-auto px-5 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description Section */}
          <div className="md:col-span-1">
            <div className="mb-6">
              <img 
                src="/lovable-uploads/7a848fb6-9c19-4716-aec5-9a19f5fff7d2.png" 
                alt="AHS HR Solutions" 
                className="h-16 w-auto mb-4"
              />
            </div>
            <p className="text-sm leading-relaxed mb-6">
              Managing payroll in-house is complex and time-consuming. At <strong>AHS HR Solutions</strong>, we provide 
              expert <strong>payroll outsourcing services</strong> to streamline salary processing, ensure compliance, and eliminate errors.
            </p>
            
            {/* Newsletter Signup */}
            <div className="flex">
              <input
                type="email"
                placeholder="Email"
                className="flex-1 px-3 py-2 text-black rounded-l-md focus:outline-none"
              />
              <button className="bg-[#09b1cc] hover:bg-[#0891a8] px-4 py-2 rounded-r-md text-sm font-medium transition-colors">
                Get Newsletter
              </button>
            </div>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              {companyLinks.map((link) => (
                <li key={link.name}>
                  <a 
                    href={link.url}
                    className="text-sm hover:text-[#09b1cc] transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Solutions Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Solutions</h3>
            <ul className="space-y-2">
              {solutionLinks.map((link) => (
                <li key={link.name}>
                  <a 
                    href={link.url}
                    className="text-sm hover:text-[#09b1cc] transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Information */}
          <div>
            <div className="mb-6">
              <a
                href="https://www.google.com/maps/dir//AHS+Corporate+Services+Pvt.+Ltd.+B-21,+8th+Floor,+City+Vista+Fountain+Road,+Ashoka+Nagar,+Kharadi+Pune,+Maharashtra+411014/@18.5613072,73.9447944,13z/data=!4m8!4m7!1m0!1m5!1m1!1s0x3bc2c3eef8ed86db:0x3b761b6472a64f2b!2m2!1d73.9447944!2d18.5613072?entry=ttu&g_ep=EgoyMDI1MDMxNi4wIKXMDSoASAFQAw%3D%3D"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm hover:text-[#09b1cc] transition-colors"
              >
                AHS Corporate Services, City Vista Building, Kharadi, Pune, India - 411014
              </a>
            </div>
            
            <div className="mb-6">
              <a 
                href="mailto:info@ahscorp.in" 
                className="text-sm hover:text-[#09b1cc] transition-colors block mb-1"
              >
                info@ahscorp.in
              </a>
              <a 
                href="tel:+918055068555" 
                className="text-sm hover:text-[#09b1cc] transition-colors"
              >
                +91 80550 68555
              </a>
            </div>

            {/* Social Media Icons */}
            <div className="flex space-x-3">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full border border-[#09b1cc] flex items-center justify-center hover:bg-[#09b1cc] transition-colors"
                >
                  <social.icon size={20} />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-600 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center text-sm">
          <div className="flex space-x-6 mb-4 md:mb-0">
            <a href="#" className="hover:text-[#09b1cc] transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-[#09b1cc] transition-colors">Term of Services</a>
          </div>
          <p>Copyright © 2025, AHS Corporate Services Pvt Ltd</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
