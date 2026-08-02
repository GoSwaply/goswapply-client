import type { Metadata } from "next";
import LegalLayout, { LegalSection } from "@/components/legal/LegalLayout";
import { LegalList, LegalCallout } from "@/components/legal/LegalSection";

export const metadata: Metadata = {
  title: "Terms of Service - Swaply",
  description:
    "The terms governing your use of Swaply's wallet, bill payment, digital asset exchange, and flight booking services.",
};

const sections = [
  { id: "acceptance", title: "1. Acceptance of Terms" },
  { id: "eligibility", title: "2. Eligibility" },
  { id: "accounts", title: "3. Your Account" },
  { id: "wallet", title: "4. The Swaply Wallet" },
  { id: "funding", title: "5. Funding & Dedicated Accounts" },
  { id: "services", title: "6. Bills, Airtime & Data" },
  { id: "exchange", title: "7. Digital Asset & Gift Card Exchange" },
  { id: "fees", title: "8. Fees & Charges" },
  { id: "kyc", title: "9. Identity Verification & Limits" },
  { id: "prohibited", title: "10. Prohibited Use" },
  { id: "disputes", title: "11. Errors, Reversals & Disputes" },
  { id: "suspension", title: "12. Suspension & Termination" },
  { id: "liability", title: "13. Limitation of Liability" },
  { id: "changes", title: "14. Changes to these Terms" },
  { id: "contact", title: "15. Contact Us" },
];

