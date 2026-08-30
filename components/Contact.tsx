'use client';

import { useState } from 'react';
import emailjs from '@emailjs/browser';

export default function Contact() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    inquiryType: 'General Inquiry',
    message: ''
  });
  
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    const templateParams = {
      name: `${formData.firstName} ${formData.lastName}`,
      email: formData.email,
      subject: formData.inquiryType,
      message: formData.message,
      source: 'WOWzer Technologies Website - Contact Form'
    };

    try {
      await emailjs.send(
        'default_service',
        'template_ab0walg',
        templateParams,
        'naLKp2IhB7VYtA5St'
      );
      setStatus('success');
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        inquiryType: 'General Inquiry',
        message: ''
      });
      // Reset success message after 5 seconds
      setTimeout(() => setStatus('idle'), 5000);
    } catch (error) {
      console.error('FAILED...', error);
      setStatus('error');
      setTimeout(() => setStatus('idle'), 5000);
    }
  };

  const whatsappMessage = encodeURIComponent("Hi WOWzer Team, I'm interested in learning more about your automation tools and products. Can we connect?");
  const whatsappUrl = `https://wa.me/16045628162?text=${whatsappMessage}`;

  return (
    <section id="contact" className="bg-slate-50 py-24">
      <div className="max-w-[1140px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* Form Column */}
        <div>
          <h2 className="font-heading font-bold text-3xl md:text-4xl text-wowzer-text mb-4">
            Let&apos;s Talk Automation
          </h2>
          <p className="text-wowzer-muted leading-relaxed mb-8">
            Whether you&apos;re exploring data migration, backup solutions, or partnership opportunities, we&apos;d love to hear from you. Reach out using the form below or connect with us directly.
          </p>
          
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-wowzer-text mb-2">First Name <span className="text-red-500">*</span></label>
                <input 
                  type="text" 
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required 
                  disabled={status === 'loading'}
                  className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-wowzer-primary focus:border-transparent transition-all disabled:opacity-50" 
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-wowzer-text mb-2">Last Name <span className="text-red-500">*</span></label>
                <input 
                  type="text" 
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required 
                  disabled={status === 'loading'}
                  className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-wowzer-primary focus:border-transparent transition-all disabled:opacity-50" 
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-wowzer-text mb-2">Email <span className="text-red-500">*</span></label>
              <input 
                type="email" 
                name="email"
                value={formData.email}
                onChange={handleChange}
                required 
                disabled={status === 'loading'}
                className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-wowzer-primary focus:border-transparent transition-all disabled:opacity-50" 
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-wowzer-text mb-2">Inquiry Type</label>
              <select 
                name="inquiryType"
                value={formData.inquiryType}
                onChange={handleChange}
                disabled={status === 'loading'}
                className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-wowzer-primary focus:border-transparent transition-all bg-white disabled:opacity-50"
              >
                <option>General Inquiry</option>
                <option>WOW Backup & Restore</option>
                <option>WOW BookSwitch</option>
                <option>Partnership</option>
                <option>Reseller</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-wowzer-text mb-2">Message</label>
              <textarea 
                rows={4} 
                name="message"
                value={formData.message}
                onChange={handleChange}
                disabled={status === 'loading'}
                className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-wowzer-primary focus:border-transparent transition-all disabled:opacity-50"
              ></textarea>
            </div>

            <button 
              type="submit" 
              disabled={status === 'loading'}
              className="bg-wowzer-primary text-white font-medium px-8 py-3.5 rounded-lg hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(0,82,204,0.3)] transition-all w-full sm:w-auto disabled:opacity-70 disabled:hover:translate-y-0 disabled:hover:shadow-none flex items-center justify-center gap-2"
            >
              {status === 'loading' ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Sending...
                </>
              ) : 'Submit Message'}
            </button>

            {status === 'success' && (
              <div className="p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm font-medium">
                Message sent successfully! We&apos;ll get back to you soon.
              </div>
            )}
            
            {status === 'error' && (
              <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm font-medium">
                Failed to send message. Please try again or contact us directly.
              </div>
            )}
          </form>
        </div>

        {/* Info Column */}
        <div className="bg-wowzer-darker text-white rounded-2xl p-10 shadow-xl flex flex-col h-full">
          <h3 className="font-heading font-bold text-2xl mb-8">Direct Contact</h3>
          
          <div className="space-y-8 flex-grow">
            {/* Phone */}
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center shrink-0">
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-wowzer-light"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>
              </div>
              <div>
                <strong className="block text-wowzer-light font-medium mb-1">Phone</strong>
                <a href="tel:+18662522604" className="text-white/90 hover:text-white hover:underline transition-colors block">+1 (866) 252-2604</a>
              </div>
            </div>

            {/* WhatsApp */}
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center shrink-0">
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-wowzer-light">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
              </div>
              <div>
                <strong className="block text-wowzer-light font-medium mb-1">WhatsApp</strong>
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="text-white/90 hover:text-white hover:underline transition-colors block">Chat with us</a>
              </div>
            </div>
            
            {/* Email */}
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center shrink-0">
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-wowzer-light"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
              </div>
              <div>
                <strong className="block text-wowzer-light font-medium mb-1">Email</strong>
                <a href="mailto:info@wowzer.tech" className="text-white/90 hover:text-white hover:underline transition-colors block">info@wowzer.tech</a>
              </div>
            </div>
            
            {/* Address */}
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center shrink-0">
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-wowzer-light"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
              </div>
              <div>
                <strong className="block text-wowzer-light font-medium mb-1">Address</strong>
                <p className="text-white/90 leading-relaxed">45 – 15898 27 Avenue<br/>Surrey, BC V3Z 0T2</p>
              </div>
            </div>
          </div>
          
          <div className="pt-10 mt-10 border-t border-white/10">
            <img src="/wp-content/uploads/2022/09/wowzer-logo-grad-lockup-transparent.png" alt="WOWzer Technologies" className="max-w-[200px] opacity-90" />
          </div>
        </div>
      </div>
    </section>
  );
}
