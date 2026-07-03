import type { Metadata } from "next";
import LegalLayout, { LegalSection } from "@/components/legal/LegalLayout";
import { LegalList, LegalCallout } from "@/components/legal/LegalSection";

export const metadata: Metadata = {
  title: "Privacy Policy - Swaply",
  description:
    "Learn how Swaply collects, uses, discloses, and protects your personal data in compliance with the Nigeria Data Protection Regulation (NDPR).",
};

const sections = [
  { id: "introduction", title: "1. Introduction" },
  { id: "information-we-collect", title: "2. Information We Collect" },
  { id: "how-we-use", title: "3. How We Use Your Information" },
  { id: "legal-basis", title: "4. Legal Basis for Processing" },
  { id: "sharing", title: "5. Sharing & Disclosure" },
  { id: "cookies", title: "6. Cookies & Tracking" },
  { id: "data-retention", title: "7. Data Retention" },
  { id: "your-rights", title: "8. Your Rights under NDPR" },
  { id: "security", title: "9. Security Measures" },
  { id: "international-transfers", title: "10. International Transfers" },
  { id: "children", title: "11. Children's Privacy" },
  { id: "third-party-links", title: "12. Third-Party Links" },
  { id: "changes", title: "13. Changes to this Policy" },
  { id: "contact", title: "14. Contact Us" },
];

