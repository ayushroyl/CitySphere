import React from "react";

const TermsAndConditions = () => {
    return (
        <div className="p-6 max-w-4xl my-12 mx-auto">
            <h1 className="text-3xl font-bold text-center mb-6">Terms and Conditions</h1>
            <p className="text-gray-700 mb-4">
                <strong>Last Updated:</strong> 20 Jan 2025
            </p>

            <p className="text-gray-700 mb-4">
                Welcome to <strong>CitySphere</strong>! By using our services, you agree to these terms and conditions. Please read them carefully.
            </p>

            <section className="mb-6">
                <h2 className="text-xl font-semibold mb-2">1. Acceptance of Terms</h2>
                <p className="text-gray-700">
                    By accessing or using our app, you agree to comply with these Terms and Conditions. 
                    If you do not agree, please do not use our services.
                </p>
            </section>

            <section className="mb-6">
                <h2 className="text-xl font-semibold mb-2">2. Services Provided</h2>
                <p className="text-gray-700">CitySphere offers home services, including but not limited to:</p>
                <ul className="list-disc list-inside text-gray-700">
                    <li>AC Servicing</li>
                    <li>Flat Booking</li>
                    <li>Fridge and Washing Machine Repairs</li>
                    <li>Electrician Services</li>
                    <li>Plumbing Services</li>
                    <li>Other Home Maintenance Services</li>
                </ul>
            </section>

            <section className="mb-6">
                <h2 className="text-xl font-semibold mb-2">3. User Accounts</h2>
                <ul className="list-disc list-inside text-gray-700">
                    <li>You must provide accurate information when registering.</li>
                    <li>You are responsible for maintaining the security of your account.</li>
                    <li>We reserve the right to suspend or terminate accounts that violate these terms.</li>
                </ul>
            </section>

            <section className="mb-6">
                <h2 className="text-xl font-semibold mb-2">4. Booking & Payments</h2>
                <ul className="list-disc list-inside text-gray-700">
                    <li>Users can book services via the app.</li>
                    <li>Prices are displayed before confirming the booking.</li>
                    <li>Payments can be made online or in cash, as per the service provider’s availability.</li>
                    <li>No refunds are provided after service completion, except in specific cases of unsatisfactory service.</li>
                </ul>
            </section>

            <section className="mb-6">
                <h2 className="text-xl font-semibold mb-2">5. Cancellation & Refund Policy</h2>
                <ul className="list-disc list-inside text-gray-700">
                    <li>Users can cancel a booking before the service provider starts the job.</li>
                    <li>Cancellations after service commencement may incur charges.</li>
                    <li>Refunds are processed as per our refund policy, available in the app.</li>
                </ul>
            </section>

            <section className="mb-6">
                <h2 className="text-xl font-semibold mb-2">6. Service Providers</h2>
                <ul className="list-disc list-inside text-gray-700">
                    <li>We act as a platform connecting users with independent service providers.</li>
                    <li>We verify professionals, but we are not responsible for their behavior or quality of service.</li>
                    <li>Users are encouraged to review and rate services.</li>
                </ul>
            </section>

            <section className="mb-6">
                <h2 className="text-xl font-semibold mb-2">7. Liability & Disclaimer</h2>
                <p className="text-gray-700">
                    We are not responsible for any damages, losses, or injuries arising from services booked through our app. 
                    Users should ensure service providers handle equipment properly and follow safety guidelines.
                </p>
            </section>

            <section className="mb-6">
                <h2 className="text-xl font-semibold mb-2">8. Privacy Policy</h2>
                <p className="text-gray-700">
                    Your data is collected and used per our <strong><a href="/privacy-policy" className="text-blue-700">Privacy Policy</a></strong>, available in the app. 
                    We do not share personal information with third parties without user consent.
                </p>
            </section>

            <section className="mb-6">
                <h2 className="text-xl font-semibold mb-2">9. Prohibited Activities</h2>
                <ul className="list-disc list-inside text-gray-700">
                    <li>Users must not provide false information.</li>
                    <li>Engage in fraudulent transactions.</li>
                    <li>Misuse the platform for illegal activities.</li>
                </ul>
            </section>

            <section className="mb-6">
                <h2 className="text-xl font-semibold mb-2">10. Modifications to Terms</h2>
                <p className="text-gray-700">
                    We reserve the right to update these terms at any time. Users will be notified of significant changes.
                </p>
            </section>

            <section className="mb-6">
                <h2 className="text-xl font-semibold mb-2">11. Contact Us</h2>
                <p className="text-gray-700">For any queries, please contact us at:</p>
                <p className="text-gray-700">
                    <strong>Email: </strong>
                    <a href="mailto:citysphere911@gmail.com" className="text-blue-600 underline">
                        citysphere911@gmail.com
                    </a>
                    <br />
                    <strong>Phone: </strong>
                    <a href="tel:+919117547911" className="text-blue-600 underline">
                        +91-9117547911
                    </a>
                    <br />
                </p>
            </section>
        </div>
    );
};

export default TermsAndConditions;
