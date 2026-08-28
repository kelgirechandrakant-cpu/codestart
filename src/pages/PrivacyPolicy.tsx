import { Shield } from "lucide-react";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <main className="container mx-auto px-4 pt-24 pb-12 flex-1">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <Shield className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold">Privacy Policy</h1>
          </div>

          <div className="prose prose-neutral dark:prose-invert max-w-none space-y-8">
            <p className="text-muted-foreground text-lg">
              Last updated: January 2025
            </p>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Introduction</h2>
              <p>
                Welcome to LearnerCraft. We are committed to protecting your personal information and your right to privacy. 
                This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our 
                website and use our educational resource platform. Please read this privacy policy carefully. If you do not 
                agree with the terms of this privacy policy, please do not access the site.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Information We Collect</h2>
              <p>We collect information that you voluntarily provide to us when you:</p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li>Register for an account on our platform</li>
                <li>Download educational resources</li>
                <li>Contact us through our contact form</li>
                <li>Subscribe to our updates or newsletters</li>
              </ul>
              <p className="mt-4">
                The personal information we collect may include your name, email address, and any other information you 
                choose to provide. We automatically collect certain information when you visit our website, including your 
                IP address, browser type, operating system, access times, and the pages you have viewed directly before 
                and after accessing the website.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">How We Use Your Information</h2>
              <p>We use the information we collect to:</p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li>Provide, operate, and maintain our educational platform</li>
                <li>Improve, personalize, and expand our services</li>
                <li>Understand and analyze how you use our website</li>
                <li>Develop new products, services, features, and functionality</li>
                <li>Communicate with you about updates, resources, and support</li>
                <li>Send you educational content and promotional materials (with your consent)</li>
                <li>Find and prevent fraud and protect the security of our platform</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Cookies and Tracking Technologies</h2>
              <p>
                We use cookies and similar tracking technologies to track activity on our website and store certain 
                information. Cookies are files with a small amount of data which may include an anonymous unique identifier. 
                Cookies are sent to your browser from a website and stored on your device.
              </p>
              <p className="mt-4">
                We use cookies to improve our services, remember your preferences, analyze website traffic, and understand 
                how visitors interact with our platform. You can instruct your browser to refuse all cookies or to indicate 
                when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions 
                of our service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Third-Party Advertising</h2>
              <p>
                We use third-party advertising companies to serve ads when you visit our website. These companies may use 
                information (not including your name, address, email address, or telephone number) about your visits to 
                this and other websites in order to provide advertisements about goods and services of interest to you.
              </p>
              <p className="mt-4">
                <strong>Google AdSense:</strong> We use Google AdSense to display advertisements on our website. Google, 
                as a third-party vendor, uses cookies to serve ads on our site. Google's use of the DART cookie enables 
                it to serve ads to our users based on previous visits to our site and other sites on the Internet. Users 
                may opt-out of the use of the DART cookie by visiting the{" "}
                <a 
                  href="https://policies.google.com/technologies/ads" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  Google Ad and Content Network Privacy Policy
                </a>.
              </p>
              <p className="mt-4">
                Third-party vendors, including Google, use cookies to serve ads based on a user's prior visits to this 
                website or other websites. Google's use of advertising cookies enables it and its partners to serve ads 
                to users based on their visit to this site and/or other sites on the Internet. You may opt out of 
                personalized advertising by visiting{" "}
                <a 
                  href="https://www.google.com/settings/ads" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  Google Ads Settings
                </a>.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Data Security</h2>
              <p>
                We implement appropriate technical and organizational security measures designed to protect the security 
                of any personal information we process. However, please also remember that we cannot guarantee that the 
                internet itself is 100% secure. Although we will do our best to protect your personal information, 
                transmission of personal information to and from our website is at your own risk.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Your Privacy Rights</h2>
              <p>You have the right to:</p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li>Access the personal information we hold about you</li>
                <li>Request correction of inaccurate personal information</li>
                <li>Request deletion of your personal information</li>
                <li>Object to processing of your personal information</li>
                <li>Request restriction of processing your personal information</li>
                <li>Withdraw consent at any time where we relied on your consent</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Children's Privacy</h2>
              <p>
                Our service is designed for students and educational purposes. We do not knowingly collect personally 
                identifiable information from children under 13. If you are a parent or guardian and you are aware that 
                your child has provided us with personal information, please contact us so that we can take necessary actions.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Changes to This Privacy Policy</h2>
              <p>
                We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new 
                Privacy Policy on this page and updating the "Last updated" date at the top of this Privacy Policy. You 
                are advised to review this Privacy Policy periodically for any changes.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
              <p>
                If you have any questions about this Privacy Policy, please contact us at:{" "}
                <a href="mailto:contact@learnercraft.com" className="text-primary hover:underline">
                  contact@learnercraft.com
                </a>
              </p>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
