import React, { useState } from 'react';
import { X, Check, Code, Database, Globe, Layers, Send, CreditCard, Shield, HelpCircle } from 'lucide-react';

export default function InfoModal({ type, onClose, username }) {
  // state for contact form
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  // state for payment/checkout modal
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [payLoading, setPayLoading] = useState(false);

  const handleContactSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setEmail('');
      setSubject('');
      setMessage('');
    }, 1000);
  };

  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    setPayLoading(true);
    setTimeout(() => {
      setPayLoading(false);
      setPaymentSuccess(true);
    }, 1500);
  };

  const renderContent = () => {
    switch (type) {
      case 'docs':
        return (
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <Code className="text-blue-600 h-6 w-6" /> API Documentation
            </h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm mb-6">
              Integrate ShortUrl generation programmatically into your scripts and applications using our developer endpoints.
            </p>
            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
              {/* Shorten endpoint */}
              <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg border border-slate-100 dark:border-slate-700">
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-green-600 text-white text-xs font-bold px-2 py-0.5 rounded">POST</span>
                  <code className="text-xs font-semibold text-slate-800 dark:text-slate-200">/api/v1/shorten</code>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">Generate a short URL code. Optionally map it to user history.</p>
                <div className="bg-slate-900 text-slate-300 p-3 rounded text-[11px] font-mono whitespace-pre-wrap">
{`// Headers
{
  "Content-Type": "application/json",
  "Authorization": "Bearer <your_jwt_token>" // Optional
}

// Request Body
{
  "longUrl": "https://example.com/very/long/path/to/resource"
}

// Response
{
  "shortUrl": "http://localhost:8082/xyzabc"
}`}
                </div>
              </div>

              {/* History endpoint */}
              <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg border border-slate-100 dark:border-slate-700">
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-blue-600 text-white text-xs font-bold px-2 py-0.5 rounded">GET</span>
                  <code className="text-xs font-semibold text-slate-800 dark:text-slate-200">/api/v1/history</code>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">Get historical URLs shortened by the authenticated user.</p>
                <div className="bg-slate-900 text-slate-300 p-3 rounded text-[11px] font-mono whitespace-pre-wrap">
{`// Headers
{
  "Authorization": "Bearer <your_jwt_token>" // Required
}`}
                </div>
              </div>

              {/* Auth endpoints */}
              <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg border border-slate-100 dark:border-slate-700">
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-green-600 text-white text-xs font-bold px-2 py-0.5 rounded">POST</span>
                  <code className="text-xs font-semibold text-slate-800 dark:text-slate-200">/auth/login</code>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">Authenticate user and obtain a JWT bearer token.</p>
              </div>
            </div>
          </div>
        );

      case 'architecture':
        return (
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <Layers className="text-blue-600 h-6 w-6" /> System Architecture
            </h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm mb-6">
              ShortUrl is engineered using an enterprise Spring Boot microservices topology.
            </p>
            <div className="bg-slate-900 p-5 rounded-lg border border-slate-800 text-slate-300 text-xs font-mono mb-6 overflow-x-auto whitespace-pre">
{`               [ Client / React Frontend ]
                            | (Port 8082 / CORS Allowed)
                            v
                    [ API Gateway ]
               (Routes to internal services)
               (Secured with JwtAuthFilter)
                            |
           +----------------+----------------+
           | (routes to shortener)           | (routes to redirector)
           v                                 v
   [ Shortener Service ]             [ Redirect Service ]
       (Port 8080)                       (Port 8081)
           |                                 |
           v                                 v
   [ MySQL Database ]                [ Redis Cache ]
 (Stores URL mappings)             (Caches hot links)`}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="flex items-start gap-2">
                <Database className="text-blue-500 h-4 w-4 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-slate-900 dark:text-white">Eureka Registry</h4>
                  <p className="text-slate-500 dark:text-slate-400">All microservices register automatically with Discovery Server dynamically.</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Globe className="text-blue-500 h-4 w-4 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-slate-900 dark:text-white">Cache Layer</h4>
                  <p className="text-slate-500 dark:text-slate-400">Asynchronous redirect tracking allows lightning-fast redirection without DB bottlenecks.</p>
                </div>
              </div>
            </div>
          </div>
        );

      case 'help':
        return (
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <HelpCircle className="text-blue-600 h-6 w-6" /> Help & FAQ
            </h3>
            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 text-sm text-slate-600 dark:text-slate-400">
              <div>
                <h4 className="font-semibold text-slate-900 dark:text-white mb-1">How do I shorten a link?</h4>
                <p>Simply paste your link into the shorten input box on the landing page or dashboard and click "Shorten".</p>
              </div>
              <div>
                <h4 className="font-semibold text-slate-900 dark:text-white mb-1">What are the benefits of creating an account?</h4>
                <p>Registered users get access to their personal dashboard where they can see click history, copy previously shortened links, track analytics, and delete old mappings.</p>
              </div>
              <div>
                <h4 className="font-semibold text-slate-900 dark:text-white mb-1">Do my shortened links expire?</h4>
                <p>No, links shortened with ShortUrl stay active indefinitely unless deleted by you from your dashboard.</p>
              </div>
              <div>
                <h4 className="font-semibold text-slate-900 dark:text-white mb-1">How fast is the redirect?</h4>
                <p>Redirects are served through a dedicated caching architecture, resolving the original URL mapping in milliseconds.</p>
              </div>
            </div>
          </div>
        );

      case 'contact':
        return (
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <Send className="text-blue-600 h-6 w-6" /> Contact Developer
            </h3>
            {submitted ? (
              <div className="py-8 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 mb-4">
                  <Check className="h-8 w-8" />
                </div>
                <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Message Sent!</h4>
                <p className="text-slate-500 dark:text-slate-400 text-sm max-w-xs mx-auto">
                  Thank you for your feedback. We will get back to you as soon as possible.
                </p>
              </div>
            ) : (
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Your Email</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full px-4 py-2 text-sm border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Subject</label>
                  <input
                    type="text"
                    required
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="How can we help?"
                    className="w-full px-4 py-2 text-sm border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Message</label>
                  <textarea
                    rows="4"
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Write your suggestions or report issues here..."
                    className="w-full px-4 py-2 text-sm border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-lg transition-colors cursor-pointer"
                >
                  Send Message
                </button>
              </form>
            )}
          </div>
        );

      case 'checkout':
        return (
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <CreditCard className="text-blue-600 h-6 w-6" /> Premium Subscription
            </h3>
            {paymentSuccess ? (
              <div className="py-8 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 mb-4 animate-bounce">
                  <Check className="h-8 w-8" />
                </div>
                <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2">Upgrade Successful!</h4>
                <p className="text-slate-500 dark:text-slate-400 text-sm max-w-xs mx-auto mb-4">
                  Welcome to ShortUrl Pro! Your account plan has been updated successfully.
                </p>
                <button
                  onClick={onClose}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-lg transition-colors cursor-pointer"
                >
                  Awesome!
                </button>
              </div>
            ) : (
              <form onSubmit={handlePaymentSubmit} className="space-y-4">
                <p className="text-slate-500 dark:text-slate-400 text-xs mb-4">
                  You are upgrading account <strong>{username || 'Anonymous User'}</strong> to the Professional Plan for <strong>$19/month</strong>.
                </p>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Card Number</label>
                  <input
                    type="text"
                    required
                    maxLength="19"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value.replace(/\s?/g, '').replace(/(\d{4})/g, '$1 ').trim())}
                    placeholder="4242 4242 4242 4242"
                    className="w-full px-4 py-2 text-sm border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Expiry Date</label>
                    <input
                      type="text"
                      required
                      placeholder="MM/YY"
                      maxLength="5"
                      value={expiry}
                      onChange={(e) => setExpiry(e.target.value)}
                      className="w-full px-4 py-2 text-sm border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">CVV</label>
                    <input
                      type="password"
                      required
                      placeholder="•••"
                      maxLength="3"
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value.replace(/\D/g, ''))}
                      className="w-full px-4 py-2 text-sm border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={payLoading}
                  className="w-full mt-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-lg shadow-sm transition-colors cursor-pointer disabled:opacity-75 flex items-center justify-center gap-2"
                >
                  {payLoading ? 'Processing Payment...' : 'Pay & Upgrade'}
                </button>
              </form>
            )}
          </div>
        );

      case 'legal':
        return (
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <Shield className="text-blue-600 h-6 w-6" /> Legal & Terms
            </h3>
            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 text-xs text-slate-600 dark:text-slate-400">
              <div>
                <h4 className="font-semibold text-slate-900 dark:text-white mb-1">1. User Agreement</h4>
                <p>By using ShortUrl, you agree to comply with all applicable local, national, and international laws and regulations. You may not use ShortUrl to distribute spam, malware, phishing links, or other illicit contents.</p>
              </div>
              <div>
                <h4 className="font-semibold text-slate-900 dark:text-white mb-1">2. Redirections and Clicks</h4>
                <p>We log redirection stats (geographic region, timestamp, referral headers) for analytics. We reserve the right to delete links that violate our usage terms or generate excessive system strain.</p>
              </div>
              <div>
                <h4 className="font-semibold text-slate-900 dark:text-white mb-1">3. Privacy Policy</h4>
                <p>We respect your privacy. Email addresses and usernames are kept secure in hashed formats and are never sold or shared with third parties.</p>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      {/* blurred overlay */}
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />

      {/* modal panel */}
      <div
        className="relative z-10 w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden transition-colors duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="p-8">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}
