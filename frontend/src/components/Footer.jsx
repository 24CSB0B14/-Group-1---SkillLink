import { Link } from "react-router-dom";
import { Facebook, Twitter, Linkedin, Instagram, Github } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300 pt-12 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-8">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center shadow-md">
                <span className="text-white font-bold text-lg">S</span>
              </div>
              <h2 className="text-xl font-bold text-white">SkillLink</h2>
            </div>
            <p className="text-gray-400 mb-4 max-w-xs">
              Connect with the world's best freelancers and find quality projects. Your global network awaits.
            </p>
            <div className="flex gap-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-gray-800 flex items-center justify-center hover:bg-primary transition"
              >
                <Facebook className="h-4 w-4" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-gray-800 flex items-center justify-center hover:bg-primary transition"
              >
                <Twitter className="h-4 w-4" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-gray-800 flex items-center justify-center hover:bg-primary transition"
              >
                <Linkedin className="h-4 w-4" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-gray-800 flex items-center justify-center hover:bg-primary transition"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-gray-800 flex items-center justify-center hover:bg-primary transition"
              >
                <Github className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* For Clients */}
          <div>
            <h3 className="text-white font-semibold mb-4">For Clients</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/freelancers" className="hover:text-primary transition">
                  Find Freelancers
                </Link>
              </li>
              <li>
                <Link to="/post-job" className="hover:text-primary transition">
                  Post a Job
                </Link>
              </li>
              <li>
                <Link to="/" className="hover:text-primary transition">
                  How to Hire
                </Link>
              </li>
              <li>
                <Link to="/" className="hover:text-primary transition">
                  Enterprise
                </Link>
              </li>
              <li>
                <Link to="/" className="hover:text-primary transition">
                  Success Stories
                </Link>
              </li>
            </ul>
          </div>

          {/* For Freelancers */}
          <div>
            <h3 className="text-white font-semibold mb-4">For Freelancers</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/search-jobs" className="hover:text-primary transition">
                  Find Jobs
                </Link>
              </li>
              <li>
                <Link to="/" className="hover:text-primary transition">
                  How to Get Work
                </Link>
              </li>
              <li>
                <Link to="/" className="hover:text-primary transition">
                  Freelancer Plus
                </Link>
              </li>
              <li>
                <Link to="/" className="hover:text-primary transition">
                  Resources
                </Link>
              </li>
              <li>
                <Link to="/" className="hover:text-primary transition">
                  Community
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-white font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="hover:text-primary transition">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/" className="hover:text-primary transition">
                  Leadership
                </Link>
              </li>
              <li>
                <Link to="/" className="hover:text-primary transition">
                  Careers
                </Link>
              </li>
              <li>
                <Link to="/" className="hover:text-primary transition">
                  Press
                </Link>
              </li>
              <li>
                <Link to="/" className="hover:text-primary transition">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-gray-400">
              © {currentYear} SkillLink. All rights reserved.
            </div>
            <div className="flex flex-wrap gap-6 text-sm">
              <Link to="/" className="hover:text-emerald-500 transition">
                Terms of Service
              </Link>
              <Link to="/" className="hover:text-emerald-500 transition">
                Privacy Policy
              </Link>
              <Link to="/" className="hover:text-emerald-500 transition">
                Cookie Policy
              </Link>
              <Link to="/" className="hover:text-emerald-500 transition">
                Accessibility
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
