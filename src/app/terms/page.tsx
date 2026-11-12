import type { Metadata } from "next";
import LegalLayout, { LegalSection } from "@/components/legal/LegalLayout";
import { LegalList, LegalCallout } from "@/components/legal/LegalSection";

export const metadata: Metadata = {
  title: "Terms of Service - Swaply",
  description:
    "Terms governing access to Swaply accounts, wallet services, bill payments, exchange submissions, and partner services.",
};

const sections = [
  { id: "agreement", title: "1. Agreement and scope" },
  { id: "eligibility", title: "2. Eligibility and location" },
  { id: "account", title: "3. Account and security" },
  { id: "wallet", title: "4. Wallet and payment services" },
  { id: "funding", title: "5. Funding and withdrawals" },
  { id: "bills", title: "6. Bills, airtime and data" },
  { id: "exchange", title: "7. Crypto and gift-card submissions" },
  { id: "flights", title: "8. Flight partner referrals" },
  { id: "fees", title: "9. Prices, rates and fees" },
  { id: "verification", title: "10. Verification and compliance" },
  { id: "complaints", title: "11. Errors, cancellations and complaints" },
  { id: "acceptable-use", title: "12. Acceptable use" },
  { id: "suspension", title: "13. Restrictions and account closure" },
  { id: "availability", title: "14. Service availability" },
  { id: "third-parties", title: "15. Third-party services" },
  { id: "liability", title: "16. Liability" },
  { id: "intellectual-property", title: "17. Intellectual property" },
  { id: "changes", title: "18. Changes to these Terms" },
  { id: "law", title: "19. Governing law and consumer rights" },
  { id: "contact", title: "20. Contact" },
];

