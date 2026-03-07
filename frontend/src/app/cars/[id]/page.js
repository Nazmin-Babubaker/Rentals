import Link from 'next/link';
import { notFound } from 'next/navigation';
import BookingForm from '@/components/BookingForm';

const API = process.env.NEXT_PUBLIC_API_URL ;

async function getCarDetails(id) {
  try {
    const res = await fetch(`${API}/api/cars/${id}`, { cache: 'no-store' });
    if (!res.ok) return null;
    return res.json();
  } catch (error) {
    console.error(error);
    return null;
  }
}

// Wizard step indicator — steps now reflect the actual payment flow:
// 1 Selection → 2 Booking Details → 3 Payment → 4 Confirmation
function WizardSteps({ activeStep = 2 }) {
  const steps = [
    { n: 1, label: 'Selection' },
    { n: 2, label: 'Booking Details' },
    { n: 3, label: 'Payment' },
    { n: 4, label: 'Confirmation' },
  ];

  return (
    <div className="flex justify-center items-center py-8 mb-4">
      <div className="flex items-center space-x-3">
        {steps.map((step, i) => {
          const done = step.n < activeStep;
          const active = step.n === activeStep;
          return (
            <div key={step.n} className="flex items-center">
              <div className="flex items-center space-x-2">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-colors
                    ${done ? 'bg-green-600 text-white' : active ? 'bg-slate-900 text-white' : 'bg-gray-200 text-gray-400'}`}
                >
                  {done ? '✓' : step.n}
                </div>
                <span
                  className={`text-xs font-semibold hidden sm:block ${
                    active ? 'text-slate-900' : done ? 'text-green-600' : 'text-gray-400'
                  }`}
                >
                  {step.label}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div className={`w-6 h-[2px] mx-3 ${done ? 'bg-green-600' : step.n < activeStep ? 'bg-slate-900' : 'bg-gray-200'}`} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default async function CarDetailsPage({ params }) {
  const { id } = await params;
  const car = await getCarDetails(id);

  if (!car) notFound();

  return (
    <div className="flex flex-col w-full bg-[#f8f9fa] text-black font-sans min-h-screen pt-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">

        {/* Step 2 is active — user is filling in booking details */}
        <WizardSteps activeStep={2} />

        {car.isAvailable ? (
          <>
            {/* Payment flow notice — sets expectation before form */}
            <div className="max-w-3xl mx-auto mb-6 flex items-start gap-3 bg-blue-50 border border-blue-200 px-5 py-4 text-sm text-blue-800">
              <svg className="w-4 h-4 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>
                After submitting, go to <strong>My Bookings</strong> to complete payment.
                Your booking is confirmed once an admin approves your payment.
              </span>
            </div>

            <BookingForm car={car} />
          </>
        ) : (
          <div className="bg-white border border-gray-200 p-12 text-center shadow-sm max-w-lg mx-auto">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="text-lg font-black uppercase tracking-tight text-gray-900 mb-2">Not Available</h2>
            <p className="text-gray-500 text-sm mb-6">
              This vehicle is currently unavailable for reservation.
            </p>
            <Link
              href="/cars"
              className="inline-block px-8 py-3 bg-slate-900 text-white text-xs font-bold uppercase tracking-widest hover:bg-black transition-colors"
            >
              Back to Fleet
            </Link>
          </div>
        )}

      </div>
    </div>
  );
}