export default function PrivacyPolicyPage() {
  return (
    <LegalLayout
      badge="Legal"
      title="Privacy Policy"
      description="Swaply ('we', 'us', 'our') is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website, mobile application, or use our services."
      effectiveDate="January 1, 2026"
      lastUpdated="June 5, 2026"
      sections={sections}
    >
      <LegalSection id="introduction" title="1. Introduction">
        <p>
          This Privacy Policy applies to all information collected through our platform
          operated by <strong>Swaply Technologies Limited</strong> (&ldquo;Swaply&rdquo;,
          &ldquo;we&rdquo;, &ldquo;us&rdquo;), including our website, mobile application,
          and related services (collectively, the &ldquo;Service&rdquo;).
        </p>
        <p>
          We respect your privacy and are committed to protecting your personal data in
          compliance with the{" "}
          <strong>Nigeria Data Protection Regulation (NDPR) 2019</strong>, the{" "}
          <strong>Nigeria Data Protection Act (NDPA) 2023</strong>, and other applicable
          data protection laws.
        </p>
        <p>
          By accessing or using our Service, you agree to the collection and use of
          information in accordance with this Policy.
        </p>
      </LegalSection>

      <LegalSection id="information-we-collect" title="2. Information We Collect">
        <h3>2.1 Personal Identification Information</h3>
        <LegalList
          items={[
            "Full name, date of birth, and nationality",
            "Phone number, email address, and residential address",
            "Government-issued identification (NIN, BVN, passport, driver's license, voter's card)",
            "Bank account details and payment instrument information",
            "Photograph and biometric data for KYC verification (where required)",
          ]}
        />

        <h3>2.2 Transaction Information</h3>
        <LegalList
          items={[
            "Records of airtime, data, electricity, cable TV, and betting purchases",
            "Crypto buy/sell transactions, wallet addresses, and trade history",
            "Gift card upload history, redemption values, and payout records",
            "Flight bookings, payment confirmations, and itineraries",
            "Wallet top-ups, withdrawals, and transfer history",
          ]}
        />

        <h3>2.3 Device & Technical Information</h3>
        <LegalList
          items={[
            "IP address, browser type, device identifiers, and operating system",
            "Mobile network information and approximate location (city/country level)",
            "App usage patterns, session duration, and feature interactions",
            "Crash logs, error reports, and diagnostic data",
          ]}
        />
      </LegalSection>

      <LegalSection id="how-we-use" title="3. How We Use Your Information">
        <p>We use the information we collect for the following purposes:</p>
        <LegalList
          items={[
            "To create and manage your Swaply account",
            "To process transactions and deliver services you request",
            "To perform identity verification (KYC) and comply with AML/CFT obligations",
            "To detect, prevent, and investigate fraud, money laundering, and other illegal activities",
            "To send you service notifications, transaction confirmations, and security alerts",
            "To provide customer support and respond to your enquiries",
            "To improve our platform, develop new features, and personalize your experience",
            "To comply with applicable laws, regulations, and lawful orders from authorities",
          ]}
        />
      </LegalSection>

      <LegalSection id="legal-basis" title="4. Legal Basis for Processing">
        <p>Under the NDPR, we process your personal data on the following legal bases:</p>
        <LegalList
          items={[
            "<strong>Consent</strong> — where you have given clear, specific, and informed consent",
            "<strong>Contract</strong> — where processing is necessary to perform our contract with you",
            "<strong>Legal obligation</strong> — where we must comply with applicable laws (e.g., AML/CFT)",
            "<strong>Legitimate interest</strong> — for fraud prevention, security, and service improvement, balanced against your rights",
          ]}
        />
      </LegalSection>

      <LegalSection id="sharing" title="5. Sharing & Disclosure">
        <p>
          We do not sell your personal data. We may share information with the following
          categories of recipients, only as necessary:
        </p>
        <LegalList
          items={[
            "<strong>Service providers</strong> — payment processors, KYC/AML vendors, telecom and utility partners, cloud hosting, and customer support tools",
            "<strong>Regulatory authorities</strong> — CBN, NCC, NFIU, EFCC, or other competent authorities where lawfully required",
            "<strong>Law enforcement</strong> — in response to valid legal process or to protect our rights and users' safety",
            "<strong>Business transfers</strong> — in the event of a merger, acquisition, or sale of assets, with notice to you",
            "<strong>With your consent</strong> — for any other purpose disclosed at the time of collection",
          ]}
        />
      </LegalSection>

      <LegalSection id="cookies" title="6. Cookies & Tracking">
        <p>
          We use cookies, local storage, and similar technologies to operate the Service,
          remember your preferences, and measure performance. You can control cookies
          through your browser settings; however, disabling certain cookies may limit
          functionality.
        </p>
        <p>
          We do not use cookies to sell your personal data or to serve third-party
          behavioural advertising.
        </p>
      </LegalSection>

      <LegalSection id="data-retention" title="7. Data Retention">
        <p>
          We retain personal data only for as long as necessary to fulfil the purposes
          for which it was collected, including to satisfy legal, regulatory, tax,
          accounting, or reporting requirements.
        </p>
        <p>
          Typical retention periods:
        </p>
        <LegalList
          items={[
            "Account profile data — for the life of the account plus 7 years after closure",
            "Transaction records — minimum 7 years (regulatory requirement)",
            "KYC documents — minimum 5 years after the end of the business relationship",
            "Support correspondence — 3 years from last interaction",
            "Marketing data — until you withdraw consent",
          ]}
        />
      </LegalSection>

      <LegalSection id="your-rights" title="8. Your Rights under NDPR">
        <p>You have the following rights regarding your personal data:</p>
        <LegalList
          items={[
            "<strong>Right of access</strong> — request a copy of the personal data we hold about you",
            "<strong>Right of rectification</strong> — correct inaccurate or incomplete data",
            "<strong>Right of erasure</strong> — request deletion of your data, subject to legal exceptions",
            "<strong>Right to restrict processing</strong> — limit how we use your data in certain circumstances",
            "<strong>Right to data portability</strong> — receive your data in a structured, machine-readable format",
            "<strong>Right to object</strong> — object to processing based on legitimate interest or for direct marketing",
            "<strong>Right to withdraw consent</strong> — at any time, where processing is based on consent",
            "<strong>Right to lodge a complaint</strong> — with the Nigeria Data Protection Commission (NDPC)",
          ]}
        />
        <p>
          To exercise any of these rights, contact us at{" "}
          <a href="mailto:privacy@swaply.ng">privacy@swaply.ng</a>. We will respond within
          30 days, or such shorter period as required by law.
        </p>
      </LegalSection>

      <LegalSection id="security" title="9. Security Measures">
        <p>
          We employ industry-standard administrative, technical, and physical safeguards
          to protect your personal data, including:
        </p>
        <LegalList
          items={[
            "AES-256 encryption of sensitive data at rest and TLS 1.2+ in transit",
            "Two-factor authentication (2FA) and strong password enforcement",
            "Role-based access control (RBAC) and least-privilege principles",
            "Continuous monitoring, intrusion detection, and regular security audits",
            "PCI-DSS aligned controls for cardholder data (where applicable)",
            "Secure, audited data centres with redundancy and backup procedures",
          ]}
        />
        <LegalCallout variant="warning" title="No system is 100% secure">
          While we strive to protect your personal data, no method of transmission over
          the internet or electronic storage is completely secure. We cannot guarantee
          absolute security.
        </LegalCallout>
      </LegalSection>

      <LegalSection id="international-transfers" title="10. International Transfers">
        <p>
          Some of our service providers and infrastructure may be located outside Nigeria.
          Where we transfer your data internationally, we ensure that adequate safeguards
          are in place, such as:
        </p>
        <LegalList
          items={[
            "Transfers to jurisdictions with adequate data protection as recognized by the NDPC",
            "Binding contractual clauses and data processing agreements",
            "Explicit consent for specific cross-border transfers where required",
          ]}
        />
      </LegalSection>

      <LegalSection id="children" title="11. Children's Privacy">
        <p>
          Our Service is not directed to individuals under 18 years of age. We do not
          knowingly collect personal data from children. If you believe we have
          inadvertently collected data from a minor, please contact us so we can delete
          it promptly.
        </p>
      </LegalSection>

      <LegalSection id="third-party-links" title="12. Third-Party Links">
        <p>
          Our Service may contain links to third-party websites or services. We are not
          responsible for the privacy practices of those third parties. We encourage you
          to read their privacy policies before providing any personal data.
        </p>
      </LegalSection>

      <LegalSection id="changes" title="13. Changes to this Policy">
        <p>
          We may update this Privacy Policy from time to time. The &ldquo;Last updated&rdquo;
          date at the top of this page reflects when the policy was last revised.
          Material changes will be notified to you via email or in-app notice before they
          take effect.
        </p>
      </LegalSection>

      <LegalSection id="contact" title="14. Contact Us">
        <p>
          For any questions, comments, or requests regarding this Privacy Policy or our
          data practices, please contact our Data Protection Officer (DPO):
        </p>
        <div className="glass-card rounded-xl p-5 not-prose">
          <p className="text-foreground font-semibold">Swaply Technologies Limited</p>
          <p className="text-muted-foreground text-sm">Attn: Data Protection Officer</p>
          <p className="text-muted-foreground text-sm mt-2">
            Email: <a href="mailto:privacy@swaply.ng">privacy@swaply.ng</a>
          </p>
          <p className="text-muted-foreground text-sm">
            Phone: +234 800 123 4567
          </p>
          <p className="text-muted-foreground text-sm">
            Address: Victoria Island, Lagos, Nigeria
          </p>
        </div>
      </LegalSection>
    </LegalLayout>
  );
}