export default function TermsOfServicePage() {
  return (
    <LegalLayout
      badge="Legal"
      title="Terms of Service"
      description="These Terms explain how Swaply works, what you agree to when you use it, and how transaction issues are handled. Please read them before opening an account or making a transaction."
      effectiveDate="November 12, 2026"
      lastUpdated="November 12, 2026"
      sections={sections}
    >
      <LegalSection id="agreement" title="1. Agreement and scope">
        <p>
          These Terms of Service (&ldquo;Terms&rdquo;) are an agreement between you and
          <strong> Swaply Technologies Limited</strong> (&ldquo;Swaply&rdquo;,
          &ldquo;we&rdquo;, &ldquo;us&rdquo;). They apply when you access our website,
          mobile application, or related products (together, the &ldquo;Service&rdquo;).
          They should be read with our <a href="/privacy">Privacy Policy</a> and any
          product, price, or third-party terms shown before you confirm a transaction.
        </p>
        <p>
          By selecting the acceptance control during registration or using the Service
          after these Terms are presented, you agree to them. If you do not agree, do not
          create an account or use the affected service. These Terms do not take away
          rights that applicable law says cannot be waived.
        </p>
      </LegalSection>

      <LegalSection id="eligibility" title="2. Eligibility">
        <p>To open and use a Swaply account, you must:</p>
        <LegalList
          items={[
            "Be at least 18 years old.",
            "Have legal capacity to enter into a binding agreement.",
            "Provide accurate, current, and complete registration information.",
            "Use the account for yourself unless we have authorised you to act for another person.",
            "Be located in a place where the relevant Service is lawfully available to you.",
          ]}
        />
        <p>
          We may decline or restrict an account when eligibility, identity, security, or
          legal requirements are not met. Some services may only be available to users
          who pass additional checks.
        </p>
      </LegalSection>

      <LegalSection id="account" title="3. Account and security">
        <p>
          Keep your password, transaction PIN, one-time codes, and devices secure. Do not
          share them with anyone, including a person claiming to be Swaply support. Tell
          us promptly if you suspect that your account or credentials have been
          compromised.
        </p>
        <LegalCallout title="Keep your PIN private" variant="warning">
          Swaply support will not ask you to disclose your password, transaction PIN, or
          one-time code. Submit identity information only through the Service or another
          channel we identify as secure.
        </LegalCallout>
        <p>
          You are responsible for activity you initiate or approve. We will assess
          disputed or unauthorised transactions in accordance with applicable law and
          the relevant payment partner rules; use of a credential alone does not remove
          any rights you have by law.
        </p>
      </LegalSection>

      <LegalSection id="wallet" title="4. Wallet and payment services">
        <p>
          The wallet displays a Naira-denominated balance and transaction history for
          eligible uses of the Service. It is an electronic record in the Swaply
          platform, not a bank account opened by Swaply. Payment processing or funds
          handling may be carried out by a payment provider or financial institution
          identified in the relevant flow. The provider and applicable law determine
          the treatment and any protection of funds; these Terms do not promise bank
          deposit insurance.
        </p>
        <LegalList
          items={[
            "Swaply is not a bank and wallet balances do not earn interest unless we expressly state otherwise.",
            "We may apply transaction, balance, or service limits based on your verification level, risk checks, provider limits, and applicable law.",
            "A transaction may remain pending while we or a provider confirm its status; a pending display is not confirmation of final settlement.",
          ]}
        />
      </LegalSection>

      <LegalSection id="funding" title="5. Funding and withdrawals">
        <p>
          Funding methods may include card, bank transfer, or a dedicated account
          provided through a payment partner. A transfer is credited after the relevant
          provider confirms receipt and the transaction passes required checks. Delays
          may occur because of bank, network, provider, or compliance review.
        </p>
        <p>
          Use the account details shown in your own account and check the account name,
          number, bank, and any transfer instructions before sending funds. A dedicated
          account is for funding your Swaply wallet; it is not permission to receive
          funds for another person. Transfers sent to incorrect details or from a source
          requiring additional checks may be delayed, returned, or investigated.
        </p>
        <p>
          Where cash-out or withdrawal is available, requests are subject to available
          balance, verification, destination-account checks, limits, disclosed fees,
          and provider processing. A request may be held for review or rejected where
          required by law or to protect you. Do not repeat a request while its status is
          uncertain; check your transaction history or contact support first.
        </p>
      </LegalSection>

      <LegalSection id="bills" title="6. Bills, airtime and data">
        <p>
          Airtime, data, electricity, television, and other bill payments are fulfilled
          by external billers, aggregators, or networks. We submit the instruction you
          confirm and display the status returned by the relevant provider. Provider
          response times and availability are outside our direct control.
        </p>
        <p>
          Check the recipient phone number, meter number, smartcard number, service,
          amount, and any other details before confirming. A correctly completed
          purchase sent to details you supplied may not be reversible. If your wallet is
          debited but the provider reports failure or cannot confirm completion, we will
          investigate and return or release the amount when the outcome is confirmed,
          subject to applicable law.
        </p>
      </LegalSection>

      <LegalSection id="exchange" title="7. Crypto and gift-card submissions">
        <p>
          Crypto and gift-card services, where available, operate through quotes and
          submissions that may require manual review. A displayed estimate is not a
          guarantee of acceptance or payout. The rate, amount, fee, required evidence,
          and any expiry that apply will be shown in the transaction flow; check them
          before you submit.
        </p>
        <LegalList
          items={[
            "Digital-asset prices can change quickly. Blockchain transfers may be irreversible and may incur network fees. Check the asset, network, address, amount, and quote before you proceed.",
            "Only submit crypto or gift cards that you own or are authorised to sell. Gift cards must be genuine, unused, and lawfully obtained; we may request proof of ownership or purchase.",
            "A submission may be held, repriced with your agreement, declined, or returned if evidence is missing, a card is invalid or redeemed, an asset is not received, or a fraud/compliance check requires it.",
            "Do not send a gift-card code, private key, or recovery phrase except where the Service specifically and securely requests information needed for the submission. We will never ask for a wallet recovery phrase.",
          ]}
        />
        <p>
          Unless the transaction flow says otherwise, a submission is not complete and
          no payout is due until the relevant asset or card has been received and the
          submission is accepted under the displayed quote and review outcome.
        </p>
      </LegalSection>

      <LegalSection id="flights" title="8. Flight partner referrals">
        <p>
          When a flight link is available, it takes you to an independent travel
          partner. The partner, airline, or ticket issuer—not Swaply—searches inventory,
          accepts the booking, issues the ticket, and sets the applicable fare rules.
          You may leave the Swaply platform and will be subject to the partner’s terms
          and privacy notice before completing a booking.
        </p>
        <p>
          Review passenger names, dates, route, baggage, fare restrictions, and total
          price before paying. For cancellations, changes, or refunds, contact the
          booking partner or airline using the booking reference. Any cancellation
          charge or refund restriction must be disclosed by the supplier and remains
          subject to your rights under applicable consumer law.
        </p>
      </LegalSection>

      <LegalSection id="fees" title="9. Prices, rates and fees">
        <p>
          We will show the applicable price, exchange rate, platform fee, and other
          charges in the transaction flow before you confirm, where the information is
          available to us. The confirmation screen and any provider-specific terms form
          part of the transaction details. Do not proceed if the displayed amount or
          recipient is not what you intend.
        </p>
        <p>
          Banks, card networks, payment processors, airlines, or other suppliers may
          charge fees under their own terms. We will disclose charges we impose or know
          apply before confirmation. We may update future prices and fees; a change will
          not retroactively alter a transaction already confirmed, except where required
          to correct an error or permitted by law.
        </p>
      </LegalSection>

      <LegalSection id="verification" title="10. Verification and compliance">
        <p>
          We or a service provider may ask for identity, address, source-of-funds, or
          transaction information to operate a service, protect accounts, meet legal
          obligations, or investigate suspicious activity. This may include BVN, NIN,
          identity documents, selfie or biometric checks, or proof of ownership. Provide
          truthful information and tell us if it changes. We may be unable to provide a
          feature until required checks are completed.
        </p>
        <p>
          We and our providers may screen transactions, delay or reject a request, ask
          for further information, restrict an account, or report activity when required
          by law or reasonably necessary to prevent fraud or protect the Service. We
          may be unable to explain some restrictions where law prohibits disclosure.
          See the <a href="/privacy">Privacy Policy</a> for information about personal
          data processing and your data rights.
        </p>
      </LegalSection>

      <LegalSection id="complaints" title="11. Errors, cancellations and complaints">
        <p>
          Check transaction details before you confirm. Some instructions—such as an
          airtime top-up, utility payment, blockchain transfer, or a booking accepted by
          a supplier—may be processed immediately and cannot be cancelled or recovered
          once completed. This does not limit any cancellation, refund, or redress right
          that applicable law gives you.
        </p>
        <p>
          If a transaction is pending, do not repeat it until you have checked its status.
          If your wallet was debited for a transaction that the provider confirms failed,
          we will arrange a reversal or refund to the wallet as applicable. When a
          provider cannot yet confirm the outcome, we may need to investigate before
          releasing the funds. Refund timing can depend on the provider or payment rail;
          we will not describe an unconfirmed transaction as failed solely because a
          response is delayed.
        </p>
        <p>
          For a flight or other partner service, cancellation, changes, and refunds are
          governed by the supplier&apos;s disclosed fare or service rules and applicable
          consumer law. We will not apply a blanket no-refund rule where the law requires
          cancellation rights or a refund.
        </p>
        <p>
          Contact <a href="mailto:support@gswaply.com">support@gswaply.com</a> as soon
          as possible with your transaction reference, date, amount, and a description of
          the issue. Do not include your password, PIN, or one-time code. We will review
          the information and explain the outcome or any further steps. You may also
          contact a competent regulator or use another remedy available under law; these
          Terms do not require you to waive or exhaust a statutory right.
        </p>
      </LegalSection>

      <LegalSection id="acceptable-use" title="12. Acceptable use">
        <p>You must not use the Service to:</p>
        <LegalList
          items={[
            "Break a law, facilitate fraud, money laundering, terrorist financing, sanctions evasion, or another person’s unlawful activity.",
            "Use a false identity, impersonate another person, or access an account or payment instrument without authority.",
            "Submit stolen, counterfeit, already redeemed, or otherwise unlawfully obtained digital assets or gift cards.",
            "Misuse the Service to send, receive, or conceal funds for someone else without our prior approval.",
            "Interfere with the Service, probe or bypass security controls, introduce malicious code, or access data without permission.",
            "Resell, scrape, or commercially exploit the Service except as we have agreed in writing.",
          ]}
        />
      </LegalSection>

      <LegalSection id="suspension" title="13. Restrictions and account closure">
        <p>
          We may pause a transaction or restrict, suspend, or close access where we
          reasonably need to protect you or others, investigate suspected misuse, comply
          with a provider requirement, or meet a legal or regulatory obligation. We will
          give notice and reasons where lawful and appropriate. A restriction does not
          remove any right to ask us to review a decision or to use a legal remedy.
        </p>
        <p>
          You may request account closure through the Service. The current deletion flow
          requires you to withdraw any positive wallet balance first; it does not
          forfeit that balance. Pending transactions, disputes, or legal holds may need
          to be resolved before closure. Account closure does not require us to erase
          records that we must retain by law or for legitimate dispute, security, and
          accounting purposes. See the <a href="/delete-account">account deletion page</a>
          for the current process.
        </p>
      </LegalSection>

      <LegalSection id="availability" title="14. Service availability">
        <p>
          We work to keep the Service available, but we do not promise uninterrupted or
          error-free operation. Planned maintenance, connectivity problems, security
          events, or failures at a bank, network, biller, verification vendor, or other
          provider may make a feature temporarily unavailable or delay a transaction.
          We may change or discontinue a feature where reasonably necessary, subject to
          applicable law and any transaction already accepted.
        </p>
      </LegalSection>

      <LegalSection id="third-parties" title="15. Third-party services">
        <p>
          The Service relies on independent providers for payment processing, bank
          transfers, identity checks, utilities, communications, and partner offers.
          Their own terms, privacy notices, operational rules, and service availability
          may apply. We remain responsible for obligations that applicable law places
          on us; referring you to a provider does not waive your rights against Swaply
          or that provider.
        </p>
      </LegalSection>

      <LegalSection id="liability" title="16. Liability">
        <p>
          Nothing in these Terms excludes or limits liability, a remedy, or a consumer
          right that cannot lawfully be excluded or limited, including liability for
          fraud or wilful misconduct where applicable.
        </p>
        <p>
          Subject to that rule, we are not responsible for loss caused by your failure
          to protect your credentials, incorrect details you entered and confirmed, or
          an independent provider&apos;s act or outage to the extent that loss was outside
          our reasonable control. We remain responsible for our own acts, omissions, and
          duties under applicable law. To the extent permitted by law, we are not liable
          for indirect or consequential loss that was not reasonably foreseeable when
          you used the Service.
        </p>
      </LegalSection>

      <LegalSection id="intellectual-property" title="17. Intellectual property">
        <p>
          Swaply and its licensors own the Service and its content, branding, software,
          and design, except for materials owned by third parties. We give you a limited,
          personal, revocable, non-transferable right to use the Service for its intended
          purpose while you comply with these Terms. You may not copy, modify, distribute,
          reverse engineer, or commercially exploit the Service unless applicable law
          permits it or we agree in writing.
        </p>
      </LegalSection>

      <LegalSection id="changes" title="18. Changes to these Terms">
        <p>
          We may update these Terms to reflect product, provider, legal, or security
          changes. We will update the date above and, where a change materially affects
          your rights, give reasonable notice through the Service or by email where
          practicable. If you do not accept a material change, stop using the affected
          feature and contact us about closing your account. Continued use after the
          effective date means acceptance only to the extent permitted by law; it does
          not waive rights that cannot be waived.
        </p>
      </LegalSection>

      <LegalSection id="law" title="19. Governing law and consumer rights">
        <p>
          These Terms and disputes about the Service are governed by the laws of the
          Federal Republic of Nigeria, subject to mandatory consumer protections and any
          applicable rules on jurisdiction. We encourage you to contact us first so we
          can try to resolve a complaint. You may still refer a matter to the Federal
          Competition and Consumer Protection Commission, the Central Bank of Nigeria
          where it concerns a regulated financial provider, the Nigeria Data Protection
          Commission for data-protection matters, or another competent authority where
          the law permits.
        </p>
        <p>
          Nothing in these Terms prevents you from exercising a right under the Federal
          Competition and Consumer Protection Act 2018, the Nigeria Data Protection Act
          2023, or any other applicable law. You may find further information on the
          <a href="https://fccpc.gov.ng/consumers/consumer-rights-responsibilities/rights-responsibilities/" target="_blank" rel="noreferrer"> FCCPC consumer rights page</a> and the
          <a href="https://ndpc.gov.ng/" target="_blank" rel="noreferrer"> Nigeria Data Protection Commission website</a>.
        </p>
      </LegalSection>

      <LegalSection id="contact" title="20. Contact">
        <p>
          For account, transaction, or Terms questions, contact{" "}
          <a href="mailto:support@gswaply.com">support@gswaply.com</a> or call +234
          909 449 8704. Please include your transaction reference where relevant, and
          do not send your password, transaction PIN, or one-time code.
        </p>
        <p>
          <strong>Swaply Technologies Limited</strong>
          <br />
          3 Kenyata Street, Uwani, Enugu, Enugu State, Nigeria.
        </p>
      </LegalSection>
    </LegalLayout>
  );
}
