import React from "react";

const PrivacyPolicy = () => {
    return (
        <div className="p-6 max-w-4xl my-12 mx-auto">
            <h1 className="text-3xl font-bold text-center mb-6">Privacy Policy</h1>
            <p className="text-gray-700 mb-4">
                <strong>Effective Date:</strong> 20 Dec 2025 <br />
                <strong>Last Updated:</strong> 20 Dec 2025
            </p>

            <p className="text-gray-700 mb-4">
                Welcome to <strong>CitySphere</strong>! Your privacy is important to us. This policy
                explains how we collect, use, and protect your personal information.
            </p>

            <section className="mb-6">
                <h2 className="text-xl font-semibold mb-2">1. Information We Collect</h2>
                <ul className="list-disc list-inside text-gray-700">
                    <li>
                        <strong>Personal Information:</strong> Name, mobile number, email
                        address, delivery address, and any other information you provide during
                        registration or usage.
                    </li>
                    <li>
                        <strong>Usage Data:</strong> Pages visited, time spent on the website, and
                        search preferences.
                    </li>
                    <li>
                        <strong>Device Information:</strong> IP address, browser type, operating
                        system, and device identifiers.
                    </li>
                </ul>
            </section>

            <section className="mb-6">
                <h2 className="text-xl font-semibold mb-2">2. How We Use Your Information</h2>
                <ul className="list-disc list-inside text-gray-700">
                    <li>Provide and improve our services.</li>
                    <li>Process your requests, such as orders and bookings.</li>
                    <li>Communicate with you about updates and offers.</li>
                    <li>Ensure security and prevent fraud.</li>
                </ul>
            </section>

            <section className="mb-6">
                <h2 className="text-xl font-semibold mb-2">3. Data Sharing</h2>
                <p className="text-gray-700">
                    We do not sell or rent your data. However, we may share it with:
                </p>
                <ul className="list-disc list-inside text-gray-700">
                    <li>
                        <strong>Service Providers:</strong> To process payments, provide analytics, or
                        host the platform.
                    </li>
                    <li>
                        <strong>Legal Obligations:</strong> To comply with laws or legal processes.
                    </li>
                    <li>
                        <strong>Business Transfers:</strong> In case of a merger, acquisition, or sale
                        of assets.
                    </li>
                </ul>
            </section>

            <section className="mb-6">
                <h2 className="text-xl font-semibold mb-2">4. Your Rights</h2>
                <p className="text-gray-700">
                    Depending on your location, you may have the right to:
                </p>
                <ul className="list-disc list-inside text-gray-700">
                    <li>Access your personal data.</li>
                    <li>Update or delete your data.</li>
                    <li>Restrict processing of your data.</li>
                </ul>
                <p className="text-gray-700">
                    To exercise your rights, contact us at <strong>citysphere911@gmail.com</strong>.
                </p>
            </section>

            <section className="mb-6">
                <h2 className="text-xl font-semibold mb-2">5. Cookies and Tracking</h2>
                <p className="text-gray-700">
                    We use cookies to:
                </p>
                <ul className="list-disc list-inside text-gray-700">
                    <li>Remember preferences.</li>
                    <li>Analyze usage patterns.</li>
                </ul>
                <p className="text-gray-700">
                    You can disable cookies in your browser settings.
                </p>
            </section>

            <section className="mb-6">
                <h2 className="text-xl font-semibold mb-2">6. Policy Updates</h2>
                <p className="text-gray-700">
                    This privacy policy may be updated periodically. We will notify you of
                    significant changes.
                </p>
            </section>

            <section className="mb-6">
                <h2 className="text-xl font-semibold mb-2">7. Contact Us</h2>
                <p className="text-gray-700">
                    If you have questions about this policy, contact us at:
                </p>
                <p className="text-gray-700">
                    <strong>Email:</strong> citysphere911@gmail.com <br />
                    <strong>Phone:</strong> +91-9117547911
                </p>
            </section>

            {/* Developer and Organization Branding Section */}
            <section className="mt-12 border-t-4 pt-6">
                <h2 className="text-xl font-semibold mb-4">About the Developer & Organization</h2>
                <ul className="list-disc list-inside text-gray-700">
                    <li><strong>Developer: </strong><a href="https://instagram.com/ayushroyl" target="_blank" rel="noopener noreferrer" className="underline"> Ayush Roy</a></li>
                    <li><strong>Organization: </strong><a href="https://roynix.tech" target="_blank" rel="noopener noreferrer" className="underline"> RoyNix</a></li>
                    <li><strong>Email:</strong> <a href="mailto:ayushroy0753@gmail.com" className="text-blue-600 underline">ayushroy0753@gmail.com</a></li>
                    <li><strong>Contact:</strong> <a href="tel:+917255071097" className="text-blue-600 underline">+91-7255071097</a></li>
                    <li><strong>Portfolio:</strong> <a href="https://ayushroyl.github.io/profile" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">ayushroyl.github.io/profile</a></li>
                    <li><strong>Organization Website:</strong> <a href="https://roynix.tech" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">roynix.tech</a></li>
                </ul>
            </section>
        </div>
    );
};

export default PrivacyPolicy;
