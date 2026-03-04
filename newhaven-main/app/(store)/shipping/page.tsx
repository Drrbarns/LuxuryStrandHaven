'use client';

import Link from 'next/link';
import { useCMS } from '@/context/CMSContext';
import { toWhatsAppNumber } from '@/lib/contact';
import AnimatedSection from '@/components/AnimatedSection';

export default function ShippingPage() {
  const { getSetting } = useCMS();
  const contactPhone = getSetting('contact_phone') || '054 930 7736';
  const telHref = toWhatsAppNumber(contactPhone) ? `tel:+${toWhatsAppNumber(contactPhone)}` : '#';

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-gradient-to-br from-gray-50 via-white to-amber-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">Shipping &amp; Delivery</h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              The Shipping Policy
            </p>
          </AnimatedSection>
        </div>
      </div>

      <AnimatedSection direction="up" delay={0.1} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white border-2 border-gray-200 rounded-2xl p-8 space-y-6 prose prose-gray max-w-none hover-lift">
            <p className="text-gray-700 leading-relaxed">
              We promise to dispatch <strong>all custom wig orders within 3 to 7 working days</strong>. For orders that do not require styling, it will be delivered <strong>same day if purchased before 9am</strong>.
            </p>

            <div>
              <h2 className="text-xl font-bold text-gray-900 mt-8 mb-2">Delivery fee</h2>
              <ul className="list-disc pl-6 space-y-1 text-gray-700">
                <li>Within any parts of Accra: GH₵35–50</li>
                <li>Tema &amp; Kasoa: GH₵50–100</li>
              </ul>
            </div>

            <p className="text-gray-700 leading-relaxed">
              If your order is secured after 9am between Tuesday and Saturday, we will dispatch your order to you the next day with successful delivery before 5:30pm.
            </p>

            <p className="text-gray-700 leading-relaxed">
              If you order after 9am but still want same-day delivery, then a <strong>Yango courier service</strong> will be used and the client bears the entire cost.
            </p>

            <p className="text-gray-700 leading-relaxed">
              All orders secured on Sundays and Mondays will be processed and dispatched the following working day and delivered before 5:30pm.
            </p>

            <div>
              <h2 className="text-xl font-bold text-gray-900 mt-8 mb-2">Domestic deliveries outside Accra</h2>
              <p className="text-gray-700 mb-2">
                <strong>Kumasi, Cape Coast, Takoradi, Sunyani, Tamale:</strong> GH₵25 – Next Working Day
              </p>
              <p className="text-gray-700 leading-relaxed">
                All orders will be packed and dispatched the next working day via domestic bus services such as VIP or Eagle Express. Your order will take 24 hours to arrive in your city, and you will be given a code or vehicle registration and contact number, in order to collect your package from the bus station in your city.
              </p>
              <p className="text-amber-800 font-semibold mt-4 bg-amber-50 border border-amber-200 rounded-lg px-4 py-2">
                Please note: Parcel office delivery fee is not included in the GH₵25.
              </p>
            </div>

            <p className="text-gray-700 leading-relaxed">
              If your package is not delivered on time for reasons beyond our control such as weather or external partnership issues, please call us immediately on{' '}
              <a href={telHref} className="text-gray-900 font-semibold hover:underline">{contactPhone}</a> and we will do all we can to assist in finding an alternative suitable solution.
            </p>
          </div>

          <div className="mt-12 text-center">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-full font-medium hover:bg-gray-800 transition-all hover:-translate-y-1 hover:shadow-lg"
            >
              Contact us
            </Link>
          </div>
        </div>
      </AnimatedSection>
    </div>
  );
}
