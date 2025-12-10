// src/components/Footer.tsx
import React from "react";

export const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="container footer__inner">
        {/* Top section */}
        <div className="footer__top">
          <div className="footer__brand">
            <div className="footer__logo">MORENT</div>
            <p className="footer__text">
              Our vision is to provide convenience and help increase your sales
              business.
            </p>
          </div>

          <div className="footer__columns">
            <div className="footer__column">
              <h3 className="footer__column-title">About</h3>
              <ul className="footer__list">
                <li>How it works</li>
                <li>Featured</li>
                <li>Partnership</li>
                <li>Business Relation</li>
              </ul>
            </div>

            <div className="footer__column">
              <h3 className="footer__column-title">Community</h3>
              <ul className="footer__list">
                <li>Events</li>
                <li>Blog</li>
                <li>Podcast</li>
                <li>Invite a friend</li>
              </ul>
            </div>

            <div className="footer__column">
              <h3 className="footer__column-title">Socials</h3>
              <ul className="footer__list">
                <li>Discord</li>
                <li>Instagram</li>
                <li>Twitter</li>
                <li>Facebook</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="footer__bottom">
          <p className="footer__copy">©2024 MORENT. All rights reserved</p>
          <div className="footer__bottom-links">
            <span>Privacy &amp; Policy</span>
            <span>Terms &amp; Condition</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