export default function TermsOfServicePage() {
  return (
    <LegalLayout
      badge="Legal"
      title="Terms of Service"
      description="These Terms govern your access to and use of Swaply's wallet, bill payment, digital asset exchange, and flight booking services. Please read them carefully before creating an account."
      effectiveDate="January 1, 2026"
      lastUpdated="August 1, 2026"
      sections={sections}
    >
      <LegalSection id="acceptance" title="1. Acceptance of Terms">
        <p>
          These Terms of Service (&ldquo;Terms&rdquo;) form a binding agreement between
          you and <strong>Swaply Technologies Limited</strong> (&ldquo;Swaply&rdquo;,
          &ldquo;we&rdquo;, &ldquo;us&rdquo;), governing your use of our website, mobile
          application, and related services (collectively, the &ldquo;Service&rdquo;).
        </p>
        <p>
          By creating an account, or by accessing or using the Service, you confirm that
          you have read, understood, and agree to be bound by these Terms and by our{" "}
          <a href="/privacy">Privacy Policy</a>. If you do not agree, do not use the
          Service.
        </p>
      </LegalSection>

      <LegalSection id="eligibility" title="2. Eligibility">
        <p>To open and operate a Swaply account you must:</p>
        <LegalList
          items={[
            "Be at least 18 years old.",
            "Be legally capable of entering into a binding contract.",
            "Provide accurate, current, and complete registration information.",
            "Use the Service for your own account and not on behalf of another person without authorisation.",
          ]}
        />
        <p>
          We may decline to open, or may close, any account where these conditions are
          not met.
        </p>
      </LegalSection>

      <LegalSection id="accounts" title="3. Your Account">
        <p>
          You are responsible for maintaining the confidentiality of your password,
          transaction PIN, and any device used to access the Service. You must notify us
          immediately if you suspect unauthorised access.
        </p>
        <LegalCallout title="Keep your PIN private" variant="warning">
          Swaply staff will never ask you for your password, transaction PIN, one-time
          code, or BVN. Anyone who does is attempting to defraud you.
        </LegalCallout>
        <p>
          Activity carried out using your credentials is treated as authorised by you,
          except where you have told us they were compromised and we had a reasonable
          opportunity to act.
        </p>
      </LegalSection>

      <LegalSection id="wallet" title="4. The Swaply Wallet">
        <p>
          Your Swaply wallet holds a Naira balance you can use across our services. The
          wallet is a record of funds held with our licensed payment partners.
        </p>
        <LegalList
          items={[
            "Swaply is not a bank and does not pay interest on wallet balances.",
            "Wallet funds are not a deposit and are not insured as a bank deposit.",
            "We may place limits on balances or transactions in line with your verification level and applicable regulation.",
          ]}
        />
      </LegalSection>

      <LegalSection id="funding" title="5. Funding & Dedicated Accounts">
        <p>
          You may fund your wallet by card or bank transfer through our payment partner,
          or by transfer to a dedicated account number issued to you.
        </p>
        <p>
          A dedicated account is issued and operated by a licensed partner bank on your
          behalf. It is intended for funding your own wallet only. Funds transferred to
          it are credited automatically once the partner confirms receipt, which is
          normally within minutes but may take longer during bank downtime.
        </p>
        <LegalCallout title="Transfer only from an account in your own name" variant="warning">
          Third-party transfers into your dedicated account may be delayed, returned, or
          reported, in line with anti-money-laundering requirements.
        </LegalCallout>
      </LegalSection>

      <LegalSection id="services" title="6. Bills, Airtime & Data">
        <p>
          Airtime, data, electricity, and television payments are fulfilled by third
          party billers and aggregators. We pass your instruction to them and credit or
          refund your wallet based on the outcome they report.
        </p>
        <p>
          You are responsible for the accuracy of the details you provide — phone number,
          meter number, or smartcard number. A payment completed to details you supplied
          may not be recoverable.
        </p>
      </LegalSection>

      <LegalSection id="exchange" title="7. Digital Asset & Gift Card Exchange">
        <p>
          Rates shown for digital assets and gift cards are indicative and are fixed only
          at the point a submission is accepted. Submissions are reviewed before payout,
          and we may decline any submission.
        </p>
        <LegalList
          items={[
            "Digital asset prices are volatile; the rate you receive is the rate quoted at submission.",
            "Gift cards must be lawfully obtained and unused. We may request proof of purchase.",
            "We may decline or reverse a transaction where a card or asset is found to be invalid, used, or fraudulently obtained.",
          ]}
        />
      </LegalSection>

      <LegalSection id="fees" title="8. Fees & Charges">
        <p>
          Applicable fees are shown before you confirm a transaction. Third parties —
          including banks, card networks, and payment processors — may apply their own
          charges, which are outside our control.
        </p>
        <p>
          We may change our fees. Material changes will be notified in advance through
          the app or by email.
        </p>
      </LegalSection>

      <LegalSection id="kyc" title="9. Identity Verification & Limits">
        <p>
          Nigerian regulation requires us and our partners to verify customers. You agree
          to provide identity information we reasonably request, which may include your
          BVN, NIN, a government-issued document, or a photograph.
        </p>
        <p>
          Verification details submitted for the purpose of issuing a dedicated account
          are transmitted to our payment partner for that purpose. Transaction limits
          depend on your verification level and may change to meet regulatory
          requirements.
        </p>
      </LegalSection>

      <LegalSection id="prohibited" title="10. Prohibited Use">
        <p>You must not use the Service to:</p>
        <LegalList
          items={[
            "Break any law, or facilitate money laundering or terrorist financing.",
            "Impersonate another person, or use an account that is not yours.",
            "Handle proceeds of crime, or funds you are not entitled to.",
            "Interfere with, probe, or attempt to gain unauthorised access to our systems.",
            "Resell or commercially exploit the Service without our written consent.",
          ]}
        />
      </LegalSection>

      <LegalSection id="disputes" title="11. Errors, Reversals & Disputes">
        <p>
          If a transaction fails after your wallet has been debited, we will refund your
          wallet once the outcome is confirmed by the relevant provider. Some
          confirmations depend on third parties and can take several business days.
        </p>
        <p>
          Report any transaction you believe is incorrect or unauthorised as soon as
          possible, and no later than 30 days after it appears in your history, so we can
          investigate effectively.
        </p>
        <LegalCallout title="Do not retry an unconfirmed payment" variant="warning">
          If we tell you we could not confirm whether a payment completed, check your
          transaction history before trying again. Retrying may result in a second
          charge.
        </LegalCallout>
      </LegalSection>

      <LegalSection id="suspension" title="12. Suspension & Termination">
        <p>
          We may suspend or close an account where we reasonably suspect fraud, a breach
          of these Terms, or where we are required to do so by law or by a regulator.
          Where we are permitted to, we will tell you why.
        </p>
        <p>
          You may close your account at any time. Any remaining balance will be returned
          to a bank account in your name, subject to verification and to any legal hold.
        </p>
      </LegalSection>

      <LegalSection id="liability" title="13. Limitation of Liability">
        <p>
          The Service is provided on an &ldquo;as is&rdquo; basis. To the extent
          permitted by law, we are not liable for indirect or consequential loss, or for
          loss of profit, arising from your use of the Service.
        </p>
        <p>
          Nothing in these Terms excludes liability for fraud, or for anything that
          cannot lawfully be excluded.
        </p>
      </LegalSection>

      <LegalSection id="changes" title="14. Changes to these Terms">
        <p>
          We may update these Terms from time to time. The &ldquo;last updated&rdquo;
          date above reflects the most recent change. Where a change materially affects
          your rights, we will give notice through the app or by email before it takes
          effect. Continuing to use the Service after that point means you accept the
          revised Terms.
        </p>
      </LegalSection>

      <LegalSection id="contact" title="15. Contact Us">
        <p>
          Questions about these Terms can be sent to{" "}
          <a href="mailto:support@goswaply.com">support@goswaply.com</a>.
        </p>
        <p>
          <strong>Swaply Technologies Limited</strong>
          <br />
          Lagos, Nigeria
        </p>
      </LegalSection>
    </LegalLayout>
  );
}
