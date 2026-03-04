'use client';

import Link from 'next/link';
import { useCMS } from '@/context/CMSContext';
import { toWhatsAppNumber } from '@/lib/contact';
import AnimatedSection from '@/components/AnimatedSection';

export default function RefundPolicyPage() {
  const { getSetting } = useCMS();
  const contactEmail = getSetting('contact_email') || 'maame890@gmail.com';
  const contactPhone = getSetting('contact_phone') || '054 930 7736';
  const whatsappNumber = toWhatsAppNumber(contactPhone);
  const whatsappHref = whatsappNumber ? `https://wa.me/${whatsappNumber}` : '#';

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-gradient-to-br from-gray-50 via-white to-amber-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">Refund Policy</h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              Our return and refund terms so you can shop with confidence.
            </p>
            <p className="text-sm text-gray-500 mt-4">Last updated: February 2025</p>
          </AnimatedSection>
        </div>
      </div>

      <AnimatedSection direction="up" delay={0.1} className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="prose prose-lg max-w-none">
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Return Policy</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              We have a 24-hour return policy, which means you have 24 hours after receiving your item to request a return if items are faulty or damaged or not what you requested. (Due to hygiene reasons, we are unable to accept refunds for any other reason except for the above.)
            </p>

            <h3 className="text-xl font-bold text-gray-900 mb-4 mt-8">Exceptions / Non-returnable Items</h3>
            <p className="text-gray-600 leading-relaxed mb-4">
              Certain types of items cannot be returned, like custom orders (such as special orders or personalized items), and personal care goods (such as beauty products). We also do not accept returns for hazardous materials, flammable liquids, or gases. Please get in touch if you have questions or concerns about your specific item.
            </p>

            <h3 className="text-xl font-bold text-gray-900 mb-4 mt-8">Eligibility for Return</h3>
            <p className="text-gray-600 leading-relaxed mb-4">
              To be eligible for a return, your item must be in the same condition that you received it, unworn or unused, with tags, and in its original packaging. You&apos;ll also need the receipt or proof of purchase.
            </p>

            <h3 className="text-xl font-bold text-gray-900 mb-4 mt-8">How to Start a Return</h3>
            <p className="text-gray-600 leading-relaxed mb-4">
              To start a return, you can contact us on WhatsApp <a href={whatsappHref} className="text-gray-900 font-medium hover:underline" target="_blank" rel="noopener noreferrer">{contactPhone}</a>. If your return is accepted, we&apos;ll send you a return shipping label, as well as instructions on how and where to send your package. Items sent back to us without first requesting a return will not be accepted.
            </p>
            <p className="text-gray-600 leading-relaxed">
              You can always contact us for any return question at{' '}
              <a href={`mailto:${contactEmail}`} className="text-gray-900 font-medium hover:underline">{contactEmail}</a>.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Damages &amp; Issues</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              Please inspect your order upon reception and contact us immediately if the item is defective, damaged or if you receive the wrong item, so that we can evaluate the issue and make it right.
            </p>
            <p className="text-gray-600 leading-relaxed mb-4">
              <strong>Exceptions / non-returnable items:</strong> Certain types of items cannot be returned, like custom orders (such as special orders or personalized items), and personal care goods (such as beauty products). We also do not accept returns for hazardous materials, flammable liquids, or gases. Please get in touch if you have questions or concerns about your specific item. Unfortunately, we cannot accept returns on sale items or gift cards.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Exchanges</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              The fastest way to ensure you get what you want is to return the item you have, and once the return is accepted, the exchange for the new item will be done.
            </p>
            <p className="text-gray-600 leading-relaxed">
              <strong>Note:</strong> You cannot request a different item other than the one you purchased initially.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Refunds</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              If we don&apos;t have the same item you purchased, then a full refund will be made. We will notify you once we&apos;ve received and inspected your return, and let you know if the refund was approved or not. If approved, you&apos;ll be automatically refunded on your original payment method. Please remember it can take some time for your bank or credit card company to process and post the refund too.
            </p>
          </section>

          <section className="pt-8 border-t border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Questions?</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              For any return or refund questions, reach us at:
            </p>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-center gap-2">
                <i className="ri-whatsapp-line text-gray-900"></i>
                <a href={whatsappHref} className="font-medium hover:underline" target="_blank" rel="noopener noreferrer">WhatsApp: {contactPhone}</a>
              </li>
              <li className="flex items-center gap-2">
                <i className="ri-mail-line text-gray-900"></i>
                <a href={`mailto:${contactEmail}`} className="font-medium hover:underline">{contactEmail}</a>
              </li>
            </ul>
            <p className="mt-6">
              <Link href="/returns" className="text-gray-900 font-medium hover:underline inline-flex items-center gap-2">
                Start a return <i className="ri-arrow-right-line"></i>
              </Link>
            </p>
          </section>
        </div>
      </AnimatedSection>
    </div>
  );
}
