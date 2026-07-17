import React from 'react';
import { Link2, Code2, MessageCircle, Briefcase, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer({ onOpenInfo }) {
  return (
    <footer className="bg-slate-900 border-t border-slate-800 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <Link2 className="h-8 w-8 text-blue-500" />
              <span className="font-bold text-xl tracking-tight text-white">ShortUrl</span>
            </Link>
            <p className="text-slate-400 text-sm max-w-sm mb-6 leading-relaxed">
               A blazing fast, modern URL shortener built with Spring Boot and React. Open source and designed for high performance.
            </p>
            <div className="flex space-x-4">
              <a href="https://github.com/shivansh" target="_blank" rel="noreferrer" className="text-slate-400 hover:text-white transition-colors">
                <span className="sr-only">GitHub</span>
                <Code2 className="h-5 w-5" />
              </a>
              <button onClick={() => onOpenInfo('contact')} className="text-slate-400 hover:text-blue-400 transition-colors cursor-pointer">
                <span className="sr-only">Twitter</span>
                <MessageCircle className="h-5 w-5" />
              </button>
              <button onClick={() => onOpenInfo('contact')} className="text-slate-400 hover:text-blue-600 transition-colors cursor-pointer">
                <span className="sr-only">LinkedIn</span>
                <Briefcase className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">Product</h3>
            <ul className="space-y-3">
              <li><Link to="/" className="text-sm text-slate-400 hover:text-white transition-colors">URL Shortener</Link></li>
              <li><Link to="/dashboard" className="text-sm text-slate-400 hover:text-white transition-colors">Analytics</Link></li>
              <li><button onClick={() => onOpenInfo('docs')} className="text-sm text-slate-400 hover:text-white transition-colors cursor-pointer text-left">API Documentation</button></li>
              <li><button onClick={() => onOpenInfo('checkout')} className="text-sm text-slate-400 hover:text-white transition-colors cursor-pointer text-left">Pricing</button></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">Developer</h3>
            <ul className="space-y-3">
              <li><a href="https://github.com/shivansh" target="_blank" rel="noreferrer" className="text-sm text-slate-400 hover:text-white transition-colors flex items-center"><Code2 className="h-4 w-4 mr-2"/> Source Code</a></li>
              <li><button onClick={() => onOpenInfo('architecture')} className="text-sm text-slate-400 hover:text-white transition-colors flex items-center cursor-pointer text-left">System Architecture</button></li>
              <li><button onClick={() => onOpenInfo('contact')} className="text-sm text-slate-400 hover:text-white transition-colors flex items-center cursor-pointer text-left"><Mail className="h-4 w-4 mr-2"/> Contact Developer</button></li>
            </ul>
          </div>

        </div>
        
        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-slate-500 text-sm">
            &copy; {new Date().getFullYear()} Shivansh. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <button onClick={() => onOpenInfo('legal')} className="text-sm text-slate-500 hover:text-white transition-colors cursor-pointer">Privacy Policy</button>
            <button onClick={() => onOpenInfo('legal')} className="text-sm text-slate-500 hover:text-white transition-colors cursor-pointer">Terms of Service</button>
          </div>
        </div>
      </div>
    </footer>
  );
}
