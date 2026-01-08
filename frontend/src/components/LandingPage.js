// components/LandingPage.js
import React, { useState } from 'react';
import axios from 'axios';
import logo1 from './logo1.png';
import logo2 from './logo2.png';
import { 
  Microscope, 
  FileText, 
  Building2, 
  MapPin, 
  Phone, 
  Mail, 
  Globe,
  Activity,
  Shield,
  Award,
  Users,
  Handshake,
  Send
} from 'lucide-react';

const LandingPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [formStatus, setFormStatus] = useState('');
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleScrollTo = (id) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80; // Offset për navbar
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Këtu mund të shtohet logjika për dërgimin e email-it
    setFormStatus('Faleminderit! Mesazhi juaj është dërguar me sukses.');
    setFormData({ name: '', email: '', message: '' });
    setTimeout(() => setFormStatus(''), 5000);
  };

  const services = [
    {
      icon: Microscope,
      title: 'Biopsi',
      description: 'Ekzaminim histopatologjik i mostrave të indit për diagnozë të saktë'
    },
    {
      icon: Activity,
      title: 'Pap Test',
      description: 'Ekzaminim citologjik për depërtimin e çrregullimeve të qelizave'
    },
    {
      icon: FileText,
      title: 'Citologji',
      description: 'Analizë e detajuar e qelizave për diagnozë mjekësore'
    },
    {
      icon: Shield,
      title: 'Raporte të Sigurta',
      description: 'Gjenerim i raporteve të standardizuara dhe të sigurta'
    }
  ];


  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      {/* Navigation Bar */}
      <nav className="text-gray-300 sticky top-0 z-50 shadow-lg" style={{ backgroundColor: '#0f3f6f' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <img 
                src={logo2} 
                alt="Laboratori i Patologjisë" 
                className="h-12 w-auto"
              />
            </div>
            
            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-8">
              <button
                onClick={() => handleScrollTo('rreth-nesh')}
                className="text-gray-300 hover:text-white transition-colors font-medium"
              >
                Rreth Nesh
              </button>
              <button
                onClick={() => handleScrollTo('sherbimet-tona')}
                className="text-gray-300 hover:text-white transition-colors font-medium"
              >
                Shërbimet Tona
              </button>
              <button
                onClick={() => handleScrollTo('contact-us')}
                className="text-gray-300 hover:text-white transition-colors font-medium"
              >
                Contact Us
              </button>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={() => {
                  const menu = document.getElementById('mobile-menu');
                  menu?.classList.toggle('hidden');
                }}
                className="text-gray-300 hover:text-white"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
        
        {/* Mobile Menu */}
        <div id="mobile-menu" className="hidden md:hidden" style={{ backgroundColor: '#0d3659' }}>
          <div className="px-4 pt-2 pb-3 space-y-1">
            <button
              onClick={() => {
                handleScrollTo('rreth-nesh');
                document.getElementById('mobile-menu')?.classList.add('hidden');
              }}
              className="block w-full text-left px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-md transition-colors"
            >
              Rreth Nesh
            </button>
            <button
              onClick={() => {
                handleScrollTo('sherbimet-tona');
                document.getElementById('mobile-menu')?.classList.add('hidden');
              }}
              className="block w-full text-left px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-md transition-colors"
            >
              Shërbimet Tona
            </button>
            <button
              onClick={() => {
                handleScrollTo('contact-us');
                document.getElementById('mobile-menu')?.classList.add('hidden');
              }}
              className="block w-full text-left px-3 py-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-md transition-colors"
            >
              Contact Us
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="text-center">
            {/* Logo/Icon */}
            <div className="flex justify-center mb-8">
              <img 
                src={logo1} 
                alt="Laboratori i Patologjisë" 
                className="h-24 md:h-28 lg:h-32 w-auto"
              />
            </div>
            
            {/* Main Heading */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl mb-6 tracking-tight leading-tight">
              <span className="block font-display font-bold text-gray-900 mb-2" style={{ 
                letterSpacing: '-0.02em',
                fontWeight: 700
              }}>
                Laboratori i Patologjisë
              </span>
              <span className="block text-blue-600 mt-3 font-bold text-3xl md:text-4xl lg:text-5xl tracking-wide" style={{
                fontFamily: 'Inter, sans-serif',
                fontWeight: 600,
                letterSpacing: '0.05em'
              }}>
                "Pathology"
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Laborator modern i patologjisë që ofron shërbime të larta cilësie për ekzaminimin 
              histopatologjik dhe citologjik të mostrave mjekësore.
            </p>
            
            {/* CTA Button */}
            <div className="flex justify-center items-center">
              <a
                href="tel:+38345250475"
                className="inline-flex items-center justify-center px-8 py-4 border-2 border-gray-300 text-base font-semibold rounded-xl text-gray-700 bg-gray-200 hover:text-white shadow-md hover:shadow-lg transition-all duration-200"
                style={{ '--hover-bg': '#0f3f6f' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#0f3f6f'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#e5e7eb'}
              >
                <Phone className="mr-2 h-5 w-5" />
                Na Kontaktoni
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Services Section */}
      <div id="sherbimet-tona" className="py-20 bg-white scroll-mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Shërbimet Tona
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Ofrojmë një gamë të gjerë shërbimesh patologjike me teknologji të avancuar
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <div
                  key={index}
                  className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100"
                >
                  <div className="flex justify-center mb-6">
                    <div className="h-16 w-16 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center shadow-lg">
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 text-center leading-relaxed">
                    {service.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* About Section */}
      <div id="rreth-nesh" className="py-20 bg-gradient-to-br from-blue-50 to-indigo-50 scroll-mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Rreth Nesh
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Laboratori i Patologjisë "Pathology" është krijuar nga Prof.Dr.Labinot Shahini. Tani ka një staf të gjerë dhe profesional me një laborator modern dhe i pajisur me teknologji të avancuar që ofron shërbime të larta cilësie për ekzaminimin histopatologjik dhe citologjik të mostrave mjekësore.
            </p>
          </div>
          <div className="max-w-3xl mx-auto bg-white rounded-2xl p-8 shadow-lg">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center justify-center">
                <Building2 className="h-6 w-6 text-blue-600 mr-2" />
                Çfarë Bëjmë Ne?
              </h3>
              <p className="text-gray-700 leading-relaxed mb-4 text-center">
                Laboratori ynë specializohet në ekzaminimin e mostrave të indit dhe qelizave për qëllime diagnostike. 
                Ne ofrojmë analiza të detajuara për mjekët dhe institucionet shëndetësore, duke përdorur teknologji 
                moderne dhe standarde ndërkombëtare.
              </p>
              <p className="text-gray-700 leading-relaxed text-center">
                Me një ekip të kualifikuar patologësh dhe teknologësh, ne garantojmë rezultate të sakta dhe të besueshme 
                që ndihmojnë në diagnozën dhe trajtimin e saktë të pacientëve.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="py-20 bg-gradient-to-b from-blue-50 to-gray-50 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-32 h-32 border-4 border-blue-300 rounded-full"></div>
          <div className="absolute top-20 right-20 w-24 h-24 border-4 border-indigo-300 rounded-full"></div>
          <div className="absolute bottom-20 left-1/4 w-16 h-16 border-4 border-purple-300 rounded-full"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1 - Quality & Professionalism */}
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
              <div className="flex justify-center mb-6">
                <div className="h-20 w-20 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
                  <Award className="h-10 w-10 text-white" />
                </div>
              </div>
              <div className="text-center">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                   Cilësia shkencore dhe profesionale
                </h3>
                
              </div>
            </div>

            {/* Card 2 - Local & International Clients */}
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
              <div className="flex justify-center mb-6">
                <div className="h-20 w-20 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center shadow-lg">
                  <Users className="h-10 w-10 text-white" />
                </div>
              </div>
              <div className="text-center">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                   Saktësia dhe riprodhueshmëria e rezultateve
                </h3>
              </div>
            </div>

            {/* Card 3 - Client Trust */}
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
              <div className="flex justify-center mb-6">
                <div className="h-20 w-20 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-lg">
                  <Handshake className="h-10 w-10 text-white" />
                </div>
              </div>
              <div className="text-center">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                Siguria dhe higjenia
                </h3>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contact & Location Section */}
      <div id="contact-us" className="py-20 bg-white scroll-mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Na Gjeni
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Jemi këtu për t'ju ndihmuar me çdo pyetje ose kërkesë
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto mb-12">
            {/* Left Side - Two Cards */}
            <div className="space-y-8">
              {/* Contact Card */}
              <div className="rounded-2xl p-8 text-gray-300 shadow-xl" style={{ backgroundColor: '#0f3f6f' }}>
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="h-12 w-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                        <Phone className="h-6 w-6" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-2">Telefoni</h3>
                      <a 
                        href="tel:+38345250475" 
                        className="text-lg text-gray-300 hover:text-white transition-colors"
                      >
                        +383 (0) 45 250 475
                      </a>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="h-12 w-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                        <Mail className="h-6 w-6" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-2">Email</h3>
                      <a 
                        href="mailto:info@patologjia.com" 
                        className="text-lg text-indigo-100 hover:text-white transition-colors break-all"
                      >
                        info@patologjia.com
                      </a>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="h-12 w-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                        <Globe className="h-6 w-6" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-2">Website</h3>
                      <a 
                        href="http://www.patologjia.com" 
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-lg text-gray-300 hover:text-white transition-colors"
                      >
                        www.patologjia.com
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Location Card */}
              <div className="rounded-2xl p-8 text-gray-300 shadow-xl" style={{ backgroundColor: '#0f3f6f' }}>
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="h-12 w-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                      <MapPin className="h-6 w-6" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-4 text-white">Lokacioni</h3>
                    <p className="text-lg leading-relaxed text-gray-300 mb-4">
                      Ulpiana, D-8 H3, Nr. 10<br />
                      10 000 Prishtinë, Kosovë
                    </p>
                    <a
                      href="https://www.google.com/maps?q=42.6489722,21.1634167"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-gray-300 hover:text-white transition-colors underline"
                    >
                      <MapPin className="h-4 w-4 mr-2" />
                      Hap në Google Maps
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Contact Form */}
            <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-200">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Na Dërgoni Mesazh</h3>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                    Emri Juaj <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                      formErrors.name ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Shkruani emrin tuaj"
                  />
                  {formErrors.name && (
                    <p className="mt-1 text-sm text-red-500">{formErrors.name}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                    Email Juaj <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                      formErrors.email ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="shkruani@email.com"
                  />
                  {formErrors.email && (
                    <p className="mt-1 text-sm text-red-500">{formErrors.email}</p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-2">
                    Mesazhi Juaj <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows={6}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none ${
                      formErrors.message ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Shkruani mesazhin tuaj këtu..."
                  ></textarea>
                  {formErrors.message && (
                    <p className="mt-1 text-sm text-red-500">{formErrors.message}</p>
                  )}
                </div>
                
                {formStatus === 'success' && (
                  <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg">
                    Faleminderit! Mesazhi juaj është dërguar me sukses tek info@patologjia.com
                  </div>
                )}
                
                {formStatus === 'error' && (
                  <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
                    Ka ndodhur një gabim. Ju lutem provoni përsëri ose na kontaktoni direkt në info@patologjia.com
                  </div>
                )}
                
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-lg hover:text-white transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02] flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  onMouseEnter={(e) => !e.currentTarget.disabled && (e.currentTarget.style.backgroundColor = '#0f3f6f')}
                  onMouseLeave={(e) => !e.currentTarget.disabled && (e.currentTarget.style.backgroundColor = '#e5e7eb')}
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Po dërgohet...
                    </>
                  ) : (
                    <>
                      <Send className="h-5 w-5 mr-2" />
                      Dërgo Mesazhin
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Map Section */}
          <div className="max-w-5xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
              <div className="aspect-w-16 aspect-h-9 h-96">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2933.5!2d21.1634167!3d42.6489722!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDLCsDM4JzU2LjMiTiAyMcKwMDknNDguMyJF!5e0!3m2!1sen!2s!4v1234567890123!5m2!1sen!2s"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Lokacioni i Laboratorit të Patologjisë"
                  className="w-full h-full"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="text-gray-300 py-12" style={{ backgroundColor: '#0f3f6f' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <Microscope className="h-8 w-8 text-blue-400" />
            </div>
            <p className="text-lg font-semibold text-white mb-6">
              Laboratori i Patologjisë "Pathology"
            </p>
            
            {/* Contact Information */}
            <div className="flex flex-col md:flex-row justify-center items-center gap-4 md:gap-6 mb-6 text-sm">
              <div className="flex flex-col md:flex-row items-center gap-2">
                <MapPin className="h-4 w-4 text-blue-400" />
                <span className="text-center md:text-left">Ulpiana, D-8 H3, Nr. 10, Prishtinë</span>
              </div>
              <span className="hidden md:inline">•</span>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-blue-400" />
                <a href="tel:+38345250475" className="hover:text-white transition-colors">
                  +383 (0) 45 250 475
                </a>
              </div>
              <span className="hidden md:inline">•</span>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-blue-400" />
                <a href="mailto:info@patologjia.com" className="hover:text-white transition-colors break-all">
                  info@patologjia.com
                </a>
              </div>
            </div>
            
            {/* Copyright - Below contact information */}
            <div className="border-t border-gray-600 pt-6">
              <p className="text-sm text-gray-400">
                © {new Date().getFullYear()} Të gjitha të drejtat e rezervuara
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
