import React from 'react';
import Link from 'next/link';

function Footer() {
  return (
    <footer className="w-full bg-primary-dark pt-6 text-[12.5px] border-t border-gray-200">
      <div className="max-w-[1000px] mx-auto px-4 sm:px-6 pb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">

          {/* Column 1: Negozi */}
          <div>
            <h4 className="font-bold text-accent mb-2.5">Negozi</h4>
            <ul className="space-y-1 text-gray-300 leading-[15px]">
              <li><a href="#" className="hover:text-accent transition-colors">Codici Sconto HP</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Codici Sconto Alperia</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Codici Sconto Domestika</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Codici Sconto MediaWorld</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Codici Sconto Cisalfa Sport</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Codici Sconto Colorland</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Codici Sconto Libraccio</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Codici Sconto Bruneau</a></li>
            </ul>
          </div>

          {/* Column 2: Offerte */}
          <div>
            <h4 className="font-bold text-accent mb-2.5">Offerte</h4>
            <ul className="space-y-1 text-gray-300 leading-[15px]">
              <li><a href="#" className="hover:text-accent transition-colors">Codici Sconto Back To School</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Codici Sconto Top</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Codici Sconto Informatica</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Codici Sconto Ufficio e Forniture</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Codici Sconto Salute e Bellezza</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Codici Sconto Formazione</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Codici Sconto Viaggi</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Codici Sconto Libri</a></li>
            </ul>
          </div>

          {/* Column 3: CodiceSconto */}
          <div>
            <h4 className="font-bold text-accent mb-2.5">CodiceSconto</h4>
            <ul className="space-y-1 text-gray-300 leading-[15px]">
              <li><a href="#" className="hover:text-accent transition-colors">Chi siamo</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Come funziona CodiceSconto</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Come funziona l&apos;estensione</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Come funziona il cashback</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Email alert</a></li>
              <li><Link href="/aggiungi-negozio" className="hover:text-accent transition-colors">Aggiungi negozio</Link></li>
              <li><a href="#" className="hover:text-accent transition-colors">Applicazione</a></li>
              <li><a href="#" className="hover:text-accent transition-colors">Contatti</a></li>
            </ul>
          </div>

          {/* Column 4: Logo & Social */}
          <div className="flex flex-col items-start md:items-end md:text-right mt-4 md:mt-0 h-full justify-between">
            <div className="w-full flex justify-start md:justify-end mb-4 md:mb-0">
              {/* TODO: Replace placeholder with original image */}
              <img
                src="/images/logo.png"
                alt="CodiceSconto Logo"
                className="max-h-[30px] object-contain"
              />
            </div>

            <div className="flex space-x-2 w-full justify-start md:justify-end mt-4">
              <a href="#" className="bg-social-bg text-white p-1 rounded-md hover:bg-gray-600 transition-colors" aria-label="Facebook">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14 13.5h2.5l1-4H14v-2c0-1.03 0-2 2-2h1.5V2.14c-.326-.043-1.557-.14-2.857-.14C11.928 2 10 3.657 10 6.7v2.8H7v4h3V22h4v-8.5z" />
                </svg>
              </a>
              <a href="#" className="bg-social-bg text-white p-1 rounded-md hover:bg-gray-600 transition-colors" aria-label="Instagram">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-footer-bar py-3 w-full border-t-2 border-footer-bar-border">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 flex flex-col md:flex-row justify-between items-center text-[11px] text-gray-300">
          <p>CodiceSconto &copy;08-26 - Imnoko S.r.l. IT02167140512</p>
          <div className="flex space-x-6 mt-2 md:mt-0">
            <a href="#" className="hover:text-white transition-colors">Condizioni</a>
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Cookie</a>
            <a href="#" className="hover:text-white transition-colors">Preferenze cookie</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
